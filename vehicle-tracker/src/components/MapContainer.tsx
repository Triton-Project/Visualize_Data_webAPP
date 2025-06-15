import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useAppStore } from '../store';
import { DEFAULT_MAP_OPTIONS, DEFAULT_CENTER } from '../constants/map';
import { VehicleMarker } from './VehicleMarker';
import { TrackPolyline } from './TrackPolyline';

const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = [];

export const MapContainer: React.FC = () => {
  const { 
    selectedVehicleId, 
    vehicleTracks, 
    mapCenter, 
    mapZoom, 
    setMapCenter, 
    setMapZoom,
    getSelectedVehicleData,
    getLatestDataPoint,
  } = useAppStore();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GMAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Auto-center on selected vehicle's latest position
  useEffect(() => {
    if (selectedVehicleId && map) {
      const latestPoint = getLatestDataPoint(selectedVehicleId);
      if (latestPoint) {
        const center = {
          lat: latestPoint.latitude,
          lng: latestPoint.longitude,
        };
        setMapCenter(center);
        map.panTo(center);
      }
    }
  }, [selectedVehicleId, map, getLatestDataPoint, setMapCenter]);

  // Auto-center on first vehicle when data loads
  useEffect(() => {
    if (!selectedVehicleId && Object.keys(vehicleTracks).length > 0 && map) {
      const firstVehicleId = Object.keys(vehicleTracks)[0];
      const latestPoint = getLatestDataPoint(firstVehicleId);
      if (latestPoint) {
        const center = {
          lat: latestPoint.latitude,
          lng: latestPoint.longitude,
        };
        setMapCenter(center);
        map.panTo(center);
      }
    }
  }, [vehicleTracks, selectedVehicleId, map, getLatestDataPoint, setMapCenter]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onCenterChanged = useCallback(() => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        setMapCenter({ lat: center.lat(), lng: center.lng() });
      }
    }
  }, [map, setMapCenter]);

  const onZoomChanged = useCallback(() => {
    if (map) {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        setMapZoom(zoom);
      }
    }
  }, [map, setMapZoom]);

  if (loadError) {
    return (
      <div className="card p-8 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-2">Failed to load Google Maps</div>
          <div className="text-dark-muted text-sm">
            Please check your API key configuration
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="card p-8 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-dark-accent border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-dark-muted">Loading map...</div>
        </div>
      </div>
    );
  }

  const selectedVehicleData = getSelectedVehicleData();
  const currentCenter = mapCenter || DEFAULT_CENTER;

  return (
    <div className="card overflow-hidden flex-1 relative">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={currentCenter}
        zoom={mapZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onCenterChanged={onCenterChanged}
        onZoomChanged={onZoomChanged}
        options={DEFAULT_MAP_OPTIONS}
      >
        {/* Render polylines for all vehicles */}
        {Object.entries(vehicleTracks).map(([vehicleId, data]) => (
          <TrackPolyline
            key={vehicleId}
            vehicleId={vehicleId}
            data={data}
            isSelected={vehicleId === selectedVehicleId}
          />
        ))}

        {/* Render markers for all vehicles */}
        {Object.entries(vehicleTracks).map(([vehicleId, data]) => {
          const latestPoint = data[data.length - 1];
          if (!latestPoint) return null;
          
          return (
            <VehicleMarker
              key={vehicleId}
              vehicleId={vehicleId}
              dataPoint={latestPoint}
              isSelected={vehicleId === selectedVehicleId}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
};