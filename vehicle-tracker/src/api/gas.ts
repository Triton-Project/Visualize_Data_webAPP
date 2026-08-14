import type { GASResponse, VehicleData, TelemetryDataPoint, VehicleTracks } from '../types';

const GAS_ENDPOINT = import.meta.env.VITE_GAS_ENDPOINT;

if (!GAS_ENDPOINT) {
  console.warn('VITE_GAS_ENDPOINT not configured. Please set it in your .env file.');
}

export class GASApiError extends Error {
  status?: number;
  responseBody?: string;

  constructor(message: string, status?: number, responseBody?: string) {
    super(message);
    this.name = 'GASApiError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

interface LegacyTelemetryDataPoint {
  time?: string;
  tmp?: number | string;
  prs?: number | string;
  wtmp?: number | string;
  waterTemp?: number | string;
  Lat?: number | string;
  Lng?: number | string;
}

function hasValidCoordinates(point: Pick<TelemetryDataPoint, 'latitude' | 'longitude'>): boolean {
  const { latitude, longitude } = point;
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180
    && !(latitude === 0 && longitude === 0);
}

async function requestGAS<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  if (!GAS_ENDPOINT) {
    throw new GASApiError('GAS endpoint not configured');
  }

  const url = new URL(GAS_ENDPOINT);
  url.searchParams.set('action', action);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new GASApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const responseBody = await response.text();

    try {
      return JSON.parse(responseBody) as T;
    } catch {
      const summary = responseBody.trim().slice(0, 120) || '(empty response)';
      throw new GASApiError(
        `GAS API returned a non-JSON response: ${summary}`,
        response.status,
        responseBody,
      );
    }
  } catch (error) {
    if (error instanceof GASApiError) {
      throw error;
    }

    throw new GASApiError(
      error instanceof Error ? error.message : 'Network error'
    );
  }
}

async function fetchGAS<T extends object>(action: string, params: Record<string, string> = {}): Promise<GASResponse<T>> {
  const data = await requestGAS<GASResponse<T>>(action, params);

  if (data.status === 'error') {
    throw new GASApiError(data.message || 'Unknown error from GAS API');
  }

  return data;
}

async function getLegacyVehicleTracks(): Promise<VehicleTracks> {
  const legacyData = await requestGAS<LegacyTelemetryDataPoint[]>('getData');

  if (!Array.isArray(legacyData)) {
    throw new GASApiError('Legacy GAS API returned an unexpected data format');
  }

  const toNumber = (value: number | string | undefined): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const data = legacyData
    .map((point): TelemetryDataPoint => ({
      timestamp: point.time || new Date().toISOString(),
      vehicleId: 'DRONE_001',
      latitude: toNumber(point.Lat),
      longitude: toNumber(point.Lng),
      altitude: 0,
      satellites: 0,
      waterTemperature: toNumber(point.wtmp ?? point.waterTemp),
      airPressure: toNumber(point.prs),
      airTemperature: toNumber(point.tmp),
    }))
    .filter(hasValidCoordinates)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return { DRONE_001: data };
}

export async function getAllVehicles(): Promise<VehicleTracks> {
  try {
    const response = await fetchGAS<{ vehicles: VehicleData[] }>('getAllVehicles');

    const tracks: VehicleTracks = {};

    if (response.vehicles) {
      response.vehicles.forEach(vehicle => {
        tracks[vehicle.vehicleId] = vehicle.data.filter(hasValidCoordinates);
      });
    }

    return tracks;
  } catch (error) {
    if (error instanceof GASApiError && error.responseBody?.trim() === 'No Data') {
      console.info('The configured GAS endpoint uses the legacy getData API. Applying compatibility mapping.');
      return getLegacyVehicleTracks();
    }

    throw error;
  }
}

// These functions require the current multi-vehicle GAS contract.
export async function getVehicle(vehicleId: string): Promise<TelemetryDataPoint[]> {
  const response = await fetchGAS<{ data: TelemetryDataPoint[] }>('getVehicle', { vehicleId });
  return response.data || [];
}

export async function getVehicleList(): Promise<string[]> {
  const response = await fetchGAS<{ 
    vehicles: Array<{ vehicleId: string; dataCount: number }> 
  }>('getVehicleList');
  
  return response.vehicles?.map(v => v.vehicleId) || [];
}

export async function postTelemetryData(data: Record<string, unknown>): Promise<void> {
  if (!GAS_ENDPOINT) {
    throw new GASApiError('GAS endpoint not configured');
  }

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new GASApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    const result = await response.json();
    
    if (result.status === 'error') {
      throw new GASApiError(result.message || 'Unknown error from GAS API');
    }
  } catch (error) {
    if (error instanceof GASApiError) {
      throw error;
    }
    
    throw new GASApiError(
      error instanceof Error ? error.message : 'Network error'
    );
  }
}
