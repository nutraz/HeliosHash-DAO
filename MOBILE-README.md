# 📱 HeliosHash DAO Mobile App

## 🚀 Quick Start

```bash
# Start development server + open mobile app
pnpm run dev:mobile

# Or manually:
pnpm dev
# Then visit: http://localhost:3000/mobile
```

## 📲 Access Options

### 1. **React Mobile App** (Full Features)
```
http://localhost:3000/mobile
```
- Complete React implementation
- Real-time data updates
- Swipe navigation
- Touch interactions
- Canister integration ready

### 2. **Standalone Demo** (No Dependencies)
```
open mobile-demo.html
```
- Pure HTML/CSS/JavaScript
- No build process required
- Perfect for quick demos
- Works offline

## 🎯 Features

### 🏠 **Home Dashboard**
- ⚡ Real-time energy generation (847.3 kWh)
- 🌍 Carbon savings tracking (234.7kg CO₂)
- 💰 Earnings display ($156.82)
- 📊 Daily progress bars (84.7% goal)
- 🎯 Quick action buttons
- 📱 Recent activity feed

### ⚡ **Mining Center**
- 🔄 Start/Stop mining controls
- 📊 Real-time metrics dashboard
- 🌡️ Temperature monitoring (42°C)
- ⚡ Hash rate display (245.7 MH/s)
- 📈 24-hour energy chart
- 🔧 Device status monitoring

### 👥 **Community Hub**
- 📰 Social activity feed
- 🗳️ DAO proposal voting
- 🏆 Energy generation leaderboard
- 👥 12.8K community members
- 💬 Like/comment system
- 📊 Community statistics

### 🎁 **Rewards Center**
- 🌟 Level 8 progression (15,847 points)
- 🏆 Achievement system (23 unlocked)
- 🛒 Reward marketplace
- 📋 Daily task tracking
- 🎨 Cosmetic upgrades
- ⚡ Performance boosters

### 💰 **Solar Wallet**
- 💎 Portfolio overview ($4,521.80)
- 🌞 HHDAO tokens (2,847.5)
- 🔷 ICP balance (15.23)
- 📋 Transaction history
- 🖼️ NFT collection (3 owned)
- 🔒 Staking interface (12.5% APY)

## 🎨 Design System

### **Colors**
- **Primary**: Solar Orange (#ff8c00)
- **Background**: Deep Space (#010409, #0D1117)
- **Success**: Green Energy (#27ae60)
- **Text**: GitHub Dark (#c9d1d9, #8b949e)

### **Components**
- **Phone Container**: 375x812px (iPhone 13)
- **Status Bar**: Live time + battery indicators
- **Bottom Navigation**: 5-tab system
- **Cards**: Rounded corners + hover effects
- **Progress Bars**: Animated with shimmer
- **Buttons**: Gradient backgrounds + haptic feedback

### **Animations**
- **Page Transitions**: Smooth slide effects
- **Swipe Navigation**: Touch-friendly gestures
- **Loading States**: Shimmer animations
- **Achievement Popups**: Slide notifications
- **Hover Effects**: Lift + glow interactions

## 🛠️ Technical Stack

### **Frontend**
- ⚛️ React 18.3.1 + TypeScript
- 🎨 Custom CSS with animations
- 📱 Mobile-first responsive design
- 👆 Touch/swipe event handling
- 🔄 Real-time data simulation

### **Backend Integration** (Ready)
```typescript
import { hhdao } from '../declarations/hhdao';
import { hhdao_dao } from '../declarations/hhdao_dao';
import { hhdao_identity } from '../declarations/hhdao_identity';
import { hhdao_telemetry } from '../declarations/hhdao_telemetry';
```

### **File Structure**
```
src/mobile/
├── MobileApp.tsx           # Main container
├── mobile.css             # Complete styling
└── pages/
    ├── HomePage.tsx       # Energy dashboard
    ├── MiningPage.tsx     # Mining controls
    ├── CommunityPage.tsx  # DAO + social
    ├── RewardsPage.tsx    # Gamification
    └── WalletPage.tsx     # Asset management
```

## 📱 Usage Examples

### Navigation
- **Swipe Left/Right**: Switch between pages
- **Tap Bottom Icons**: Direct navigation
- **Swipe Indicators**: Current page dots

### Interactions
- **Tap Cards**: Hover effects + actions
- **Achievement System**: Auto-popup notifications
- **Real-time Updates**: Live data every 3 seconds
- **Touch Feedback**: Visual response to taps

### Responsive Behavior
```css
/* Auto-adapts to screen size */
@media (max-width: 395px) {
  .phone-container {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
  }
}
```

## 🔗 Integration Guide

### 1. **Connect to Canisters**
```typescript
// In each page component
useEffect(() => {
  const fetchData = async () => {
    const projects = await hhdao.getProjects();
    const balance = await hhdao_dao.getTokenBalance(principal);
    setData({ projects, balance });
  };
  fetchData();
}, []);
```

### 2. **Add Authentication**
```typescript
import { useAuthContext } from '../hooks/useAuthContext';

const { isAuthenticated, principal } = useAuthContext();
```

### 3. **Real-time Updates**
```typescript
// Replace simulation with canister calls
const updateMetrics = async () => {
  const telemetry = await hhdao_telemetry.getLatestData();
  setEnergyGenerated(telemetry.totalEnergy);
  setCarbonSaved(telemetry.carbonOffset);
};
```

## 🎯 Next Steps

1. **Backend Integration**: Connect to Motoko canisters
2. **Authentication**: Add Internet Identity login
3. **Real Data**: Replace simulated metrics
4. **Push Notifications**: Achievement alerts
5. **Offline Support**: PWA capabilities
6. **Performance**: Optimize for mobile devices

## 🐛 Troubleshooting

### Common Issues

**Vite not found:**
```bash
pnpm install
```

**React errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules/.vite
pnpm install
```

**Mobile app not loading:**
```bash
# Check route
http://localhost:3000/mobile
```

---

🌞 **HeliosHash DAO - Solar Energy in Your Pocket!** ⚡