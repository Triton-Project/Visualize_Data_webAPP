import { create } from 'zustand';
import { TelemetryDataPoint, VehicleTracks, ConnectionStatus } from '../types';

interface AppState {
  // Vehicle data
  vehicleTracks: VehicleTracks;
  selectedVehicleId: string | null;
  selectedDataPoint: TelemetryDataPoint | null;
  
  // UI state
  isSidePanelOpen: boolean;
  refreshInterval: number; // in seconds
  isPaused: boolean;
  
  // Connection status
  connectionStatus: ConnectionStatus;
  
  // Map state
  mapCenter: google.maps.LatLngLiteral | null;
  mapZoom: number;
  
  // Actions
  setVehicleTracks: (tracks: VehicleTracks) => void;
  setSelectedVehicle: (vehicleId: string | null) => void;
  setSelectedDataPoint: (dataPoint: TelemetryDataPoint | null) => void;
  setSidePanelOpen: (open: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setPaused: (paused: boolean) => void;
  setConnectionStatus: (status: Partial<ConnectionStatus>) => void;
  setMapCenter: (center: google.maps.LatLngLiteral) => void;
  setMapZoom: (zoom: number) => void;
  
  // Computed getters
  getVehicleIds: () => string[];
  getSelectedVehicleData: () => TelemetryDataPoint[];
  getLatestDataPoint: (vehicleId: string) => TelemetryDataPoint | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  vehicleTracks: {},
  selectedVehicleId: null,
  selectedDataPoint: null,
  isSidePanelOpen: false,
  refreshInterval: 5,
  isPaused: false,
  connectionStatus: {
    isConnected: false,
    lastUpdate: null,
    retryCount: 0,
  },
  mapCenter: null,
  mapZoom: 12,
  
  // Actions
  setVehicleTracks: (tracks) => set({ vehicleTracks: tracks }),
  
  setSelectedVehicle: (vehicleId) => set({ 
    selectedVehicleId: vehicleId,
    selectedDataPoint: null,
    isSidePanelOpen: false,
  }),
  
  setSelectedDataPoint: (dataPoint) => set({ 
    selectedDataPoint: dataPoint,
    isSidePanelOpen: !!dataPoint,
  }),
  
  setSidePanelOpen: (open) => set({ isSidePanelOpen: open }),
  
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  
  setPaused: (paused) => set({ isPaused: paused }),
  
  setConnectionStatus: (status) => set((state) => ({
    connectionStatus: { ...state.connectionStatus, ...status }
  })),
  
  setMapCenter: (center) => set({ mapCenter: center }),
  
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  
  // Computed getters
  getVehicleIds: () => Object.keys(get().vehicleTracks),
  
  getSelectedVehicleData: () => {
    const { selectedVehicleId, vehicleTracks } = get();
    return selectedVehicleId ? vehicleTracks[selectedVehicleId] || [] : [];
  },
  
  getLatestDataPoint: (vehicleId: string) => {
    const tracks = get().vehicleTracks[vehicleId];
    return tracks && tracks.length > 0 ? tracks[tracks.length - 1] : null;
  },
}));