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
from pathlib import Path
from datetime import datetime

# === CONFIGURATION ===
PROJECT_ROOT = Path(__file__).parent.resolve()
DFX_NETWORK = os.getenv("DFX_NETWORK", "local")  # or "ic"
URGAM_COORDS = {"lat": 30.1652, "lng": 78.8487}  # Uttarakhand
DELHI_PARTNERS = [
    {"name": "Delhi Solar Coop", "role": "LandSteward", "document_id": "DELHI_SOLAR_001"},
    {"name": "Uttarakhand Gram Panchayat", "role": "CommunityValidator", "document_id": "GRAM_PANCH_URGAM"},
    {"name": "One World Project India", "role": "TechSteward", "document_id": "1WP_INDIA_001"}
]

# === CORE FUNCTIONS ===

def run_cmd(cmd: str, cwd=None, check=True):
    """Run shell command with error handling."""
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
    """Register HHDAO as official India node of UrgamU Smart City."""
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

def start_development_server():
    """Start the Next.js development server."""
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
        
        # Step 5: Start development server
        dev_server = start_development_server()
        
        # Step 6: Monitor health
        print("\n🚀 Pilot successfully launched!")
        print("🌐 Visit: http://localhost:3001")
        print("📱 Mobile QR codes ready for villagers")
        print("🗳️ DAO governance active with Delhi partners")
        
        monitor_health()
        
    except KeyboardInterrupt:
        print("\n🛑 Pilot launcher interrupted")
    finally:
        cleanup()
        print("🧹 Cleanup complete")

if __name__ == "__main__":
    main()