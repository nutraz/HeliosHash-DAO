#!/usr/bin/env python3
"""
HHDAO Thermal Management and IoT Simulation System
Implements waterless cooling models and heat optimization for solar farms
"""

import numpy as np
import json
import sys
import argparse
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from pathlib import Path

class ThermalSimulator:
    def __init__(self):
        # Physical constants
        self.STEFAN_BOLTZMANN = 5.67e-8  # W/m²K⁴
        self.AIR_DENSITY = 1.225  # kg/m³ at 15°C
        self.AIR_SPECIFIC_HEAT = 1005  # J/kg·K
        
        # Terracotta cooling properties (from research)
        self.TERRACOTTA_EMISSIVITY = 0.85
        self.TERRACOTTA_THERMAL_CONDUCTIVITY = 0.8  # W/m·K
        self.TERRACOTTA_POROSITY = 0.25
        
        # Solar panel efficiency parameters
        self.PANEL_REFERENCE_EFFICIENCY = 0.22  # 22% at 25°C
        self.TEMPERATURE_COEFFICIENT = -0.0035  # %/°C loss
        self.REFERENCE_TEMPERATURE = 25  # °C
        
        # Urgam Valley specific parameters
        self.ALTITUDE = 250  # meters above sea level
        self.HUMIDITY_RANGE = (45, 85)  # % relative humidity range
        self.WIND_SPEED_RANGE = (2, 15)  # m/s
        
    def simulate_cooling(self, ambient_temp=35, solar_load=50, humidity=65, wind_speed=5):
        """
        Simulate waterless cooling system performance
        
        Args:
            ambient_temp: Ambient temperature (°C)
            solar_load: Solar thermal load (kW)
            humidity: Relative humidity (%)
            wind_speed: Wind speed (m/s)
        
        Returns:
            dict: Cooling simulation results
        """
        
        # Baseline panel temperature without cooling
        baseline_temp = ambient_temp + (solar_load * 1000) / (200 * 4)  # Simplified model
        
        # Terracotta passive cooling effect
        terracotta_cooling = self._calculate_terracotta_cooling(
            ambient_temp, baseline_temp, humidity, wind_speed
        )
        
        # Air circulation cooling
        air_cooling = self._calculate_air_cooling(
            baseline_temp, ambient_temp, wind_speed
        )
        
        # Radiative cooling (night sky)
        radiative_cooling = self._calculate_radiative_cooling(
            baseline_temp, ambient_temp
        )
        
        # Combined cooling effect
        total_cooling = terracotta_cooling + air_cooling + radiative_cooling
        final_temp = max(baseline_temp - total_cooling, ambient_temp)
        
        # Calculate efficiency gain
        baseline_efficiency = self._calculate_efficiency(baseline_temp)
        optimized_efficiency = self._calculate_efficiency(final_temp)
        efficiency_gain = optimized_efficiency - baseline_efficiency
        
        # Water savings calculation
        conventional_water_usage = solar_load * 0.3  # L/kW typical
        water_saved = conventional_water_usage  # 100% saved with waterless system
        
        return {
            'baseline_temp': round(baseline_temp, 2),
            'optimized_temp': round(final_temp, 2),
            'temp_reduction': round(baseline_temp - final_temp, 2),
            'baseline_efficiency': round(baseline_efficiency * 100, 2),
            'optimized_efficiency': round(optimized_efficiency * 100, 2),
            'efficiency_gain': round(efficiency_gain * 100, 2),
            'water_saved': round(water_saved, 1),
            'terracotta_contribution': round(terracotta_cooling, 2),
            'air_cooling_contribution': round(air_cooling, 2),
            'radiative_contribution': round(radiative_cooling, 2),
            'power_gain_kw': round(solar_load * efficiency_gain, 3),
            'revenue_gain_daily': round(solar_load * efficiency_gain * 6 * 4.5, 2)  # ₹4.5/kWh
        }
    
    def _calculate_terracotta_cooling(self, ambient_temp, panel_temp, humidity, wind_speed):
        """Calculate cooling effect from terracotta ventilation system"""
        
        # Evaporation potential based on humidity
        evap_potential = max(0, (100 - humidity) / 100) * 0.8
        
        # Porosity effect on air circulation
        porosity_factor = self.TERRACOTTA_POROSITY * 1.5
        
        # Wind-assisted convection through terracotta
        convection_cooling = porosity_factor * wind_speed * 0.3 * (panel_temp - ambient_temp) / 30
        
        # Evaporative cooling (limited by humidity)
        evap_cooling = evap_potential * 2.0  # °C reduction
        
        # Thermal mass effect (delayed heat release)
        thermal_mass_cooling = min(3.0, (panel_temp - ambient_temp) * 0.05)
        
        return convection_cooling + evap_cooling + thermal_mass_cooling
    
    def _calculate_air_cooling(self, panel_temp, ambient_temp, wind_speed):
        """Calculate forced air circulation cooling"""
        
        # Enhanced convection with forced air circulation
        convection_coefficient = 5 + wind_speed * 1.2  # W/m²K
        temp_diff = panel_temp - ambient_temp
        
        # Cooling effect (simplified)
        air_cooling_effect = min(8.0, convection_coefficient * temp_diff / 100)
        
        return air_cooling_effect
    
    def _calculate_radiative_cooling(self, panel_temp, ambient_temp):
        """Calculate radiative cooling to night sky"""
        
        # Simplified radiative cooling model
        # More effective at night and in dry conditions
        panel_temp_k = panel_temp + 273.15
        ambient_temp_k = ambient_temp + 273.15
        
        # Radiative heat loss to sky (simplified)
        radiative_flux = self.STEFAN_BOLTZMANN * self.TERRACOTTA_EMISSIVITY * (
            panel_temp_k**4 - ambient_temp_k**4
        )
        
        # Convert to temperature reduction (simplified)
        radiative_cooling = min(5.0, radiative_flux / 50)
        
        return radiative_cooling
    
    def _calculate_efficiency(self, temperature):
        """Calculate solar panel efficiency based on temperature"""
        
        temp_diff = temperature - self.REFERENCE_TEMPERATURE
        efficiency = self.PANEL_REFERENCE_EFFICIENCY * (
            1 + self.TEMPERATURE_COEFFICIENT * temp_diff
        )
        
        return max(0.1, efficiency)  # Minimum 10% efficiency
    
    def simulate_daily_cycle(self, date_str="2025-10-05"):
        """Simulate full day thermal performance"""
        
        # Urgam Valley typical weather pattern
        hours = np.arange(0, 24, 0.5)
        
        # Temperature profile (sinusoidal approximation)
        min_temp = 22  # °C (night)
        max_temp = 42  # °C (peak day)
        temps = min_temp + (max_temp - min_temp) * np.sin(np.pi * (hours - 6) / 12)
        temps = np.clip(temps, min_temp, max_temp)
        
        # Solar load profile (kW per panel array)
        solar_loads = np.maximum(0, 80 * np.sin(np.pi * (hours - 6) / 12))
        
        # Humidity and wind variations
        humidities = 65 + 15 * np.sin(np.pi * hours / 24)  # Higher at night
        wind_speeds = 3 + 5 * np.sin(np.pi * (hours - 12) / 12)  # Peak afternoon
        
        results = []
        total_energy_gain = 0
        total_water_saved = 0
        
        for i, hour in enumerate(hours):
            if solar_loads[i] > 5:  # Only during productive hours
                sim_result = self.simulate_cooling(
                    ambient_temp=temps[i],
                    solar_load=solar_loads[i],
                    humidity=humidities[i],
                    wind_speed=wind_speeds[i]
                )
                
                sim_result['hour'] = hour
                sim_result['solar_load'] = round(solar_loads[i], 1)
                results.append(sim_result)
                
                # Accumulate daily totals (0.5 hour intervals)
                total_energy_gain += sim_result['power_gain_kw'] * 0.5
                total_water_saved += sim_result['water_saved']
        
        return {
            'date': date_str,
            'hourly_results': results,
            'daily_summary': {
                'total_energy_gain_kwh': round(total_energy_gain, 2),
                'total_water_saved_liters': round(total_water_saved, 1),
                'average_temp_reduction': round(np.mean([r['temp_reduction'] for r in results]), 2),
                'average_efficiency_gain': round(np.mean([r['efficiency_gain'] for r in results]), 2),
                'estimated_revenue_gain_inr': round(total_energy_gain * 4.5, 2)
            }
        }
    
    def optimize_thermal_design(self, constraints=None):
        """Optimize thermal management system design"""
        
        if constraints is None:
            constraints = {
                'max_budget_inr': 500000,  # ₹5 lakh
                'max_maintenance_hours_month': 20,
                'min_efficiency_gain': 0.05,  # 5%
                'water_savings_target': 0.8   # 80%
            }
        
        # Design parameters to optimize
        designs = [
            {
                'name': 'Basic Terracotta Vents',
                'terracotta_coverage': 0.3,
                'air_circulation_power': 0,
                'cost_inr': 150000,
                'maintenance_hours': 8,
                'expected_gain': 0.08
            },
            {
                'name': 'Enhanced Passive System',
                'terracotta_coverage': 0.6,
                'air_circulation_power': 0.2,  # kW
                'cost_inr': 320000,
                'maintenance_hours': 15,
                'expected_gain': 0.15
            },
            {
                'name': 'Hybrid Active-Passive',
                'terracotta_coverage': 0.8,
                'air_circulation_power': 1.0,  # kW
                'cost_inr': 480000,
                'maintenance_hours': 25,
                'expected_gain': 0.22
            }
        ]
        
        # Evaluate each design
        evaluated_designs = []
        for design in designs:
            # Check constraints
            meets_constraints = (
                design['cost_inr'] <= constraints['max_budget_inr'] and
                design['maintenance_hours'] <= constraints['max_maintenance_hours_month'] and
                design['expected_gain'] >= constraints['min_efficiency_gain']
            )
            
            # Calculate ROI (5-year period)
            annual_revenue_gain = design['expected_gain'] * 100 * 300 * 6 * 4.5  # 100kW, 300 days, 6h, ₹4.5/kWh
            roi_5_year = (annual_revenue_gain * 5 - design['cost_inr']) / design['cost_inr']
            
            design['meets_constraints'] = meets_constraints
            design['annual_revenue_gain'] = round(annual_revenue_gain, 2)
            design['roi_5_year'] = round(roi_5_year * 100, 1)
            design['payback_years'] = round(design['cost_inr'] / annual_revenue_gain, 1)
            
            evaluated_designs.append(design)
        
        # Rank by ROI among constraint-meeting designs
        viable_designs = [d for d in evaluated_designs if d['meets_constraints']]
        viable_designs.sort(key=lambda x: x['roi_5_year'], reverse=True)
        
        return {
            'all_designs': evaluated_designs,
            'recommended': viable_designs[0] if viable_designs else None,
            'constraints': constraints
        }

def main():
    parser = argparse.ArgumentParser(description='HHDAO Thermal Simulation System')
    parser.add_argument('--mode', choices=['single', 'daily', 'optimize'], default='single',
                       help='Simulation mode')
    parser.add_argument('--temp', type=float, default=35, help='Ambient temperature (°C)')
    parser.add_argument('--load', type=float, default=50, help='Solar load (kW)')
    parser.add_argument('--humidity', type=float, default=65, help='Relative humidity (%)')
    parser.add_argument('--wind', type=float, default=5, help='Wind speed (m/s)')
    parser.add_argument('--output', help='Output file path (JSON)')
    
    args = parser.parse_args()
    
    simulator = ThermalSimulator()
    
    if args.mode == 'single':
        result = simulator.simulate_cooling(
            ambient_temp=args.temp,
            solar_load=args.load,
            humidity=args.humidity,
            wind_speed=args.wind
        )
        print(json.dumps(result, indent=2))
        
    elif args.mode == 'daily':
        result = simulator.simulate_daily_cycle()
        print(json.dumps(result, indent=2))
        
    elif args.mode == 'optimize':
        result = simulator.optimize_thermal_design()
        print(json.dumps(result, indent=2))
    
    # Save to file if specified
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\n📄 Results saved to: {args.output}")

if __name__ == "__main__":
    main()