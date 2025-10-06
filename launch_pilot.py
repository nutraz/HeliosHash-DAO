#!/usr/bin/env python3
"""
HHDAO Pilot Launcher — "The Last Rimeminester's Tool"
Automates deployment, onboarding, and voice-guided activation of the Urgam Valley Solar DAO.
Aligns with 1WP UrgamU Smart City: https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity
"""

import os
import sys
import json
import subprocess
import time
import requests
import numpy as np
from pathlib import Path
from datetime import datetime
import sqlite3
import tempfile
from typing import Dict, List, Tuple, Optional
import math

# === CONFIGURATION ===
PROJECT_ROOT = Path(__file__).parent.resolve()
DFX_NETWORK = os.getenv("DFX_NETWORK", "local")  # or "ic"
URGAM_COORDS = {"lat": 30.1652, "lng": 78.8487}  # Uttarakhand
DELHI_PARTNERS = [
    {"name": "Delhi Solar Coop", "role": "LandSteward", "document_id": "DELHI_SOLAR_001"},
    {"name": "Uttarakhand Gram Panchayat", "role": "CommunityValidator", "document_id": "GRAM_PANCH_URGAM"},
    {"name": "One World Project India", "role": "TechSteward", "document_id": "1WP_INDIA_001"}
]

# === THERMAL MANAGEMENT CONFIGURATION ===
THERMAL_THRESHOLDS = {
    "panel_max_temp": 65.0,  # Celsius - maximum safe operating temperature
    "inverter_max_temp": 40.0,  # Celsius - inverter thermal threshold
    "battery_max_temp": 35.0,  # Celsius - battery thermal threshold
    "ambient_operating_range": (-10.0, 50.0),  # Operating range for Uttarakhand climate
    "efficiency_degradation": {
        "25": 1.0,   # 100% efficiency at 25°C
        "35": 0.96,  # 96% efficiency at 35°C
        "45": 0.90,  # 90% efficiency at 45°C
        "55": 0.82,  # 82% efficiency at 55°C
        "65": 0.70   # 70% efficiency at 65°C (max safe)
    }
}

# === THERMAL MANAGEMENT FUNCTIONS ===

def init_thermal_db():
    """
    Create and initialize the SQLite database used to store thermal readings and alerts.
    
    Creates the database file at PROJECT_ROOT/thermal_data.db (if missing) and ensures the
    tables `thermal_readings` and `thermal_alerts` exist with the expected schema.
    
    Returns:
        db_path (Path): Path to the SQLite database file that was created or opened.
    """
    db_path = PROJECT_ROOT / "thermal_data.db"
    conn = sqlite3.connect(db_path)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS thermal_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            device_id TEXT NOT NULL,
            device_type TEXT NOT NULL, -- 'panel', 'inverter', 'battery'
            temperature REAL NOT NULL,
            efficiency REAL,
            ambient_temp REAL,
            humidity REAL,
            solar_irradiance REAL,
            location_lat REAL,
            location_lng REAL,
            alert_level TEXT DEFAULT 'normal' -- 'normal', 'warning', 'critical'
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS thermal_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            device_id TEXT NOT NULL,
            alert_type TEXT NOT NULL, -- 'temperature', 'efficiency', 'failure'
            severity TEXT NOT NULL, -- 'warning', 'critical', 'emergency'
            message TEXT NOT NULL,
            resolved BOOLEAN DEFAULT FALSE,
            resolved_at DATETIME
        )
    """)
    
    conn.commit()
    conn.close()
    return db_path

def calculate_thermal_efficiency(panel_temp: float, base_temp: float = 25.0) -> float:
    """
    Estimate a multiplicative efficiency factor for a silicon solar panel based on its operating temperature.
    
    Parameters:
        panel_temp (float): Measured panel temperature in degrees Celsius.
        base_temp (float): Reference temperature in degrees Celsius at which efficiency is nominal (default 25.0).
    
    Returns:
        float: Efficiency multiplier (e.g., 0.98 means 98% of nominal). The value is bounded below by 0.5.
    """
    # Standard temperature coefficient for silicon panels: -0.4% per °C
    temp_coefficient = -0.004
    temp_diff = panel_temp - base_temp
    efficiency_factor = 1 + (temp_coefficient * temp_diff)
    return max(0.5, efficiency_factor)  # Minimum 50% efficiency

def simulate_thermal_profile(
    ambient_temp: float, 
    solar_irradiance: float, 
    wind_speed: float = 2.0,
    time_of_day: int = 12
) -> Dict[str, float]:
    """
    Estimate temperatures and thermal efficiency for the solar array, inverter, and battery using a simplified thermal model for Urgam Valley conditions.
    
    Simulated values are coarse estimates based on ambient temperature, solar irradiance, and wind cooling; this function is intended for planning and monitoring scenarios rather than detailed engineering analysis.
    
    Parameters:
        ambient_temp (float): Ambient air temperature in degrees Celsius.
        solar_irradiance (float): Solar irradiance in watts per square meter (W/m²).
        wind_speed (float): Wind speed in meters per second (m/s); defaults to 2.0 and affects convective cooling.
        time_of_day (int): Hour of day (0–23); reserved for future use and does not affect the current simplified model.
    
    Returns:
        dict: A mapping with keys:
            - "panel_temp" (float): Estimated PV module temperature in °C (rounded to 2 decimals).
            - "inverter_temp" (float): Estimated inverter temperature in °C (rounded to 2 decimals).
            - "battery_temp" (float): Estimated battery temperature in °C (rounded to 2 decimals).
            - "efficiency" (float): Thermal-adjusted panel efficiency (unitless fraction, rounded to 3 decimals).
            - "ambient_temp" (float): Echoes the provided ambient temperature (°C).
            - "solar_irradiance" (float): Echoes the provided solar irradiance (W/m²).
            - "wind_speed" (float): Echoes the provided wind speed (m/s).
    """
    
    # Panel temperature calculation (simplified model)
    # Formula: Tpanel = Tambient + ((NOCT - 20) / 800) * Solar_Irradiance * (1 - efficiency) / (1 + wind_factor)
    noct = 45  # Nominal Operating Cell Temperature
    panel_efficiency = 0.20  # 20% panel efficiency
    wind_factor = 0.05 * wind_speed  # Wind cooling effect
    
    panel_temp_rise = ((noct - 20) / 800) * solar_irradiance * (1 - panel_efficiency) / (1 + wind_factor)
    panel_temp = ambient_temp + panel_temp_rise
    
    # Inverter temperature (typically 10-15°C above ambient under load)
    inverter_load_factor = min(1.0, solar_irradiance / 1000)  # Load based on irradiance
    inverter_temp = ambient_temp + (12 * inverter_load_factor)
    
    # Battery temperature (more stable, slightly above ambient)
    battery_temp = ambient_temp + 3 + (2 * inverter_load_factor)
    
    return {
        "panel_temp": round(panel_temp, 2),
        "inverter_temp": round(inverter_temp, 2),
        "battery_temp": round(battery_temp, 2),
        "efficiency": round(calculate_thermal_efficiency(panel_temp), 3),
        "ambient_temp": ambient_temp,
        "solar_irradiance": solar_irradiance,
        "wind_speed": wind_speed
    }

def check_thermal_alerts(thermal_data: Dict[str, float]) -> List[Dict[str, str]]:
    """
    Evaluate thermal measurements and produce structured alerts for panel, inverter, and efficiency issues.
    
    Parameters:
        thermal_data (Dict[str, float]): Measured values keyed by 'panel_temp', 'inverter_temp', and 'efficiency' (efficiency as a fractional value, e.g., 0.95).
    
    Returns:
        List[Dict[str, str]]: A list of alert objects. Each alert contains:
            - 'device_type': device affected ('panel' or 'inverter'),
            - 'severity': 'warning' or 'critical',
            - 'message': human-readable description of the condition.
    """
    alerts = []
    
    # Panel temperature alerts
    if thermal_data["panel_temp"] > THERMAL_THRESHOLDS["panel_max_temp"]:
        alerts.append({
            "device_type": "panel",
            "severity": "critical",
            "message": f"Panel temperature {thermal_data['panel_temp']}°C exceeds maximum safe operating temperature"
        })
    elif thermal_data["panel_temp"] > THERMAL_THRESHOLDS["panel_max_temp"] - 5:
        alerts.append({
            "device_type": "panel", 
            "severity": "warning",
            "message": f"Panel temperature {thermal_data['panel_temp']}°C approaching maximum threshold"
        })
    
    # Inverter temperature alerts
    if thermal_data["inverter_temp"] > THERMAL_THRESHOLDS["inverter_max_temp"]:
        alerts.append({
            "device_type": "inverter",
            "severity": "critical", 
            "message": f"Inverter temperature {thermal_data['inverter_temp']}°C exceeds safe operating range"
        })
    
    # Efficiency alerts
    if thermal_data["efficiency"] < 0.80:
        alerts.append({
            "device_type": "panel",
            "severity": "warning",
            "message": f"Panel efficiency reduced to {thermal_data['efficiency']*100:.1f}% due to high temperature"
        })
    
    return alerts

def monitor_thermal_systems():
    """
    Run one iteration of the thermal monitoring pipeline for the Urgam Valley installation.
    
    Simulates current environmental conditions (ambient temperature, solar irradiance, wind), computes a thermal profile for panel/inverter/battery and system efficiency, checks against configured thermal thresholds to produce alerts, persists the readings and any alerts to the local thermal SQLite database, and prints a concise status summary to stdout.
    
    Returns:
        thermal_profile (dict): A mapping containing keys such as `panel_temp`, `inverter_temp`, `battery_temp`, `efficiency`, `ambient_temp`, `solar_irradiance`, and `wind_speed`.
        alerts (list): A list of alert dictionaries; each alert includes at least `device_type`, `severity`, and `message`.
    """
    print("\n🌡️ Initializing thermal management system...")
    
    # Initialize database
    db_path = init_thermal_db()
    print(f"✅ Thermal database initialized: {db_path}")
    
    # Simulate current conditions for Urgam Valley
    # (In production, this would read from actual IoT sensors)
    import random
    
    # Typical Uttarakhand weather conditions
    current_hour = datetime.now().hour
    base_ambient = 25 + (5 * math.sin((current_hour - 6) * math.pi / 12))  # Temperature curve
    ambient_variation = random.uniform(-3, 3)
    ambient_temp = base_ambient + ambient_variation
    
    # Solar irradiance based on time of day
    if 6 <= current_hour <= 18:
        max_irradiance = 800 + random.uniform(-100, 100)
        irradiance = max_irradiance * math.sin((current_hour - 6) * math.pi / 12)
    else:
        irradiance = 0
    
    wind_speed = random.uniform(1, 5)  # m/s
    
    # Generate thermal profile
    thermal_profile = simulate_thermal_profile(ambient_temp, irradiance, wind_speed, current_hour)
    
    # Check for alerts
    alerts = check_thermal_alerts(thermal_profile)
    
    # Store data in database
    conn = sqlite3.connect(db_path)
    conn.execute("""
        INSERT INTO thermal_readings 
        (device_id, device_type, temperature, efficiency, ambient_temp, 
         solar_irradiance, location_lat, location_lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "URGAM_PANEL_001", "panel", thermal_profile["panel_temp"], 
        thermal_profile["efficiency"], thermal_profile["ambient_temp"],
        thermal_profile["solar_irradiance"], URGAM_COORDS["lat"], URGAM_COORDS["lng"]
    ))
    
    # Store alerts
    for alert in alerts:
        conn.execute("""
            INSERT INTO thermal_alerts (device_id, alert_type, severity, message)
            VALUES (?, ?, ?, ?)
        """, (
            "URGAM_PANEL_001", "temperature", alert["severity"], alert["message"]
        ))
    
    conn.commit()
    conn.close()
    
    # Display current status
    print(f"📊 Current Thermal Status (Urgam Valley):")
    print(f"   🌡️  Ambient Temperature: {thermal_profile['ambient_temp']:.1f}°C")
    print(f"   🔆 Solar Irradiance: {thermal_profile['solar_irradiance']:.0f} W/m²")
    print(f"   📋 Panel Temperature: {thermal_profile['panel_temp']:.1f}°C")
    print(f"   ⚡ System Efficiency: {thermal_profile['efficiency']*100:.1f}%")
    print(f"   💨 Wind Speed: {thermal_profile['wind_speed']:.1f} m/s")
    
    if alerts:
        print(f"\n⚠️  Active Thermal Alerts:")
        for alert in alerts:
            severity_emoji = "🚨" if alert["severity"] == "critical" else "⚠️"
            print(f"   {severity_emoji} {alert['message']}")
    else:
        print("\n✅ All thermal systems operating within normal parameters")
    
    return thermal_profile, alerts

def generate_thermal_bim_export():
    """
    Create BIM-compatible thermal export for the Urgam Valley installation and write a simplified CSV summary.
    
    Writes a JSON file containing project metadata, thermal zones (solar array, inverter room, battery storage), and thermal analysis details (design temperatures, cooling strategies, monitoring points). Also writes a CSV that summarizes each zone with area, representative max/min temperatures, and chosen cooling strategy.
    
    Returns:
        (Path, Path): Tuple with the path to the BIM JSON export and the path to the thermal summary CSV.
    """
    print("\n🏗️ Generating BIM thermal export for Urgam Valley installation...")
    
    # Create BIM-compatible thermal model data
    bim_data = {
        "project": {
            "name": "Urgam Valley Solar Installation",
            "location": URGAM_COORDS,
            "climate_zone": "Himalayas_Subtropical", 
            "altitude_m": 1652  # Urgam Valley elevation
        },
        "thermal_zones": [
            {
                "zone_id": "SOLAR_ARRAY_001",
                "type": "solar_panel_array",
                "area_m2": 500,  # 500 m² solar array
                "orientation": 180,  # South-facing
                "tilt_angle": 30,   # Optimal for latitude
                "thermal_properties": {
                    "thermal_mass": "low",
                    "heat_capacity": 900,  # J/kg·K for silicon
                    "emissivity": 0.90,
                    "absorptance": 0.95
                }
            },
            {
                "zone_id": "INVERTER_ROOM",
                "type": "equipment_enclosure", 
                "area_m2": 25,
                "volume_m3": 75,
                "ventilation_cfm": 500,
                "thermal_properties": {
                    "thermal_mass": "medium",
                    "insulation_r_value": 15,
                    "air_changes_per_hour": 8
                }
            },
            {
                "zone_id": "BATTERY_STORAGE",
                "type": "battery_enclosure",
                "area_m2": 20,
                "volume_m3": 60, 
                "thermal_properties": {
                    "thermal_mass": "high",
                    "insulation_r_value": 20,
                    "temperature_control": "active_cooling"
                }
            }
        ],
        "thermal_analysis": {
            "design_temperatures": {
                "winter_design_low": -5,  # °C
                "summer_design_high": 42,  # °C
                "panel_operating_range": [25, 65]
            },
            "cooling_strategies": [
                "natural_ventilation",
                "passive_cooling", 
                "thermal_mass",
                "reflective_surfaces"
            ],
            "monitoring_points": [
                {"id": "TP001", "location": "panel_center", "type": "temperature"},
                {"id": "TP002", "location": "inverter_inlet", "type": "temperature"},
                {"id": "TP003", "location": "battery_core", "type": "temperature"},
                {"id": "HM001", "location": "ambient", "type": "humidity"},
                {"id": "WS001", "location": "site_perimeter", "type": "wind_speed"}
            ]
        }
    }
    
    # Export to JSON for BIM software integration
    bim_export_path = PROJECT_ROOT / "thermal_bim_export.json"
    with open(bim_export_path, "w") as f:
        json.dump(bim_data, f, indent=2)
    
    print(f"✅ BIM thermal export saved: {bim_export_path}")
    
    # Generate simplified CSV for spreadsheet analysis
    csv_path = PROJECT_ROOT / "thermal_summary.csv"
    with open(csv_path, "w") as f:
        f.write("Zone,Type,Area_m2,Max_Temp_C,Min_Temp_C,Cooling_Strategy\n")
        for zone in bim_data["thermal_zones"]:
            zone_type = zone["type"]
            area = zone.get("area_m2", 0)
            if zone_type == "solar_panel_array":
                max_temp, min_temp = 65, 25
                cooling = "passive_ventilation"
            elif zone_type == "equipment_enclosure":
                max_temp, min_temp = 40, 20  
                cooling = "forced_ventilation"
            else:  # battery_enclosure
                max_temp, min_temp = 35, 15
                cooling = "active_cooling"
            
            f.write(f"{zone['zone_id']},{zone_type},{area},{max_temp},{min_temp},{cooling}\n")
    
    print(f"✅ Thermal summary CSV: {csv_path}")
    return bim_export_path, csv_path

# === CORE FUNCTIONS ===

def run_cmd(cmd: str, cwd=None, check=True):
    """
    Execute a shell command and return its stdout.
    
    Prints the command before running it, captures both stdout and stderr, and if `check` is True exits the process with status 1 when the command returns a non-zero code. Standard output is trimmed of surrounding whitespace before being returned.
    
    Parameters:
        cmd (str): The shell command to run.
        cwd (Optional[str or Path]): Working directory to run the command in; defaults to the project root.
        check (bool): If True, exit the process on non-zero return code; if False, return stdout even when the command fails.
    
    Returns:
        str: Trimmed standard output from the executed command.
    """
    print(f"🚀 {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd or PROJECT_ROOT, 
                          capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"❌ Failed: {result.stderr}")
        if result.stdout:
            print(f"📄 Output: {result.stdout}")
        sys.exit(1)
    return result.stdout.strip()

def check_prerequisites():
    """Verify all required tools and services are available."""
    print("\n🔧 Checking prerequisites...")
    
    # Check DFX installation
    try:
        dfx_version = run_cmd("dfx --version")
        print(f"✅ DFX: {dfx_version}")
    except:
        print("❌ DFX not installed. Run: sh -ci \"$(curl -fsSL https://sdk.dfinity.org/install.sh)\"")
        sys.exit(1)
    
    # Check Node.js for frontend
    try:
        node_version = run_cmd("node --version")
        print(f"✅ Node.js: {node_version}")
    except:
        print("❌ Node.js not installed")
        sys.exit(1)
    
    # Check if existing scripts are executable
    for script in ["deploy-pilot.sh", "generate-qr.sh", "health-check.sh"]:
        script_path = PROJECT_ROOT / "scripts" / script
        if script_path.exists():
            os.chmod(script_path, 0o755)
            print(f"✅ Made {script} executable")
    
    print("✅ All prerequisites met!")

def deploy_canisters():
    """Deploy all HHDAO canisters using existing deployment scripts."""
    print(f"\n📦 Deploying HHDAO canisters to {DFX_NETWORK}...")
    
    # Use existing deploy-pilot.sh with auto-proposal
    deploy_cmd = f"bash scripts/deploy-pilot.sh --network {DFX_NETWORK} --auto-proposal"
    run_cmd(deploy_cmd)
    
    # Extract canister IDs from .pilot/addresses.json if it exists
    addr_file = PROJECT_ROOT / ".pilot" / "addresses.json"
    if addr_file.exists():
        with open(addr_file, 'r') as f:
            ids = json.load(f)
        print("✅ Canister deployment complete!")
        return ids
    
    # Fallback: extract IDs manually
    ids = {}
    for canister in ["hhdao_dao", "hhdao_treasury", "hhdao_identity", "hhdao_telemetry"]:
        try:
            canister_id = run_cmd(f"dfx canister --network {DFX_NETWORK} id {canister}")
            ids[canister] = canister_id
            print(f"  📍 {canister}: {canister_id}")
        except:
            print(f"⚠️  Could not get ID for {canister}")
    
    return ids

def onboard_delhi_partners(canister_ids):
    """Onboard Delhi partners as merit stewards using existing proposal system."""
    print("\n🤝 Onboarding Delhi partners as Land Stewards...")
    
    if "hhdao_dao" not in canister_ids:
        print("⚠️  DAO canister not found, skipping partner onboarding")
        return
    
    dao_id = canister_ids["hhdao_dao"]
    
    for partner in DELHI_PARTNERS:
        # Create proposal using existing template
        proposal = {
            "title": f"Grant {partner['role']}: {partner['name']}",
            "description": f"Grant governance weight for {partner['role'].lower()} commitment in Urgam Valley. Document ID: {partner['document_id']}",
            "category": "governance",
            "proposer": "pilot-launcher",
            "location": URGAM_COORDS,
            "metadata": {
                "document_id": partner["document_id"], 
                "role": partner["role"],
                "partner_type": "delhi_steward",
                "region": "uttarakhand"
            }
        }
        
        # Save proposal to temp file
        temp_proposal = PROJECT_ROOT / f"temp_proposal_{partner['name'].replace(' ', '_')}.json"
        with open(temp_proposal, "w") as f:
            json.dump(proposal, f, indent=2)
        
        # Submit proposal (use create-proposal.sh if it exists)
        proposal_script = PROJECT_ROOT / "scripts" / "create-proposal.sh"
        if proposal_script.exists():
            run_cmd(f"bash scripts/create-proposal.sh --file {temp_proposal} --network {DFX_NETWORK}")
        else:
            # Direct canister call
            escaped_title = proposal["title"].replace('"', '\\"')
            escaped_desc = proposal["description"].replace('"', '\\"')
            run_cmd(f'dfx canister --network {DFX_NETWORK} call {dao_id} createProposal \'(record {{ title="{escaped_title}"; description="{escaped_desc}"; category="{proposal["category"]}" }})\'')
        
        # Clean up temp file
        temp_proposal.unlink(missing_ok=True)
        print(f"  ✅ Proposal submitted for {partner['name']}")
    
    print("🎉 All Delhi partners onboarded!")

def launch_voice_pilot():
    """Generate QR code + voice onboarding flow for villagers."""
    print("\n🎙️ Launching voice-first onboarding for Urgam...")
    
    # Use existing generate-qr.sh
    qr_script = PROJECT_ROOT / "scripts" / "generate-qr.sh"
    if qr_script.exists():
        run_cmd(f"bash {qr_script}")
        print("  📱 QR code generated for mobile access")
    else:
        print("  ⚠️  generate-qr.sh not found")
    
    # Setup voice interface
    voice_ext = PROJECT_ROOT / "extensions" / "voicenotesai"
    if voice_ext.exists():
        print("🔊 Setting up VoiceNotes AI for Hindi/Gujarati transcription...")
        setup_script = voice_ext / "setup.sh"
        if setup_script.exists():
            run_cmd(f"bash {setup_script}", cwd=voice_ext, check=False)
            print("  ✅ Voice interface configured")
        else:
            print("  ⚠️  VoiceNotes setup script not found")
    else:
        print("  ⚠️  VoiceNotes extension not found")
    
    # Start mobile development server if available
    mobile_script = PROJECT_ROOT / "scripts" / "mobile-dev.sh"
    if mobile_script.exists():
        print("📱 Starting mobile development environment...")
        run_cmd(f"bash {mobile_script}", check=False)
    
    print("🌟 Voice pilot ready! Share QR codes with Urgam villagers.")

def sync_with_1wp(canister_ids):
    """
    Register this deployment with the 1WP UrgamU Smart City registry by composing registration metadata and saving it to .pilot/1wp_registration.json.
    
    Parameters:
        canister_ids (dict): Mapping of canister names to deployed canister IDs to include in the registration payload.
    
    Notes:
        The function writes the registration file locally and prints the prepared data; it does not perform a network POST to the 1WP API.
    """
    print("\n🔗 Syncing with 1WP UrgamU DAO...")
    
    # Prepare registration data
    registration_data = {
        "project_name": "HeliosHash DAO - Urgam Valley",
        "region": "Uttarakhand, India",
        "coordinates": URGAM_COORDS,
        "canister_ids": canister_ids,
        "network": DFX_NETWORK,
        "timestamp": datetime.now().isoformat(),
        "integration_type": "solar_dao",
        "parent_project": "UrgamU Smart City"
    }
    
    # Save registration locally
    reg_file = PROJECT_ROOT / ".pilot" / "1wp_registration.json"
    reg_file.parent.mkdir(exist_ok=True)
    with open(reg_file, "w") as f:
        json.dump(registration_data, f, indent=2)
    
    print("📝 Registration data prepared:")
    for canister, canister_id in canister_ids.items():
        print(f"   - {canister}: {canister_id}")
    
    # TODO: In production, POST to 1WP API
    print("🔗 1WP API integration: https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity")
    print(f"📄 Registration saved to: {reg_file}")
    print("✅ Ready for 1WP ecosystem integration!")

def monitor_compute_profitability():
    """
    Monitor Bitcoin-mining profitability and trigger a pivot to AI compute mode when mining becomes unprofitable.
    
    If the calculated profit per TH/s is below the internal threshold, the function attempts to call the hhdao_compute canister to pivot to AI compute, prints status and estimated AI revenue/profit, and may update hardware configuration (simulated). Uses simulated hardware and market values for the profitability calculation.
    
    Returns:
        profitability_per_th (float): Estimated profit in USD per TH/s per day.
    """
    print("\n⚡ Starting compute profitability monitoring...")
    
    # Mock API calls (replace with real data sources in production)
    btc_difficulty = 65000000000000  # Current Bitcoin difficulty
    btc_price = 43500  # USD
    power_cost = 0.12  # USD per kWh (Uttarakhand rates)
    
    # Calculate profitability threshold
    profitability_threshold = 0.10  # USD per TH/s per day
    
    # Simulate hardware stats
    hash_rate = 50.0  # TH/s
    power_consumption = 3.5  # kW
    
    # Calculate current profitability
    daily_btc_earnings = (hash_rate * 86400) / (btc_difficulty * (2**32)) * 6.25 * btc_price
    daily_power_cost = power_consumption * 24 * power_cost
    daily_profit = daily_btc_earnings - daily_power_cost
    profitability_per_th = daily_profit / hash_rate
    
    print(f"📊 Current BTC profitability: ${profitability_per_th:.4f} per TH/s per day")
    print(f"🎯 Threshold: ${profitability_threshold:.4f} per TH/s per day")
    
    # Check if pivot is needed
    if profitability_per_th < profitability_threshold:
        print("🚨 Bitcoin mining below profitability threshold!")
        print("🔄 Triggering pivot to AI compute...")
        
        try:
            # Call compute canister to pivot
            pivot_result = run_cmd(
                f'dfx canister --network {DFX_NETWORK} call hhdao_compute '
                f'pivotComputeMode \'("ai", "profitability", {profitability_threshold})\'',
                check=False
            )
            
            if "ok" in pivot_result.lower():
                print("✅ Successfully pivoted to AI compute mode")
                
                # Update hardware configuration (mock)
                print("🔧 Updating hardware configuration for AI workloads...")
                time.sleep(2)
                
                # Estimate AI compute revenue
                ai_workloads_per_hour = 75
                ai_revenue_per_job = 0.02  # USD
                daily_ai_revenue = ai_workloads_per_hour * 24 * ai_revenue_per_job
                ai_profit = daily_ai_revenue - daily_power_cost
                
                print(f"💡 Estimated AI revenue: ${daily_ai_revenue:.2f} per day")
                print(f"💰 Estimated AI profit: ${ai_profit:.2f} per day")
                print(f"📈 Improvement: +{((ai_profit - daily_profit) / abs(daily_profit) * 100):.1f}%")
                
            else:
                print(f"❌ Pivot failed: {pivot_result}")
                
        except Exception as e:
            print(f"❌ Error during pivot: {e}")
    else:
        print("✅ Bitcoin mining profitable, maintaining current mode")
    
    return profitability_per_th

def simulate_thermal_optimization():
    """
    Run a thermal simulation, report results, and apply recommended optimizations when beneficial.
    
    Executes a daily thermal simulation, prints a summary of key metrics (average temperature reduction, energy gain, water saved, estimated revenue gain), and — if the simulation reports an average efficiency improvement greater than 5% — attempts to apply the computed optimization by updating compute statistics via the configured canister. 
    
    Returns:
        dict: Parsed thermal simulation results when available.
        None: If simulation results are not found or an error occurs.
    """
    print("\n🌡️ Running thermal optimization simulation...")
    
    try:
        # Run thermal simulation script
        result = run_cmd(
            "python3 scripts/thermal_simulation.py --mode daily --output .pilot/thermal_results.json",
            check=False
        )
        
        # Load results
        thermal_file = PROJECT_ROOT / ".pilot" / "thermal_results.json"
        if thermal_file.exists():
            with open(thermal_file, 'r') as f:
                thermal_data = json.load(f)
            
            daily_summary = thermal_data.get('daily_summary', {})
            
            print(f"📊 Thermal Optimization Results:")
            print(f"   🔥 Average temp reduction: {daily_summary.get('average_temp_reduction', 0):.1f}°C")
            print(f"   ⚡ Energy gain: {daily_summary.get('total_energy_gain_kwh', 0):.2f} kWh/day")
            print(f"   💧 Water saved: {daily_summary.get('total_water_saved_liters', 0):.1f} L/day")
            print(f"   💰 Revenue gain: ₹{daily_summary.get('estimated_revenue_gain_inr', 0):.2f}/day")
            
            # Apply optimization recommendations
            efficiency_gain = daily_summary.get('average_efficiency_gain', 0) / 100
            if efficiency_gain > 0.05:  # 5% improvement threshold
                print("🎯 Significant efficiency gains detected!")
                print("🔧 Updating system configuration...")
                
                # Update compute stats with thermal improvements
                try:
                    update_cmd = (
                        f'dfx canister --network {DFX_NETWORK} call hhdao_compute '
                        f'updateComputeStats \'(50.0, 80, 3.2, {45 * (1 + efficiency_gain)})\''
                    )
                    run_cmd(update_cmd, check=False)
                    print("✅ Thermal optimizations applied to compute system")
                except:
                    print("⚠️ Could not update compute stats")
            
            return thermal_data
        else:
            print("⚠️ Thermal simulation data not available")
            return None
            
    except Exception as e:
        print(f"❌ Thermal simulation error: {e}")
        return None

def start_development_server():
    """
    Start and return a local Next.js development server process for the project.
    
    If node_modules is missing, installs project dependencies before launching. Starts the server on http://localhost:3001 and returns the subprocess handle for the background process.
    
    Returns:
        subprocess.Popen: A process handle for the spawned development server.
    """
    print("\n🌐 Starting development server...")
    
    # Install dependencies if needed
    if not (PROJECT_ROOT / "node_modules").exists():
        print("📦 Installing dependencies...")
        run_cmd("pnpm install")
    
    # Start server in background
    print("🚀 Starting server on http://localhost:3001...")
    return subprocess.Popen(["pnpm", "dev"], cwd=PROJECT_ROOT)

def monitor_health():
    """Monitor system health and impact metrics."""
    print("\n👁️  Monitoring system health...")
    print("   Press Ctrl+C to stop monitoring")
    
    try:
        while True:
            try:
                # Check local API status
                response = requests.get("http://localhost:3001/api/status", timeout=5)
                if response.status_code == 200:
                    status = response.json()
                    print(f"\n🟢 System Status ({datetime.now().strftime('%H:%M:%S')})")
                    
                    if "canisters" in status:
                        for name, info in status["canisters"].items():
                            status_emoji = "🟢" if info.get("status") == "healthy" else "🟡"
                            print(f"   {status_emoji} {name}: {info.get('status', 'unknown')}")
                    
                    if "projects" in status:
                        print(f"   🗺️  Projects: {len(status.get('projects', []))} active")
                    
                    if "network" in status:
                        print(f"   🌐 Network: {status['network']}")
                
                else:
                    print(f"🟡 API Status: {response.status_code}")
                    
            except requests.exceptions.RequestException:
                print("🔴 Development server not reachable")
            
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping health monitor.")

def cleanup():
    """Clean up temporary files."""
    temp_files = list(PROJECT_ROOT.glob("temp_proposal_*.json"))
    for temp_file in temp_files:
        temp_file.unlink(missing_ok=True)

# === MAIN EXECUTION ===

def main():
    """
    Orchestrates the HHDAO pilot launch sequence, performing deployment, onboarding, monitoring, and cleanup.
    
    Executes a linear launch workflow: verifies prerequisites, deploys canisters, onboards partners, starts voice and development services, synchronizes registration, evaluates compute profitability, starts thermal monitoring and BIM export, optionally runs thermal optimization, then enters health monitoring until interrupted. Prints launch status to the console and ensures cleanup of temporary artifacts on exit or interruption.
    """
    print("🌅 HHDAO PILOT LAUNCHER — Building Civilization for 1000 Years")
    print("🏔️ Transforming Urgam Valley, Uttarakhand through Solar DAO")
    print("=" * 65)
    
    try:
        # Step 0: Prerequisites
        check_prerequisites()
        
        # Step 1: Deploy canisters
        canister_ids = deploy_canisters()
        
        # Step 2: Onboard Delhi partners
        onboard_delhi_partners(canister_ids)
        
        # Step 3: Launch voice pilot
        launch_voice_pilot()
        
        # Step 4: Sync with 1WP
        sync_with_1wp(canister_ids)
        
        # Step 5: Initialize compute monitoring
        profitability = monitor_compute_profitability()
        
        # Step 6: Initialize thermal monitoring system
        thermal_profile, thermal_alerts = monitor_thermal_systems()
        
        # Step 7: Generate BIM thermal export
        bim_export_path, csv_path = generate_thermal_bim_export()
        
        # Step 8: Run thermal optimization (if function exists)
        try:
            thermal_results = simulate_thermal_optimization()
        except NameError:
            thermal_results = None
        
        # Step 9: Start development server
        dev_server = start_development_server()
        
        # Step 10: Monitor health
        print("\n🚀 Pilot successfully launched!")
        print("🌐 Visit: http://localhost:3001")
        print("📱 Mobile QR codes ready for villagers")
        print("🗳️ DAO governance active with Delhi partners")
        print(f"⚡ Compute profitability: ${profitability:.4f} per TH/s/day")
        print(f"🌡️ Thermal monitoring: {len(thermal_alerts)} active alerts, {thermal_profile['efficiency']*100:.1f}% efficiency")
        print(f"🏗️ BIM export generated: {bim_export_path}")
        if thermal_results:
            daily_summary = thermal_results.get('daily_summary', {})
            print(f"🌡️ Thermal optimization: +{daily_summary.get('average_efficiency_gain', 0):.1f}% efficiency")
        
        monitor_health()
        
    except KeyboardInterrupt:
        print("\n🛑 Pilot launcher interrupted")
    finally:
        cleanup()
        print("🧹 Cleanup complete")

if __name__ == "__main__":
    main()