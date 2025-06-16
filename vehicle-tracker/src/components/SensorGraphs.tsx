import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { useAppStore } from '../store';
import { TelemetryDataPoint } from '../types';

interface ChartData {
  timestamp: string;
  time: string;
  waterTemperature: number;
  airTemperature: number;
  airPressure: number;
  altitude: number;
  satellites: number;
}

export const SensorGraphs: React.FC = () => {
  const { selectedVehicleId, getSelectedVehicleData } = useAppStore();
  const vehicleData = getSelectedVehicleData();

  if (!selectedVehicleId || vehicleData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-dark-muted">
          <div className="text-lg mb-2">No Data Available</div>
          <div className="text-sm">
            {!selectedVehicleId 
              ? 'Select a vehicle to view sensor graphs' 
              : 'No sensor data found for this vehicle'
            }
          </div>
        </div>
      </div>
    );
  }

  const chartData: ChartData[] = vehicleData.map((point: TelemetryDataPoint) => ({
    timestamp: point.timestamp,
    time: new Date(point.timestamp).toLocaleTimeString(),
    waterTemperature: point.waterTemperature,
    airTemperature: point.airTemperature,
    airPressure: point.airPressure,
    altitude: point.altitude,
    satellites: point.satellites,
  }));

  const chartConfig = {
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
    className: "text-dark-text",
  };

  return (
    <div className="h-full p-4 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text">
          Sensor Data - {selectedVehicleId}
        </h2>
        <div className="text-sm text-dark-muted">
          {vehicleData.length} data points
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="card p-4">
        <h3 className="text-lg font-medium text-dark-text mb-4">Temperature (°C)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="waterTemperature" 
                stroke="#06B6D4" 
                strokeWidth={2}
                name="Water Temperature"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="airTemperature" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Air Temperature"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Air Pressure Chart */}
      <div className="card p-4">
        <h3 className="text-lg font-medium text-dark-text mb-4">Air Pressure (hPa)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="airPressure" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Air Pressure"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Altitude Chart */}
      <div className="card p-4">
        <h3 className="text-lg font-medium text-dark-text mb-4">Altitude (m)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="altitude" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Altitude"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satellites Chart */}
      <div className="card p-4">
        <h3 className="text-lg font-medium text-dark-text mb-4">GPS Satellites</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} {...chartConfig}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="stepAfter" 
                dataKey="satellites" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Satellites"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};