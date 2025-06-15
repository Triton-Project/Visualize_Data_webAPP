import React, { useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { VehicleTabs } from './components/VehicleTabs';
import { MapContainer } from './components/MapContainer';
import { SidePanel } from './components/SidePanel';
import { StatusBar } from './components/StatusBar';
import { useVehicleData } from './hooks/useVehicleData';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './store';

function App() {
  const { vehicleTracks, error, isLoading } = useVehicleData();
  const { setSelectedVehicle, selectedVehicleId, getVehicleIds } = useAppStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Auto-select first vehicle when data loads
  useEffect(() => {
    const vehicleIds = getVehicleIds();
    if (vehicleIds.length > 0 && !selectedVehicleId) {
      setSelectedVehicle(vehicleIds[0]);
    }
  }, [vehicleTracks, selectedVehicleId, setSelectedVehicle, getVehicleIds]);

  return (
    <div className="min-h-screen bg-dark-bg p-4">
      <div className="max-w-7xl mx-auto">
        <TopBar />
        
        <VehicleTabs />
        
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          <MapContainer />
        </div>
        
        <StatusBar />
        
        <SidePanel />
        
        {/* Loading overlay */}
        {isLoading && Object.keys(vehicleTracks).length === 0 && (
          <div className="fixed inset-0 bg-dark-bg/80 flex items-center justify-center z-50">
            <div className="card p-8 text-center">
              <div className="animate-spin w-12 h-12 border-2 border-dark-accent border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-dark-text">Loading vehicle data...</div>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && Object.keys(vehicleTracks).length === 0 && (
          <div className="fixed inset-0 bg-dark-bg/80 flex items-center justify-center z-50">
            <div className="card p-8 text-center max-w-md">
              <div className="text-red-400 mb-4">Failed to load data</div>
              <div className="text-dark-muted text-sm mb-4">
                {error.message || 'Unknown error occurred'}
              </div>
              <div className="text-dark-muted text-xs">
                Please check your .env configuration and GAS endpoint.
              </div>
            </div>
          </div>
        )}
        
        {/* Help overlay */}
        <div className="fixed bottom-2 left-2 text-xs text-dark-muted">
          <div>Shortcuts: [/] switch tabs • P pause • E export • ESC close panel</div>
        </div>
      </div>
    </div>
  );
}

export default App;