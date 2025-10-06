// === Real-time Energy Dashboard ===
// Live monitoring of energy production, consumption, and grid integration

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EnergyData, SolarProject } from '../types/enhanced-solar-project';

interface EnergyDashboardProps {
  project: SolarProject;
  className?: string;
}

export const EnergyDashboard = ({ project, className }: EnergyDashboardProps) => {
  const [energyData, setEnergyData] = useState<EnergyData>(project.energy_data);
  const [isLive, setIsLive] = useState(true);
  const [historicalData, setHistoricalData] = useState<
    Array<{
      time: string;
      production: number;
      consumption: number;
    }>
  >([]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setEnergyData((prev) => {
        // Simulate fluctuations based on time and weather
        const now = new Date();
        const hour = now.getHours();
        const baseProduction = project.capacity_kw * 0.8; // 80% max capacity

        // Solar production pattern (peak at noon)
        const solarMultiplier = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
        const weatherImpact = prev.weather_conditions.sunlight_intensity_percent / 100;
        const randomVariation = 0.9 + Math.random() * 0.2; // ±10% variation

        const newProduction = Math.max(
          0,
          baseProduction * solarMultiplier * weatherImpact * randomVariation
        );
        const newConsumption = prev.current_consumption_kw * (0.95 + Math.random() * 0.1); // ±5% variation

        return {
          ...prev,
          current_production_kw: Math.round(newProduction * 10) / 10,
          current_consumption_kw: Math.round(newConsumption * 10) / 10,
          efficiency_percent: Math.round((newProduction / project.capacity_kw) * 100 * 10) / 10,
          last_updated: new Date(),
        };
      });

      // Update historical data
      setHistoricalData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          production: energyData.current_production_kw,
          consumption: energyData.current_consumption_kw,
        };
        return [...prev.slice(-23), newPoint]; // Keep last 24 points
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [
    isLive,
    project.capacity_kw,
    energyData.current_production_kw,
    energyData.current_consumption_kw,
  ]);

  // Calculate net energy
  const netEnergy = energyData.current_production_kw - energyData.current_consumption_kw;
  const isExporting = netEnergy > 0;

  // Get status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'maintenance':
        return 'text-yellow-400';
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-400';
    if (efficiency >= 70) return 'text-yellow-400';
    if (efficiency >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-white mb-2'>⚡ Real-time Energy Monitor</h2>
          <p className='text-gray-400'>{project.name}</p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div
              className={`w-3 h-3 rounded-full ${
                isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
              }`}
            ></div>
            <span className='text-white text-sm'>{isLive ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded text-sm ${
              isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white transition-colors`}
          >
            {isLive ? 'Stop' : 'Start'} Live Data
          </button>
        </div>
      </div>

      {/* Main Energy Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Production */}
        <motion.div
          className='bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border border-green-500/30'
          whileHover={{ scale: 1.02 }}
        >
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-green-400 font-bold'>☀️ Production</h3>
            <span className='text-xs text-green-300'>
              Updated: {energyData.last_updated.toLocaleTimeString()}
            </span>
          </div>
          <div className='text-3xl font-bold text-white mb-1'>
            {energyData.current_production_kw.toFixed(1)}{' '}
            <span className='text-lg text-gray-300'>kW</span>
          </div>
          <div className='text-sm text-gray-300'>
            Daily: {energyData.daily_production_kwh.toLocaleString()} kWh
          </div>
          <div className='text-sm text-gray-300'>
            Monthly: {energyData.monthly_production_kwh.toLocaleString()} kWh
          </div>
        </motion.div>

        {/* Consumption */}
        <motion.div
          className='bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border border-blue-500/30'
          whileHover={{ scale: 1.02 }}
        >
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-blue-400 font-bold'>🏠 Consumption</h3>
            <div
              className={`w-2 h-2 rounded-full ${getStatusColor(
                energyData.grid_connection_status
              )}`}
            ></div>
          </div>
          <div className='text-3xl font-bold text-white mb-1'>
            {energyData.current_consumption_kw.toFixed(1)}{' '}
            <span className='text-lg text-gray-300'>kW</span>
          </div>
          <div className='text-sm text-gray-300'>
            Grid Status:{' '}
            <span className={getStatusColor(energyData.grid_connection_status)}>
              {energyData.grid_connection_status.replace('_', ' ')}
            </span>
          </div>
          <div className='text-sm text-gray-300'>
            {project.community.households_served} households connected
          </div>
        </motion.div>

        {/* Net Energy */}
        <motion.div
          className={`bg-gradient-to-br ${
            isExporting
              ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
              : 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
          } rounded-lg p-4 border`}
          whileHover={{ scale: 1.02 }}
        >
          <div className='flex items-center justify-between mb-2'>
            <h3 className={`font-bold ${isExporting ? 'text-yellow-400' : 'text-purple-400'}`}>
              {isExporting ? '📤 Exporting' : '📥 Importing'}
            </h3>
            <span className={`text-xs ${getEfficiencyColor(energyData.efficiency_percent)}`}>
              {energyData.efficiency_percent.toFixed(1)}% eff
            </span>
          </div>
          <div className='text-3xl font-bold text-white mb-1'>
            {Math.abs(netEnergy).toFixed(1)} <span className='text-lg text-gray-300'>kW</span>
          </div>
          <div className='text-sm text-gray-300'>
            {isExporting ? 'Selling to grid' : 'Buying from grid'}
          </div>
          <div className='text-sm text-gray-300'>
            Revenue: ₹{Math.abs(netEnergy * 5).toFixed(0)}/hour
          </div>
        </motion.div>
      </div>

      {/* Weather Conditions */}
      <div className='bg-gray-800/50 rounded-lg p-4 mb-6'>
        <h3 className='text-white font-bold mb-3 flex items-center gap-2'>
          🌤️ Current Weather Conditions
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div className='text-center'>
            <div className='text-2xl mb-1'>🌡️</div>
            <div className='text-gray-400'>Temperature</div>
            <div className='text-white font-bold'>
              {energyData.weather_conditions.temperature_c}°C
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-1'>☀️</div>
            <div className='text-gray-400'>Sunlight</div>
            <div className='text-white font-bold'>
              {energyData.weather_conditions.sunlight_intensity_percent}%
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-1'>💨</div>
            <div className='text-gray-400'>Wind Speed</div>
            <div className='text-white font-bold'>
              {energyData.weather_conditions.wind_speed_kmh} km/h
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl mb-1'>📊</div>
            <div className='text-gray-400'>System Health</div>
            <div className={`font-bold ${getEfficiencyColor(energyData.efficiency_percent)}`}>
              {energyData.efficiency_percent > 80
                ? 'Excellent'
                : energyData.efficiency_percent > 60
                  ? 'Good'
                  : energyData.efficiency_percent > 40
                    ? 'Fair'
                    : 'Poor'}
            </div>
          </div>
        </div>
        <div className='mt-3 text-center'>
          <p className='text-gray-300 text-sm'>
            {energyData.weather_conditions.weather_description}
          </p>
        </div>
      </div>

      {/* Historical Chart (Simplified) */}
      <div className='bg-gray-800/50 rounded-lg p-4'>
        <h3 className='text-white font-bold mb-3 flex items-center gap-2'>
          📈 Recent Performance
          <span className='text-xs text-gray-400'>({historicalData.length} data points)</span>
        </h3>

        {historicalData.length > 0 ? (
          <div className='relative h-32 bg-black/40 rounded overflow-hidden'>
            <div className='absolute inset-0 flex items-end justify-between px-2 pb-2'>
              {historicalData.slice(-12).map((point, index) => {
                const maxValue = Math.max(
                  ...historicalData.map((p) => Math.max(p.production, p.consumption))
                );
                const productionHeight = (point.production / maxValue) * 100;
                const consumptionHeight = (point.consumption / maxValue) * 100;

                return (
                  <div key={index} className='flex flex-col items-center gap-1 flex-1'>
                    {/* Production Bar */}
                    <div
                      className='w-2 bg-green-400 rounded-t'
                      style={{ height: `${productionHeight}%` }}
                      title={`Production: ${point.production.toFixed(1)} kW at ${point.time}`}
                    ></div>
                    {/* Consumption Bar */}
                    <div
                      className='w-2 bg-blue-400 rounded-t'
                      style={{ height: `${consumptionHeight}%` }}
                      title={`Consumption: ${point.consumption.toFixed(1)} kW at ${point.time}`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className='h-32 bg-black/40 rounded flex items-center justify-center text-gray-400'>
            Collecting live data...
          </div>
        )}

        <div className='flex justify-center gap-6 mt-3 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-green-400 rounded'></div>
            <span className='text-gray-300'>Production</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-blue-400 rounded'></div>
            <span className='text-gray-300'>Consumption</span>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {energyData.efficiency_percent < 60 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3'
        >
          <div className='flex items-center gap-2 text-red-400 font-bold'>⚠️ System Alert</div>
          <p className='text-gray-300 text-sm mt-1'>
            Efficiency below optimal levels. Check panel cleaning and system maintenance.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EnergyDashboard;
