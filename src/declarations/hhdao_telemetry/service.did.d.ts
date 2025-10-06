import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AggregatedData {
  sum: number;
  count: bigint;
  minimum: number;
  average: number;
  timeRange: TimeRange;
  deviceId: string;
  metricType: MetricType;
  maximum: number;
}
export interface Alert {
  id: bigint;
  alertType: AlertType;
  acknowledgedAt: [] | [bigint];
  acknowledgedBy: [] | [Principal];
  acknowledged: boolean;
  message: string;
  deviceId: string;
  timestamp: bigint;
  severity: Severity;
}
export type AlertType =
  | { PowerOutage: null }
  | { Custom: string }
  | { MaintenanceRequired: null }
  | { DeviceOffline: null }
  | { PerformanceIssue: null }
  | { HighTemperature: null }
  | { LowBattery: null };
export interface DataPoint {
  value: number;
  quality: DataQuality;
  unit: string;
  deviceId: string;
  timestamp: bigint;
  metricType: MetricType;
}
export type DataQuality = { Invalid: null } | { Good: null } | { Poor: null } | { Estimated: null };
export interface Device {
  id: string;
  status: DeviceStatus;
  owner: Principal;
  metadata: Array<[string, string]>;
  name: string;
  deviceType: DeviceType;
  registeredAt: bigint;
  lastPing: bigint;
  location: Location;
}
export type DeviceStatus =
  | { Error: null }
  | { Online: null }
  | { Maintenance: null }
  | { Offline: null };
export type DeviceType =
  | { GridConnection: null }
  | { SolarPanel: null }
  | { Battery: null }
  | { EnergyMeter: null }
  | { Inverter: null }
  | { WeatherStation: null };
export interface Location {
  region: [] | [string];
  latitude: number;
  longitude: number;
  address: [] | [string];
}
export type MetricType =
  | { SolarIrradiance: null }
  | { Temperature: null }
  | { Humidity: null }
  | { Custom: string }
  | { EnergyProduced: null }
  | { Current: null }
  | { Voltage: null }
  | { GridFrequency: null }
  | { BatteryLevel: null }
  | { PowerGeneration: null };
export type Result = { ok: string } | { err: string };
export type Result_1 = { ok: Device } | { err: string };
export type Result_2 = { ok: bigint } | { err: string };
export type Severity = { Low: null } | { High: null } | { Medium: null } | { Critical: null };
export interface TimeRange {
  end: bigint;
  start: bigint;
}
export interface _SERVICE {
  acknowledgeAlert: ActorMethod<[bigint], Result>;
  createManualAlert: ActorMethod<[string, AlertType, Severity, string], Result_2>;
  getAggregatedData: ActorMethod<[string, MetricType, TimeRange], [] | [AggregatedData]>;
  getAlerts: ActorMethod<[[] | [string], [] | [boolean]], Array<Alert>>;
  getAllDevices: ActorMethod<[], Array<Device>>;
  getDevice: ActorMethod<[string], [] | [Device]>;
  getDeviceData: ActorMethod<[string, [] | [bigint]], [] | [Array<DataPoint>]>;
  getLatestData: ActorMethod<[string, MetricType], [] | [DataPoint]>;
  getMyDevices: ActorMethod<[], Array<Device>>;
  getTelemetryStats: ActorMethod<
    [],
    {
      unacknowledgedAlerts: bigint;
      totalDevices: bigint;
      devicesByType: Array<[DeviceType, bigint]>;
      onlineDevices: bigint;
      totalDataPoints: bigint;
    }
  >;
  recordData: ActorMethod<[string, Array<[MetricType, number, string]>], Result>;
  registerDevice: ActorMethod<
    [string, string, DeviceType, Location, Array<[string, string]>],
    Result_1
  >;
  updateDeviceStatus: ActorMethod<[string, DeviceStatus], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
