export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const AlertType = IDL.Variant({
    PowerOutage: IDL.Null,
    Custom: IDL.Text,
    MaintenanceRequired: IDL.Null,
    DeviceOffline: IDL.Null,
    PerformanceIssue: IDL.Null,
    HighTemperature: IDL.Null,
    LowBattery: IDL.Null,
  });
  const Severity = IDL.Variant({
    Low: IDL.Null,
    High: IDL.Null,
    Medium: IDL.Null,
    Critical: IDL.Null,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const MetricType = IDL.Variant({
    SolarIrradiance: IDL.Null,
    Temperature: IDL.Null,
    Humidity: IDL.Null,
    Custom: IDL.Text,
    EnergyProduced: IDL.Null,
    Current: IDL.Null,
    Voltage: IDL.Null,
    GridFrequency: IDL.Null,
    BatteryLevel: IDL.Null,
    PowerGeneration: IDL.Null,
  });
  const TimeRange = IDL.Record({ end: IDL.Int, start: IDL.Int });
  const AggregatedData = IDL.Record({
    sum: IDL.Float64,
    count: IDL.Nat,
    minimum: IDL.Float64,
    average: IDL.Float64,
    timeRange: TimeRange,
    deviceId: IDL.Text,
    metricType: MetricType,
    maximum: IDL.Float64,
  });
  const Alert = IDL.Record({
    id: IDL.Nat,
    alertType: AlertType,
    acknowledgedAt: IDL.Opt(IDL.Int),
    acknowledgedBy: IDL.Opt(IDL.Principal),
    acknowledged: IDL.Bool,
    message: IDL.Text,
    deviceId: IDL.Text,
    timestamp: IDL.Int,
    severity: Severity,
  });
  const DeviceStatus = IDL.Variant({
    Error: IDL.Null,
    Online: IDL.Null,
    Maintenance: IDL.Null,
    Offline: IDL.Null,
  });
  const DeviceType = IDL.Variant({
    GridConnection: IDL.Null,
    SolarPanel: IDL.Null,
    Battery: IDL.Null,
    EnergyMeter: IDL.Null,
    Inverter: IDL.Null,
    WeatherStation: IDL.Null,
  });
  const Location = IDL.Record({
    region: IDL.Opt(IDL.Text),
    latitude: IDL.Float64,
    longitude: IDL.Float64,
    address: IDL.Opt(IDL.Text),
  });
  const Device = IDL.Record({
    id: IDL.Text,
    status: DeviceStatus,
    owner: IDL.Principal,
    metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    name: IDL.Text,
    deviceType: DeviceType,
    registeredAt: IDL.Int,
    lastPing: IDL.Int,
    location: Location,
  });
  const DataQuality = IDL.Variant({
    Invalid: IDL.Null,
    Good: IDL.Null,
    Poor: IDL.Null,
    Estimated: IDL.Null,
  });
  const DataPoint = IDL.Record({
    value: IDL.Float64,
    quality: DataQuality,
    unit: IDL.Text,
    deviceId: IDL.Text,
    timestamp: IDL.Int,
    metricType: MetricType,
  });
  const Result_1 = IDL.Variant({ ok: Device, err: IDL.Text });
  return IDL.Service({
    acknowledgeAlert: IDL.Func([IDL.Nat], [Result], []),
    createManualAlert: IDL.Func([IDL.Text, AlertType, Severity, IDL.Text], [Result_2], []),
    getAggregatedData: IDL.Func(
      [IDL.Text, MetricType, TimeRange],
      [IDL.Opt(AggregatedData)],
      ['query']
    ),
    getAlerts: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)], [IDL.Vec(Alert)], ['query']),
    getAllDevices: IDL.Func([], [IDL.Vec(Device)], ['query']),
    getDevice: IDL.Func([IDL.Text], [IDL.Opt(Device)], ['query']),
    getDeviceData: IDL.Func([IDL.Text, IDL.Opt(IDL.Nat)], [IDL.Opt(IDL.Vec(DataPoint))], ['query']),
    getLatestData: IDL.Func([IDL.Text, MetricType], [IDL.Opt(DataPoint)], ['query']),
    getMyDevices: IDL.Func([], [IDL.Vec(Device)], ['query']),
    getTelemetryStats: IDL.Func(
      [],
      [
        IDL.Record({
          unacknowledgedAlerts: IDL.Nat,
          totalDevices: IDL.Nat,
          devicesByType: IDL.Vec(IDL.Tuple(DeviceType, IDL.Nat)),
          onlineDevices: IDL.Nat,
          totalDataPoints: IDL.Nat,
        }),
      ],
      ['query']
    ),
    recordData: IDL.Func(
      [IDL.Text, IDL.Vec(IDL.Tuple(MetricType, IDL.Float64, IDL.Text))],
      [Result],
      []
    ),
    registerDevice: IDL.Func(
      [IDL.Text, IDL.Text, DeviceType, Location, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      [Result_1],
      []
    ),
    updateDeviceStatus: IDL.Func([IDL.Text, DeviceStatus], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
