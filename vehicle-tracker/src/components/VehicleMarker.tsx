import React from 'react';
import { Marker } from '@react-google-maps/api';
import { TelemetryDataPoint } from '../types';
import { useAppStore } from '../store';

interface VehicleMarkerProps {
  vehicleId: string;
  dataPoint: TelemetryDataPoint;
  isSelected: boolean;
}

export const VehicleMarker: React.FC<VehicleMarkerProps> = ({
  vehicleId,
  dataPoint,
  isSelected,
}) => {
  const { setSelectedDataPoint, setSelectedVehicle } = useAppStore();

  const handleMarkerClick = () => {
    setSelectedVehicle(vehicleId);
    setSelectedDataPoint(dataPoint);
  };

  // Create custom marker icon
  const markerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: isSelected ? '#58a6ff' : '#c9d1d9',
    fillOpacity: 1,
    strokeColor: '#0d1117',
    strokeWeight: 2,
    scale: isSelected ? 12 : 8,
  };

  return (
    <Marker
      position={{
        lat: dataPoint.latitude,
        lng: dataPoint.longitude,
      }}
      onClick={handleMarkerClick}
      icon={markerIcon}
      title={`${vehicleId} - ${new Date(dataPoint.timestamp).toLocaleString()}`}
      animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
      zIndex={isSelected ? 1000 : 100}
    />
  );
};