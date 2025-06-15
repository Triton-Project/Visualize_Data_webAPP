import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { TelemetryDataPoint } from '../types';

interface TrackPolylineProps {
  vehicleId: string;
  data: TelemetryDataPoint[];
  isSelected: boolean;
}

export const TrackPolyline: React.FC<TrackPolylineProps> = ({
  vehicleId,
  data,
  isSelected,
}) => {
  if (data.length < 2) return null;

  const path = data.map(point => ({
    lat: point.latitude,
    lng: point.longitude,
  }));

  const polylineOptions: google.maps.PolylineOptions = {
    path,
    geodesic: true,
    strokeColor: isSelected ? '#58a6ff' : '#8b949e',
    strokeOpacity: isSelected ? 0.8 : 0.5,
    strokeWeight: isSelected ? 3 : 2,
    zIndex: isSelected ? 100 : 50,
  };

  return <Polyline options={polylineOptions} />;
};