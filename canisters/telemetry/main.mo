import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Debug "mo:base/Debug";

import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
 audit-clean

persistent actor Telemetry {

  // Data Types
  type DeviceType = {
    #SolarPanel;
    #Inverter;
    #Battery;
    #EnergyMeter;
    #WeatherStation;
    #GridConnection;
  };

  type DeviceStatus = {
    #Online;
    #Offline;
    #Maintenance;
    #Error;
  };

  type Location = {
    latitude: Float;
    longitude: Float;
    address: ?Text;
    region: ?Text;
  };

  type Device = {
    id: Text;
    name: Text;
    deviceType: DeviceType;
    location: Location;
    owner: Principal;
    status: DeviceStatus;
    registeredAt: Int;
    lastPing: Int;
    metadata: [(Text, Text)]; // Key-value pairs for device-specific data
  };

  type MetricType = {
    #PowerGeneration;    // Watts
    #EnergyProduced;     // kWh
    #Voltage;            // Volts
    #Current;            // Amperes
    #Temperature;        // Celsius
    #Humidity;           // Percentage
    #SolarIrradiance;    // W/m²
    #BatteryLevel;       // Percentage
    #GridFrequency;      // Hz
    #Custom: Text;       // Custom metric type
  };

  type DataQuality = {
    #Good;
    #Estimated;
    #Poor;
    #Invalid;
  };

  type DataPoint = {
    deviceId: Text;
    metricType: MetricType;
    value: Float;
    unit: Text;
    timestamp: Int;
    quality: DataQuality;
  };

  type AlertType = {
    #DeviceOffline;
    #PowerOutage;
    #LowBattery;
    #HighTemperature;
    #MaintenanceRequired;
    #PerformanceIssue;
    #Custom: Text;
  };

  type Severity = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  type Alert = {
    id: Nat;
    deviceId: Text;
    alertType: AlertType;
    severity: Severity;
    message: Text;
    timestamp: Int;
    acknowledged: Bool;
    acknowledgedBy: ?Principal;
    acknowledgedAt: ?Int;
  };

  type TimeRange = {
    start: Int;
    end: Int;
  };

  type AggregatedData = {
    metricType: MetricType;
    deviceId: Text;
    timeRange: TimeRange;
    average: Float;
    minimum: Float;
    maximum: Float;
    sum: Float;
    count: Nat;
  };

  // Stable storage
  var alertCounter: Nat = 0;
  var deviceEntries: [(Text, Device)] = [];
  var dataEntries: [(Text, [DataPoint])] = []; // key: deviceId
  var alertEntries: [(Nat, Alert)] = [];

  // Custom hash function for Nat (replacement for deprecated Hash.hash)
  func natHash(n: Nat) : Nat32 {
    let hash = Int.abs(n);
    var h : Nat32 = 0;
    var remaining = hash;

    // FNV-1a like hash
    while (remaining > 0) {
      let byte = Nat32.fromNat(remaining % 256);
      h := (h ^ byte) *% 0x01000193;  // FNV prime
      remaining := remaining / 256;
    };

    // Ensure non-zero for better distribution
    if (h == 0) { 1 } else { h }
  };

  // In-memory maps (rebuilt on init/post-upgrade)
  private transient var devices = HashMap.HashMap<Text, Device>(10, Text.equal, Text.hash);
  private transient var deviceData = HashMap.HashMap<Text, [DataPoint]>(10, Text.equal, Text.hash);
  private transient var alerts = HashMap.HashMap<Nat, Alert>(10, Nat.equal, natHash);

  // System functions for upgrades
  system func preupgrade() {
    deviceEntries := Iter.toArray(devices.entries());
    dataEntries := Iter.toArray(deviceData.entries());
    alertEntries := Iter.toArray(alerts.entries());
  };

  system func postupgrade() {
    devices := HashMap.HashMap<Text, Device>(deviceEntries.size(), Text.equal, Text.hash);
    for ((k, v) in deviceEntries.vals()) { devices.put(k, v) };
    deviceData := HashMap.HashMap<Text, [DataPoint]>(dataEntries.size(), Text.equal, Text.hash);
    for ((k, v) in dataEntries.vals()) { deviceData.put(k, v) };
    alerts := HashMap.HashMap<Nat, Alert>(alertEntries.size(), Nat.equal, natHash);
    for ((k, v) in alertEntries.vals()) { alerts.put(k, v) };
    deviceEntries := [];
    dataEntries := [];
    alertEntries := [];
  };

  // Helper functions
  func isDeviceOwner(deviceId: Text, caller: Principal): Bool {
    switch (devices.get(deviceId)) {
      case (?device) { device.owner == caller };
      case (null) { false };
    }
  };

  func createAlert(deviceId: Text, alertType: AlertType, severity: Severity, message: Text): Nat {
    alertCounter += 1;
    let alertId = alertCounter;

    let alert: Alert = {
      id = alertId;
      deviceId = deviceId;
      alertType = alertType;
      severity = severity;
      message = message;
      timestamp = Time.now();
      acknowledged = false;
      acknowledgedBy = null;
      acknowledgedAt = null;
    };

    alerts.put(alertId, alert);
    alertId
  };

  // Public functions
  public shared ({ caller }) func registerDevice(
    deviceId: Text,
    name: Text,
    deviceType: DeviceType,
    location: Location,
    metadata: [(Text, Text)]
  ): async Result.Result<Device, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principal cannot register devices");
    };

    // Check if device already exists
    switch (devices.get(deviceId)) {
      case (?_existing) { return #err("Device ID already registered") };
      case (null) {};
    };

    let device: Device = {
      id = deviceId;
      name = name;
      deviceType = deviceType;
      location = location;
      owner = caller;
      status = #Offline;
      registeredAt = Time.now();
      lastPing = 0;
      metadata = metadata;
    };

    devices.put(deviceId, device);
    deviceData.put(deviceId, []);
    #ok(device)
  };

  public shared ({ caller }) func updateDeviceStatus(deviceId: Text, status: DeviceStatus): async Result.Result<Text, Text> {
    if (not isDeviceOwner(deviceId, caller)) {
      return #err("Only device owner can update status");
    };

    switch (devices.get(deviceId)) {
      case (null) { #err("Device not found") };
      case (?device) {
        let updatedDevice = {
          device with
          status = status;
          lastPing = Time.now();
        };
        devices.put(deviceId, updatedDevice);

        // Create alert if device goes offline
        if (status == #Offline and device.status != #Offline) {
          ignore createAlert(deviceId, #DeviceOffline, #Medium, "Device has gone offline");
        };

        #ok("Device status updated")
      };
    }
  };

  public shared ({ caller }) func recordData(
    deviceId: Text,
    measurements: [(MetricType, Float, Text)]
  ): async Result.Result<Text, Text> {
    if (not isDeviceOwner(deviceId, caller)) {
      return #err("Only device owner can record data");
    };

    switch (devices.get(deviceId)) {
      case (null) { #err("Device not found") };
      case (?device) {
        let currentTime = Time.now();
        let existingData = switch (deviceData.get(deviceId)) {
          case (?data) { data };
          case (null) { [] };
        };

        let newDataPoints = Array.map<(MetricType, Float, Text), DataPoint>(
          measurements,
          func((metricType, value, unit): (MetricType, Float, Text)): DataPoint {
            {
              deviceId = deviceId;
              metricType = metricType;
              value = value;
              unit = unit;
              timestamp = currentTime;
              quality = #Good;
            }
          }
        );

        // Keep last 1000 data points per device (simple retention policy)
        let allData = Array.append(existingData, newDataPoints);
        let trimmedData = if (allData.size() > 1000) {
          Array.tabulate<DataPoint>(1000, func(i: Nat): DataPoint {
            allData[allData.size() - 1000 + i]
          })
        } else {
          allData
        };

        deviceData.put(deviceId, trimmedData);

        // Update device last ping
        let updatedDevice = { device with lastPing = currentTime; status = #Online };
        devices.put(deviceId, updatedDevice);

        // Check for alerts based on data
        for (dataPoint in newDataPoints.vals()) {
          switch (dataPoint.metricType) {
            case (#Temperature) {
              if (dataPoint.value > 85.0) {
                ignore createAlert(deviceId, #HighTemperature, #High, "High temperature detected: " # Float.toText(dataPoint.value) # "°C");
              };
            };
            case (#BatteryLevel) {
              if (dataPoint.value < 20.0) {
                ignore createAlert(deviceId, #LowBattery, #Medium, "Low battery level: " # Float.toText(dataPoint.value) # "%");
              };
            };
            case (_) {};
          };
        };

        #ok("Data recorded successfully")
      };
    }
  };

  public query func getDevice(deviceId: Text): async ?Device {
    devices.get(deviceId)
  };

  public query ({ caller }) func getMyDevices(): async [Device] {
    let allDevices = Iter.toArray(devices.vals());
    Array.filter<Device>(allDevices, func(device: Device): Bool {
      device.owner == caller
    })
  };

  public query func getAllDevices(): async [Device] {
    Iter.toArray(devices.vals())
  };

  public query func getDeviceData(deviceId: Text, limit: ?Nat): async ?[DataPoint] {
    switch (deviceData.get(deviceId)) {
      case (null) { null };
      case (?data) {
        switch (limit) {
          case (?n) {
            if (data.size() <= n) {
              ?data
            } else {
              ?Array.tabulate<DataPoint>(n, func(i: Nat): DataPoint {
                data[data.size() - n + i]
              })
            }
          };
          case (null) { ?data };
        }
      };
    }
  };

  public query func getLatestData(deviceId: Text, metricType: MetricType): async ?DataPoint {
    switch (deviceData.get(deviceId)) {
      case (null) { null };
      case (?data) {
        let filtered = Array.filter<DataPoint>(data, func(dp: DataPoint): Bool {
          dp.metricType == metricType
        });
        if (filtered.size() > 0) {
          ?filtered[filtered.size() - 1]
        } else {
          null
        }
      };
    }
  };

  public query func getAggregatedData(
    deviceId: Text,
    metricType: MetricType,
    timeRange: TimeRange
  ): async ?AggregatedData {
    switch (deviceData.get(deviceId)) {
      case (null) { null };
      case (?data) {
        let filtered = Array.filter<DataPoint>(data, func(dp: DataPoint): Bool {
          dp.metricType == metricType and
          dp.timestamp >= timeRange.start and
          dp.timestamp <= timeRange.end
        });

        if (filtered.size() == 0) {
          return null;
        };

        var sum: Float = 0.0;
        var min: Float = filtered[0].value;
        var max: Float = filtered[0].value;

        for (dp in filtered.vals()) {
          sum += dp.value;
          if (dp.value < min) { min := dp.value };
          if (dp.value > max) { max := dp.value };
        };

        let average = sum / Float.fromInt(filtered.size());

        ?{
          metricType = metricType;
          deviceId = deviceId;
          timeRange = timeRange;
          average = average;
          minimum = min;
          maximum = max;
          sum = sum;
          count = filtered.size();
        }
      };
    }
  };

  public query func getAlerts(deviceId: ?Text, acknowledged: ?Bool): async [Alert] {
    let allAlerts = Iter.toArray(alerts.vals());
    Array.filter<Alert>(allAlerts, func(alert: Alert): Bool {
      let deviceMatch = switch (deviceId) {
        case (?id) { alert.deviceId == id };
        case (null) { true };
      };
      let ackMatch = switch (acknowledged) {
        case (?ack) { alert.acknowledged == ack };
        case (null) { true };
      };
      deviceMatch and ackMatch
    })
  };

  public shared ({ caller }) func acknowledgeAlert(alertId: Nat): async Result.Result<Text, Text> {
    switch (alerts.get(alertId)) {
      case (null) { #err("Alert not found") };
      case (?alert) {
        // Check if caller owns the device
        if (not isDeviceOwner(alert.deviceId, caller)) {
          return #err("Only device owner can acknowledge alerts");
        };

        let updatedAlert = {
          alert with
          acknowledged = true;
          acknowledgedBy = ?caller;
          acknowledgedAt = ?Time.now();
        };
        alerts.put(alertId, updatedAlert);
        #ok("Alert acknowledged")
      };
    }
  };

  public query func getTelemetryStats(): async {
    totalDevices: Nat;
    onlineDevices: Nat;
    totalDataPoints: Nat;
    unacknowledgedAlerts: Nat;
    devicesByType: [(DeviceType, Nat)];
  } {
    let allDevices = Iter.toArray(devices.vals());
    let onlineCount = Array.filter<Device>(allDevices, func(d: Device): Bool { d.status == #Online }).size();

    let allAlerts = Iter.toArray(alerts.vals());
    let unacknowledgedCount = Array.filter<Alert>(allAlerts, func(a: Alert): Bool { not a.acknowledged }).size();

    var totalDataCount: Nat = 0;
    for (data in deviceData.vals()) {
      totalDataCount += data.size();
    };

    // Count devices by type
    var solarPanels: Nat = 0;
    var inverters: Nat = 0;
    var batteries: Nat = 0;
    var meters: Nat = 0;
    var weather: Nat = 0;
    var grid: Nat = 0;

    for (device in allDevices.vals()) {
      switch (device.deviceType) {
        case (#SolarPanel) { solarPanels += 1 };
        case (#Inverter) { inverters += 1 };
        case (#Battery) { batteries += 1 };
        case (#EnergyMeter) { meters += 1 };
        case (#WeatherStation) { weather += 1 };
        case (#GridConnection) { grid += 1 };
      };
    };

    {
      totalDevices = devices.size();
      onlineDevices = onlineCount;
      totalDataPoints = totalDataCount;
      unacknowledgedAlerts = unacknowledgedCount;
      devicesByType = [
        (#SolarPanel, solarPanels),
        (#Inverter, inverters),
        (#Battery, batteries),
        (#EnergyMeter, meters),
        (#WeatherStation, weather),
        (#GridConnection, grid)
      ];
    }
  };

  // Administrative functions
  public shared ({ caller }) func createManualAlert(
    deviceId: Text,
    alertType: AlertType,
    severity: Severity,
    message: Text
  ): async Result.Result<Nat, Text> {
    if (not isDeviceOwner(deviceId, caller)) {
      return #err("Only device owner can create alerts");
    };

    let alertId = createAlert(deviceId, alertType, severity, message);
    #ok(alertId)
  };
}
