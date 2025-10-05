import { NextRequest, NextResponse } from 'next/server';

// Mock thermal data for development
// In production, this would connect to actual IoT sensors and thermal monitoring systems
function getCurrentThermalProfile() {
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour / 24;

  // Simulate realistic thermal patterns based on time of day
  const basePanelTemp = 25 + 20 * Math.sin(timeOfDay * Math.PI * 2 - Math.PI / 2);
  const ambientTemp = 20 + 15 * Math.sin(timeOfDay * Math.PI * 2 - Math.PI / 2);
  const solarIrradiance =
    currentHour >= 6 && currentHour <= 18 ? 800 * Math.sin(((currentHour - 6) * Math.PI) / 12) : 0;

  // Add some realistic variation
  const variation = (Math.random() - 0.5) * 4;

  return {
    panelTemp: Math.max(15, basePanelTemp + variation),
    inverterTemp: Math.max(15, ambientTemp + 8 + solarIrradiance / 200),
    batteryTemp: Math.max(15, ambientTemp + 3),
    efficiency: Math.max(0.7, 1 - Math.max(0, basePanelTemp - 25) * 0.004),
    ambientTemp: Math.max(10, ambientTemp + variation * 0.5),
    solarIrradiance: Math.max(0, solarIrradiance + (Math.random() - 0.5) * 100),
    windSpeed: Math.max(0, 2.5 + (Math.random() - 0.5) * 3),
    humidity: Math.max(20, 60 + (Math.random() - 0.5) * 40),
    timestamp: new Date().toISOString(),
  };
}

function generateThermalAlerts(profile: any) {
  const alerts: Array<{
    id: string;
    timestamp: string;
    deviceId: string;
    alertType: string;
    severity: string;
    message: string;
    resolved: boolean;
  }> = [];

  if (profile.panelTemp > 60) {
    alerts.push({
      id: `alert-${Date.now()}-panel`,
      timestamp: new Date().toISOString(),
      deviceId: 'URGAM_PANEL_001',
      alertType: 'temperature',
      severity: profile.panelTemp > 65 ? 'critical' : 'warning',
      message: `Panel temperature ${profile.panelTemp.toFixed(1)}°C ${
        profile.panelTemp > 65
          ? 'exceeds maximum safe operating temperature'
          : 'approaching maximum threshold'
      }`,
      resolved: false,
    });
  }

  if (profile.inverterTemp > 35) {
    alerts.push({
      id: `alert-${Date.now()}-inverter`,
      timestamp: new Date().toISOString(),
      deviceId: 'URGAM_INV_001',
      alertType: 'temperature',
      severity: profile.inverterTemp > 40 ? 'critical' : 'warning',
      message: `Inverter temperature ${profile.inverterTemp.toFixed(1)}°C ${
        profile.inverterTemp > 40 ? 'exceeds safe operating range' : 'elevated'
      }`,
      resolved: false,
    });
  }

  if (profile.efficiency < 0.8) {
    alerts.push({
      id: `alert-${Date.now()}-efficiency`,
      timestamp: new Date().toISOString(),
      deviceId: 'URGAM_PANEL_001',
      alertType: 'efficiency',
      severity: 'warning',
      message: `Panel efficiency reduced to ${(profile.efficiency * 100).toFixed(
        1
      )}% due to high temperature`,
      resolved: false,
    });
  }

  return alerts;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'current';

    switch (type) {
      case 'current':
        const currentProfile = getCurrentThermalProfile();
        const alerts = generateThermalAlerts(currentProfile);

        return NextResponse.json({
          success: true,
          data: {
            profile: currentProfile,
            alerts: alerts,
            location: {
              name: 'Urgam Valley Solar Installation',
              coordinates: { lat: 30.1652, lng: 78.8487 },
              elevation: 1652,
              timezone: 'Asia/Kolkata',
            },
          },
        });

      case 'alerts':
        // Return all active alerts
        const profile = getCurrentThermalProfile();
        const allAlerts = generateThermalAlerts(profile);

        return NextResponse.json({
          success: true,
          data: {
            alerts: allAlerts,
            count: allAlerts.length,
            critical: allAlerts.filter((a) => a.severity === 'critical').length,
          },
        });

      case 'history':
        // Generate historical data for the past 24 hours
        const history: Array<any> = [];
        const now = new Date();

        for (let i = 24; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
          const hourProfile = getCurrentThermalProfile();

          history.push({
            ...hourProfile,
            timestamp: timestamp.toISOString(),
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            readings: history,
            period: '24h',
            interval: '1h',
          },
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Thermal API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId } = body;

    switch (action) {
      case 'export-bim':
        // Generate BIM export data
        const profile = getCurrentThermalProfile();
        const bimData = {
          project: {
            name: 'Urgam Valley Solar Installation',
            location: { lat: 30.1652, lng: 78.8487 },
            climateZone: 'Himalayas_Subtropical',
            altitudeM: 1652,
          },
          thermalZones: [
            {
              zoneId: 'SOLAR_ARRAY_001',
              type: 'solar_panel_array',
              areaM2: 500,
              orientation: 180,
              tiltAngle: 30,
              currentTemp: profile.panelTemp,
              efficiency: profile.efficiency,
            },
            {
              zoneId: 'INVERTER_ROOM',
              type: 'equipment_enclosure',
              areaM2: 25,
              volumeM3: 75,
              currentTemp: profile.inverterTemp,
              ventilationCfm: 500,
            },
            {
              zoneId: 'BATTERY_STORAGE',
              type: 'battery_enclosure',
              areaM2: 20,
              volumeM3: 60,
              currentTemp: profile.batteryTemp,
              thermalControl: 'active_cooling',
            },
          ],
          currentConditions: profile,
          exportTimestamp: new Date().toISOString(),
        };

        return NextResponse.json({
          success: true,
          data: bimData,
          filename: `urgam-thermal-bim-${new Date().toISOString().split('T')[0]}.json`,
        });

      case 'resolve-alert':
        if (!alertId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Alert ID required',
            },
            { status: 400 }
          );
        }

        // In production, this would update the database
        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} resolved`,
          resolvedAt: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Thermal API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
