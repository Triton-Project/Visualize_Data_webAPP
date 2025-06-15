import React from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';

export const VehicleTabs: React.FC = () => {
  const { 
    vehicleTracks, 
    selectedVehicleId, 
    setSelectedVehicle,
    getLatestDataPoint,
    setMapCenter,
  } = useAppStore();

  const vehicleIds = Object.keys(vehicleTracks);

  const handleTabClick = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    
    // Center map on latest position
    const latestPoint = getLatestDataPoint(vehicleId);
    if (latestPoint) {
      setMapCenter({
        lat: latestPoint.latitude,
        lng: latestPoint.longitude,
      });
    }
  };

  if (vehicleIds.length === 0) {
    return (
      <div className="card p-4 mb-4">
        <div className="text-center text-dark-muted">
          No vehicles found. Check your connection or data source.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {vehicleIds.map((vehicleId) => {
          const isSelected = selectedVehicleId === vehicleId;
          const latestPoint = getLatestDataPoint(vehicleId);
          const dataCount = vehicleTracks[vehicleId]?.length || 0;
          
          return (
            <motion.button
              key={vehicleId}
              onClick={() => handleTabClick(vehicleId)}
              className={`
                flex-shrink-0 px-4 py-3 rounded-card border transition-all duration-150 ease-out
                ${isSelected 
                  ? 'bg-dark-accent text-white border-dark-accent' 
                  : 'bg-dark-surface text-dark-text border-dark-muted/30 hover:border-dark-accent/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-left">
                <div className="font-medium text-sm">
                  {vehicleId}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {dataCount} points
                </div>
                {latestPoint && (
                  <div className="text-xs opacity-60 mt-1">
                    Last: {new Date(latestPoint.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};