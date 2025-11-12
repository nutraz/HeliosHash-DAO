#!/bin/bash
# ╔════════════════════════════════════════════════════╗
# ║   HHDAO FULL SETUP SCRIPT – Auto Sync & Rebuild    ║
# ║   Author: HeliosHash DAO Team                      ║
# ║   Updated: 2025-11-12                              ║
# ╚════════════════════════════════════════════════════╝

set -euo pipefail
IFS=$'\n\t'

# Paths
HHDAO_DIR="$HOME/HeliosHash-DAO"
MOBILE_DIR="$HHDAO_DIR/apps/mobile"
WEB_DIR="$HHDAO_DIR/urgamu-project-dashboard"
SCRIPTS_DIR="$HHDAO_DIR/scripts"
LOG_FILE="$HHDAO_DIR/hhdao-setup.log"

# Colors
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
RED='\033[1;31m'
RESET='\033[0m'
BLUE='\033[1;34m'

log() {
  echo -e "${CYAN}[$(date '+%H:%M:%S')]${RESET} $1" | tee -a "$LOG_FILE"
}

success() {
  echo -e "${GREEN}✔ $1${RESET}" | tee -a "$LOG_FILE"
}

warn() {
  echo -e "${YELLOW}⚠ $1${RESET}" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}✖ $1${RESET}" | tee -a "$LOG_FILE"
}

info() {
  echo -e "${BLUE}ℹ $1${RESET}" | tee -a "$LOG_FILE"
}

log "🚀 Starting full HHDAO environment sync & setup..."

#──────────────────────────────────────────────
# Step 1: Git Pull & Flatten nested repos
#──────────────────────────────────────────────
if [ -d "$HHDAO_DIR" ]; then
  cd "$HHDAO_DIR"
  info "Working directory: $(pwd)"
  log "📂 Pulling latest changes from GitHub..."

  git fetch origin main --quiet || warn "Could not fetch remote, using local only."
  
  NESTED_REPOS=$(find apps -type d -name ".git" 2>/dev/null || true)
  if [ -n "$NESTED_REPOS" ]; then
    warn "Flattening nested Git repositories..."
    for repo in $NESTED_REPOS; do
      rm -rf "$repo"
    done
    git add -A
    git commit -m "Flatten nested git repositories" || true
  fi

  git pull origin main --rebase --autostash || warn "Rebase failed, continuing with local state."
else
  error "HHDAO directory not found at $HHDAO_DIR"
  info "To clone fresh:"
  info "  git clone https://github.com/nutraz/HeliosHash-DAO.git $HHDAO_DIR"
  info "  cd $HHDAO_DIR && bash hhdao-full-setup.sh"
  exit 1
fi

#──────────────────────────────────────────────
# Step 2: Commit any local dashboard/build changes
#──────────────────────────────────────────────
if ! git diff-index --quiet HEAD --; then
  git add -A
  git commit -m "Auto-sync: local build/dashboard changes $(date '+%Y-%m-%d %H:%M')" || true
  git push origin main || warn "Push skipped or failed"
fi

#──────────────────────────────────────────────
# Step 3: System & language updates
#──────────────────────────────────────────────
log "🛠 Updating system & dependencies..."
sudo dnf upgrade -y || warn "System upgrade skipped"

flatpak update -y || true

log "🐍 Python environment..."
python3 -m ensurepip --upgrade || true
python3 -m pip install --upgrade pip setuptools wheel
[ -f "$HHDAO_DIR/requirements.txt" ] && pip install -r "$HHDAO_DIR/requirements.txt" || true

log "🟢 Node.js environment..."
npm install -g npm@latest || warn "npm upgrade failed"
[ -f "$HHDAO_DIR/package-lock.json" ] && npm ci || npm install

log "📦 PNPM setup..."
npm install -g pnpm || warn "pnpm install failed"

log "🦀 Rust toolchain..."
rustup update stable || true

log "🟣 Flutter/Dart environment..."
flutter upgrade || warn "Flutter update skipped"

#──────────────────────────────────────────────
# Step 4: Android SDK / emulators
#──────────────────────────────────────────────
if [ -d "$HOME/Android/Sdk" ]; then
  log "🤖 Updating Android SDK..."
  yes | sdkmanager --update || warn "SDK update failed"
else
  warn "Android SDK not found, skipping."
fi

#──────────────────────────────────────────────
# Step 5: Clean up caches and old builds
#──────────────────────────────────────────────
log "🧹 Cleaning up caches..."
rm -rf ~/.cache/* ~/.local/share/Trash/* || true
flatpak uninstall --unused -y || true
flutter clean || true
cargo clean || true
npm cache verify || true

#──────────────────────────────────────────────
# Step 6: Build Flutter Mobile App
#──────────────────────────────────────────────
if [ -d "$MOBILE_DIR" ]; then
  # Check if Flutter is available
  if ! command -v flutter >/dev/null 2>&1; then
    warn "Flutter not found in PATH, skipping mobile build."
    info "Install Flutter: https://flutter.dev/docs/get-started/install"
    info "Or run: curl -O https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.22.0-stable.tar.xz"
    info "Then extract to ~/ and add to PATH"
    cd "$HHDAO_DIR"
  else
    log "📱 Building Flutter mobile APK..."
    cd "$MOBILE_DIR"
    flutter pub get
    flutter build apk --release --no-tree-shake-icons || warn "Mobile build failed."
  fi
else
  warn "Mobile app directory not found: $MOBILE_DIR"
fi

#──────────────────────────────────────────────
# Step 7: Build Web Dashboard
#──────────────────────────────────────────────
if [ -d "$WEB_DIR" ]; then
  # Check if Flutter is available
  if ! command -v flutter >/dev/null 2>&1; then
    warn "Flutter not found in PATH, skipping web build."
    info "Install Flutter: https://flutter.dev/docs/get-started/install"
    cd "$HHDAO_DIR"
  else
    log "🌐 Building Flutter web project..."
    cd "$WEB_DIR"
    flutter pub get
    flutter build web --release || warn "Web build failed."
  fi
else
  warn "Web dashboard not found: $WEB_DIR"
fi

#──────────────────────────────────────────────
# Step 8: Start HHDAO local dev environment
#──────────────────────────────────────────────
if [ -f "$SCRIPTS_DIR/setup-pm2.sh" ]; then
  log "⚡ Setting up PM2 dev server..."
  bash "$SCRIPTS_DIR/setup-pm2.sh"
elif [ -f "$HHDAO_DIR/start-hhdao-dev.sh" ]; then
  log "🧩 Launching HHDAO dev environment..."
  bash "$HHDAO_DIR/start-hhdao-dev.sh"
  success "PM2 dev server started on http://localhost:3002"
else
  warn "start-hhdao-dev.sh not found, skipping auto-start."
fi

#──────────────────────────────────────────────
# Step 9: Final System Health Report
#──────────────────────────────────────────────
log "📊 System health summary:"

info "Memory usage:"
free -h | head -2 | tee -a "$LOG_FILE"

info "Disk space:"
df -h | grep -E '^Filesystem|/dev/' | tee -a "$LOG_FILE"

info "PM2 status:"
command -v pm2 >/dev/null 2>&1 && pm2 status --no-color || warn "PM2 not running"

success "✅ HHDAO full sync & setup completed successfully!"
info "📋 Log saved to: $LOG_FILE"

