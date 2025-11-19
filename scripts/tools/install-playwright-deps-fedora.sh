#!/bin/bash

set -e

echo "🚀 Installing Playwright system dependencies on Fedora..."

# 1. Install core system libraries (Fedora equivalents)
sudo dnf install -y \
  libicu \
  libjpeg-turbo \
  libwebp \
  libffi \
  cairo \
  fontconfig \
  freetype \
  glib2 \
  gtk3 \
  pango \
  gdk-pixbuf2 \
  libX11 \
  libXcomposite \
  libXdamage \
  libxkbcommon \
  mesa-libGL \
  mesa-libEGL \
  libnotify \
  libsecret \
  libxml2 \
  libxslt \
  opus \
  libvpx \
  openjpeg2 \
  harfbuzz \
  hyphen \
  enchant2 \
  flite \
  libepoxy \
  libevdev \
  libgudev \
  wayland-client \
  wayland-server \
  xorg-x11-server-Xvfb \
  noto-color-emoji-fonts \
  liberation-fonts \
  google-noto-sans-cjk-ttc-fonts \
  wqy-zenhei-fonts

# 2. Handle ICU version mismatch (Playwright expects libicu66, Fedora has newer)
ICU_VERSION=$(rpm -q --qf '%{VERSION}' libicu | cut -d. -f1)
echo "📦 Detected ICU version: $ICU_VERSION"

if [ "$ICU_VERSION" -gt 66 ]; then
  echo "🔗 Creating symlinks for libicu66 compatibility..."
  sudo ln -sf /usr/lib64/libicudata.so.$ICU_VERSION /usr/lib64/libicudata.so.66
  sudo ln -sf /usr/lib64/libicui18n.so.$ICU_VERSION /usr/lib64/libicui18n.so.66
  sudo ln -sf /usr/lib64/libicuuc.so.$ICU_VERSION /usr/lib64/libicuuc.so.66
  echo "✅ ICU symlinks created."
elif [ "$ICU_VERSION" -eq 66 ]; then
  echo "✅ ICU 66 already installed."
else
  echo "⚠️ ICU version < 66 — WebKit may still fail. Consider upgrading or using containerized tests."
fi

# 3. Verify critical libs exist
for lib in libicudata.so.66 libffi.so.7 libwebp.so.6; do
  if ! ldconfig -p | grep -q "$lib"; then
    echo "❌ Warning: $lib not found in linker cache."
  else
    echo "✅ $lib is available."
  fi
done

echo ""
echo "🎉 Playwright system dependencies installed!"
echo "👉 Now run: npx playwright test --project=webkit"
