// IoT Telemetry Service for Authority Dashboard
// Integrates with telemetry canister and provides real-time monitoring

import { formatINR } from '../utils/currency';

export interface IoTSensor {
  id: string;
  type: 'energy_production' | 'mining_heat' | 'emissions' | 'grid_status' | 'environmental';
  name: string;
  location: {
    projectId?: string;
    coordinates: { lat: number; lng: number };
    address: string;
  };
  status: 'online' | 'offline' | 'maintenance' | 'error';
  lastReading: {
    timestamp: string;
    value: number;
    unit: string;
  };
  thresholds: {
    min?: number;
    max?: number;
    critical?: number;
  };
  alerts: {
    count: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    lastAlert?: string;
  };
}

export interface TelemetryData {
  sensors: IoTSensor[];
  aggregatedMetrics: {
    totalEnergyProduction: number; // kWh
    averageTemperature: number; // °C
    totalEmissions: number; // kg CO2
    systemEfficiency: number; // %
    alertsLast24h: number;
  };
  historicalData: {
    energyProduction: Array<{ timestamp: string; value: number }>;
    emissions: Array<{ timestamp: string; value: number }>;
    temperature: Array<{ timestamp: string; value: number }>;
  };
}

export interface ApprovalItem {
  id: string;
  type: 'project_approval' | 'compliance_review' | 'fund_release' | 'permit_renewal';
  title: string;
  description: string;
  requestor: {
    id: string;
    name: string;
    type: 'community' | 'investor' | 'partner';
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'escalated';
  submittedDate: string;
  dueDate: string;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadDate: string;
  }>;
  auditTrail: Array<{
    timestamp: string;
    action: string;
    actor: string;
    notes?: string;
  }>;
  complianceChecks: {
    environmental: boolean;
    financial: boolean;
    legal: boolean;
    technical: boolean;
  };
}

export interface ComplianceReport {
  id: string;
  title: string;
  period: { start: string; end: string };
  projectIds: string[];
  metrics: {
    totalProjects: number;
    compliantProjects: number;
    complianceRate: number;
    violationsFound: number;
    resolvedViolations: number;
  };
  sections: Array<{
    title: string;
    findings: string[];
    recommendations: string[];
    status: 'compliant' | 'minor_issues' | 'major_violations';
  }>;
  generatedBy: string;
  generatedAt: string;
}

class TelemetryService {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private dataCache: Map<string, { data: any; timestamp: number }> = new Map();

  async initializeConnection(): Promise<void> {
    try {
      // Connect to telemetry WebSocket for real-time updates
      this.wsConnection = new WebSocket('ws://localhost:3001/api/socketio');

      this.wsConnection.onopen = () => {
        console.log('Telemetry connection established');
        this.reconnectAttempts = 0;
      };

      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data);
      };

      this.wsConnection.onclose = () => {
        console.log('Telemetry connection closed');
        this.handleReconnect();
      };

      this.wsConnection.onerror = (error) => {
        console.error('Telemetry connection error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize telemetry connection:', error);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(
        () => {
          this.reconnectAttempts++;
          this.initializeConnection();
        },
        Math.pow(2, this.reconnectAttempts) * 1000
      );
    }
  }

  private handleRealtimeUpdate(data: any): void {
    // Cache real-time telemetry updates
    this.dataCache.set(data.type, {
      data,
      timestamp: Date.now(),
    });
  }

  async getTelemetryData(region?: string): Promise<TelemetryData> {
    try {
      // In production, this would call the telemetry canister
      // For now, generate realistic mock data with live updates

      const sensors: IoTSensor[] = [
        {
          id: 'solar-farm-1',
          type: 'energy_production',
          name: 'UrgamU Valley Solar Farm',
          location: {
            projectId: 'proj-001',
            coordinates: { lat: 23.0225, lng: 72.5714 },
            address: 'UrgamU Valley, Gujarat',
          },
          status: 'online',
          lastReading: {
            timestamp: new Date().toISOString(),
            value: 2450 + Math.random() * 100,
            unit: 'kW',
          },
          thresholds: { min: 2000, max: 3000, critical: 3200 },
          alerts: { count: 0, severity: 'low' },
        },
        {
          id: 'mining-temp-1',
          type: 'mining_heat',
          name: 'Mining Facility Thermal Monitor',
          location: {
            coordinates: { lat: 23.03, lng: 72.58 },
            address: 'Mining Complex, Gujarat',
          },
          status: 'online',
          lastReading: {
            timestamp: new Date().toISOString(),
            value: 65 + Math.random() * 10,
            unit: '°C',
          },
          thresholds: { min: 45, max: 75, critical: 85 },
          alerts: { count: 2, severity: 'medium', lastAlert: '2 hours ago' },
        },
        {
          id: 'emissions-1',
          type: 'emissions',
          name: 'Regional Emissions Monitor',
          location: {
            coordinates: { lat: 23.015, lng: 72.565 },
            address: 'Regional Air Quality Station',
          },
          status: 'online',
          lastReading: {
            timestamp: new Date().toISOString(),
            value: 850 + Math.random() * 50,
            unit: 'kg CO2/day',
          },
          thresholds: { max: 1000, critical: 1200 },
          alerts: { count: 1, severity: 'low' },
        },
        {
          id: 'grid-status-1',
          type: 'grid_status',
          name: 'Grid Connection Monitor',
          location: {
            coordinates: { lat: 23.02, lng: 72.57 },
            address: 'Main Grid Station',
          },
          status: Math.random() > 0.8 ? 'offline' : 'online',
          lastReading: {
            timestamp: new Date().toISOString(),
            value: 98.5 + Math.random() * 1.5,
            unit: '% uptime',
          },
          thresholds: { min: 95, critical: 90 },
          alerts: { count: 0, severity: 'low' },
        },
      ];

      const aggregatedMetrics = {
        totalEnergyProduction: sensors
          .filter((s) => s.type === 'energy_production')
          .reduce((sum, s) => sum + s.lastReading.value, 0),
        averageTemperature:
          sensors
            .filter((s) => s.type === 'mining_heat')
            .reduce((sum, s) => sum + s.lastReading.value, 0) /
            sensors.filter((s) => s.type === 'mining_heat').length || 0,
        totalEmissions: sensors
          .filter((s) => s.type === 'emissions')
          .reduce((sum, s) => sum + s.lastReading.value, 0),
        systemEfficiency: 87 + Math.random() * 8,
        alertsLast24h: sensors.reduce((sum, s) => sum + s.alerts.count, 0),
      };

      // Generate historical data for charts
      const historicalData = {
        energyProduction: this.generateHistoricalData(24, 2000, 2500),
        emissions: this.generateHistoricalData(24, 800, 900),
        temperature: this.generateHistoricalData(24, 60, 70),
      };

      return {
        sensors,
        aggregatedMetrics,
        historicalData,
      };
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      throw error;
    }
  }

  private generateHistoricalData(
    hours: number,
    min: number,
    max: number
  ): Array<{ timestamp: string; value: number }> {
    const data: Array<{ timestamp: string; value: number }> = [];
    const now = new Date();

    for (let i = hours - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const value = min + Math.random() * (max - min);
      data.push({
        timestamp: timestamp.toISOString(),
        value: Math.round(value * 10) / 10,
      });
    }

    return data;
  }

  async getApprovalItems(region?: string): Promise<ApprovalItem[]> {
    // Mock approval items - in production, fetch from government canister
    return [
      {
        id: 'approval-001',
        type: 'project_approval',
        title: 'Solar Microgrid Expansion - Khanpur Village',
        description:
          'Proposal to expand existing solar microgrid to serve 150 additional households',
        requestor: {
          id: 'community-123',
          name: 'Khanpur Village Council',
          type: 'community',
        },
        priority: 'high',
        status: 'pending',
        submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        documents: [
          {
            name: 'Environmental Impact Assessment.pdf',
            url: '/docs/eia-001.pdf',
            type: 'application/pdf',
            uploadDate: new Date().toISOString(),
          },
          {
            name: 'Land Use Certificate.pdf',
            url: '/docs/land-cert-001.pdf',
            type: 'application/pdf',
            uploadDate: new Date().toISOString(),
          },
        ],
        auditTrail: [
          {
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Application Submitted',
            actor: 'Khanpur Village Council',
          },
          {
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Initial Review Started',
            actor: 'Authority Officer',
          },
        ],
        complianceChecks: {
          environmental: true,
          financial: false,
          legal: true,
          technical: false,
        },
      },
      {
        id: 'approval-002',
        type: 'compliance_review',
        title: 'Quarterly Emissions Compliance Review',
        description: 'Review of mining facility emissions data for Q3 2024',
        requestor: {
          id: 'partner-456',
          name: 'GreenTech Mining Co.',
          type: 'partner',
        },
        priority: 'medium',
        status: 'under_review',
        submittedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        documents: [
          {
            name: 'Emissions Report Q3.xlsx',
            url: '/docs/emissions-q3.xlsx',
            type: 'application/vnd.ms-excel',
            uploadDate: new Date().toISOString(),
          },
        ],
        auditTrail: [
          {
            timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Compliance Data Submitted',
            actor: 'GreenTech Mining Co.',
          },
          {
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Technical Review Started',
            actor: 'Environmental Officer',
          },
        ],
        complianceChecks: {
          environmental: true,
          financial: true,
          legal: true,
          technical: true,
        },
      },
      {
        id: 'approval-003',
        type: 'fund_release',
        title: 'Community Training Program Fund Release',
        description: `Release of ${formatINR(250000)} for solar technician training program`,
        requestor: {
          id: 'investor-789',
          name: 'Solar Skills Foundation',
          type: 'investor',
        },
        priority: 'low',
        status: 'pending',
        submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        documents: [
          {
            name: 'Training Program Budget.pdf',
            url: '/docs/budget-001.pdf',
            type: 'application/pdf',
            uploadDate: new Date().toISOString(),
          },
        ],
        auditTrail: [
          {
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Fund Release Request',
            actor: 'Solar Skills Foundation',
          },
        ],
        complianceChecks: {
          environmental: true,
          financial: false,
          legal: true,
          technical: true,
        },
      },
    ];
  }

  async processApproval(
    itemId: string,
    action: 'approve' | 'reject',
    notes?: string,
    userId?: string
  ): Promise<void> {
    try {
      // In production, this would call the government canister
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: action === 'approve' ? 'Approved' : 'Rejected',
        actor: userId || 'Current Authority User',
        notes: notes || '',
      };

      // Mock API call for approval processing
      console.log(`Processing ${action} for item ${itemId}:`, auditEntry);

      // In real implementation:
      // await governmentCanister.processApproval(itemId, action, auditEntry);

      return Promise.resolve();
    } catch (error) {
      console.error('Error processing approval:', error);
      throw error;
    }
  }

  async generateComplianceReport(params: {
    period: { start: string; end: string };
    projectIds?: string[];
    format: 'pdf' | 'csv';
  }): Promise<ComplianceReport> {
    const report: ComplianceReport = {
      id: `report-${Date.now()}`,
      title: `Compliance Report - ${new Date(
        params.period.start
      ).toLocaleDateString()} to ${new Date(params.period.end).toLocaleDateString()}`,
      period: params.period,
      projectIds: params.projectIds || [],
      metrics: {
        totalProjects: 12,
        compliantProjects: 10,
        complianceRate: 83.3,
        violationsFound: 3,
        resolvedViolations: 1,
      },
      sections: [
        {
          title: 'Environmental Compliance',
          findings: [
            'All solar projects meet emission standards',
            '2 mining facilities exceed temperature thresholds',
            'Air quality monitoring systems operational',
          ],
          recommendations: [
            'Install additional cooling systems for mining facilities',
            'Implement weekly temperature monitoring reviews',
          ],
          status: 'minor_issues',
        },
        {
          title: 'Financial Compliance',
          findings: [
            'All projects within approved budget ranges',
            'Quarterly financial reports submitted on time',
            'No unauthorized expenditures detected',
          ],
          recommendations: [],
          status: 'compliant',
        },
        {
          title: 'Technical Standards',
          findings: [
            '1 project requires inverter upgrade',
            'Grid connection protocols followed',
            'Safety standards maintained across all sites',
          ],
          recommendations: ['Schedule inverter upgrade within 30 days'],
          status: 'minor_issues',
        },
      ],
      generatedBy: 'Authority Dashboard System',
      generatedAt: new Date().toISOString(),
    };

    return report;
  }

  async escalateDispute(itemId: string, reason: string): Promise<void> {
    try {
      // In production, integrate with dispute resolution canister
      console.log(`Escalating dispute for item ${itemId}:`, reason);

      // Mock escalation process
      const escalationData = {
        itemId,
        reason,
        escalatedBy: 'Authority User',
        escalatedAt: new Date().toISOString(),
        status: 'escalated',
      };

      // In real implementation:
      // await disputeCanister.createDispute(escalationData);

      return Promise.resolve();
    } catch (error) {
      console.error('Error escalating dispute:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
}

export const telemetryService = new TelemetryService();
