# 🚀 HeliosHash DAO - Android Commands Cheatsheet

## Quick Setup (Run Once)

```bash
# Navigate to project
cd ~/HeliosHash-DAO/helios#baghpat-dao-village-dashboard

# Make setup script executable
chmod +x setup-android.sh

# Run setup
./setup-android.sh
```

---

## Essential Commands

### 🏗️ Build & Sync
```bash
# Build web app and sync to Android
npm run android:sync

# Just build web app
npm run build

# Just sync (without rebuilding web)
npx cap sync android
```

### 📱 Open & Run
```bash
# Open in Android Studio
npm run android:open

# Build, sync, and run on device/emulator
npm run android:run

# Run without rebuilding (faster)
npx cap run android
```

### 📦 Build APK
```bash
# Debug APK (development)
npm run android:sync
cd android
./gradlew assembleDebug
cd ..

# Release APK (production)
npm run android:build

# Or manually:
cd android
./gradlew assembleRelease
cd ..
```

---

## APK Locations

```bash
# Debug APK
./android/app/build/outputs/apk/debug/app-debug.apk

# Release APK
./android/app/build/outputs/apk/release/app-release.apk
```

---

## Install on Device

### Via ADB (USB)
```bash
# Check connected devices
adb devices

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Install release APK
adb install android/app/build/outputs/apk/release/app-release.apk

# Force reinstall (if already installed)
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Via File Transfer
```bash
# Copy APK to Downloads
cp android/app/build/outputs/apk/debug/app-debug.apk ~/Downloads/

# Transfer to phone and install manually
```

---

## Development with Live Reload

### Step 1: Find Your IP
```bash
# Linux/Mac
ip addr show | grep inet
# or
hostname -I

# Windows (PowerShell)
ipconfig
```

### Step 2: Update Config
Edit `capacitor.config.ts`:
```typescript
server: {
  url: 'http://YOUR_IP:5173',  // Replace YOUR_IP
  cleartext: true
}
```

### Step 3: Start Dev Server
```bash
# Terminal 1: Start Vite
npm run dev

# Terminal 2: Sync and open
npm run android:sync
npm run android:open
```

Now changes reflect instantly on your phone! 🔥

---

## Debugging

### View Logs (Logcat)
```bash
# In Android Studio: View > Tool Windows > Logcat

# Or via ADB
adb logcat | grep -i "chromium\|console"
```

### Clear App Data
```bash
adb shell pm clear com.helioshash.dao
```

### Uninstall App
```bash
adb uninstall com.helioshash.dao
```

---

## Troubleshooting

### Problem: White Screen
```bash
# Solution: Rebuild and sync
npm run build
npx cap sync android
```

### Problem: Gradle Build Failed
```bash
# Solution: Clean Gradle cache
cd android
./gradlew clean
cd ..
npm run android:sync
```

### Problem: SDK Not Found
```bash
# Solution: Set environment variables
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

# Add to ~/.bashrc or ~/.zshrc for permanent fix
```

### Problem: Device Not Detected
```bash
# Check USB debugging is enabled on phone
adb devices

# Restart ADB server
adb kill-server
adb start-server
```

### Problem: Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## File Structure

```
helios#baghpat-dao-village-dashboard/
├── android/                    # ← Native Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── res/           # Icons & resources
│   │   │   └── java/          # MainActivity
│   │   └── build.gradle
│   ├── gradle/
│   └── build.gradle
├── components/
│   ├── CommunityHub.tsx       # ← Updated for mobile
│   ├── LiveDataView.tsx
│   └── LoginScreen.tsx        # ← Updated for mobile
├── dist/                      # ← Web build output (synced to Android)
├── resources/                 # ← App icons & splash
├── capacitor.config.ts        # ← Main config
├── App.tsx                    # ← Updated for mobile
├── package.json
└── setup-android.sh           # ← Setup script
```

---

## Updating Components

After modifying any `.tsx` files:

```bash
# Method 1: Full rebuild
npm run android:sync

# Method 2: With live reload (faster)
# Just save the file - it auto-reloads!
```

---

## Publishing to Google Play

### 1. Generate Signed APK
```bash
cd android
./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

### 2. Create Keystore (first time)
```bash
keytool -genkey -v -keystore hhdao-release.keystore \
  -alias hhdao -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Sign APK
Update `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('hhdao-release.keystore')
        storePassword 'YOUR_PASSWORD'
        keyAlias 'hhdao'
        keyPassword 'YOUR_PASSWORD'
    }
}
```

### 4. Upload to Play Console
- Go to [Google Play Console](https://play.google.com/console)
- Create new app
- Upload `app-release.aab`
- Fill in store listing
- Submit for review

---

## Useful Aliases (Add to ~/.bashrc)

```bash
# Android shortcuts
alias android-sync='npm run android:sync'
alias android-open='npm run android:open'
alias android-run='npm run android:run'
alias android-build='npm run android:build'
alias android-log='adb logcat | grep -i chromium'
alias android-devices='adb devices'
alias android-install='adb install android/app/build/outputs/apk/debug/app-debug.apk'
```

Reload with: `source ~/.bashrc`

---

## Performance Optimization

### Reduce APK Size
```bash
# Enable ProGuard/R8 in build.gradle
minifyEnabled true
shrinkResources true
```

### Check APK Size
```bash
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

### Analyze Bundle
```bash
cd android
./gradlew app:bundleReleaseResources
```

---

## Links

- 📚 [Capacitor Docs](https://capacitorjs.com/docs)
- 🤖 [Android Studio](https://developer.android.com/studio)
- 📱 [ICP Mobile SDK](https://github.com/dfinity/agent-js)
- 🏪 [Google Play Console](https://play.google.com/console)
