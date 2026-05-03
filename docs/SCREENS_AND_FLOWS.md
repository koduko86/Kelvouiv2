# Airo° Kelvo - Screens & Navigation Flows

**Project:** ESP32-S3 VRF Klima Kontrol Cihazı  
**Display:** 320×480 ILI9488 TFT LCD (RGB666)  
**Framework:** React + Tailwind CSS (LVGL removed)  
**Design:** Premium Neomorphic (Nest/Tesla inspired)

---

## 📊 Overview

**Total Screens:** 15  
**Active Routes:** 15  
**Main Flows:** 6

---

## 🗺️ Navigation Structure

### 1️⃣ **System Flow** (3 screens)
Boot sequence and idle states.

| Screen | Route | Description |
|--------|-------|-------------|
| **BootScreen** | `/` | System startup, logo animation, initialization |
| **ScreenSaver** | `/screensaver` | Idle state with ambient display |
| **DevPanel** | `/dev` | Developer debug panel |

---

### 2️⃣ **Authentication Flow** (2 screens)
User access control.

| Screen | Route | Description |
|--------|-------|-------------|
| **Password** | `/password` | Main authentication screen |
| **ChangePassword** | `/change-password` | Password modification |

---

### 3️⃣ **Main Control Flow** (2 screens)
Primary user interface.

| Screen | Route | Description |
|--------|-------|-------------|
| **Home** | `/home` | Main climate control dashboard (Glass Ambient design) |
| **Weather** | `/weather` | Weather information display |

**Current Design:** Home screen uses "Glass Ambient" concept with neomorphic cards, 50px header standard, `SectionLabel` components, and `bg-app-panel rounded-2xl p-3` panel styling.

---

### 4️⃣ **Settings Flow** (3 screens)
Device configuration.

| Screen | Route | Description |
|--------|-------|-------------|
| **Settings** | `/settings` | Main settings menu |
| **Parameters** | `/parameters` | Advanced climate parameters |
| **WiFiSetup** | `/wifi` | WiFi network configuration |

---

### 5️⃣ **Schedule Flow** (2 screens)
Time-based automation.

| Screen | Route | Description |
|--------|-------|-------------|
| **Schedule** | `/schedule` | Weekly schedule overview |
| **ScheduleEntry** | `/schedule/entry` | Create/edit schedule entry |

---

### 6️⃣ **Setup & Admin Flow** (3 screens)
Initial setup and maintenance.

| Screen | Route | Description |
|--------|-------|-------------|
| **MobilePairing** | `/pairing` | Mobile app pairing via QR code |
| **FirmwareUpload** | `/firmware` | OTA firmware update |
| **UIKit** | `/ui-kit` | Component showcase (dev only) |

---

## 🎨 Design Standards (320×480)

### Layout Constraints
- **Header Height:** 50px (standardized)
- **Content Area:** 430px (480 - 50 header)
- **Safe Touch Target:** Minimum 44×44px
- **Font Sizing:** Large enough for 3.5" TFT readability
- **Spacing:** `space-y-5` content standard

### Component Standards
```tsx
// Section headers
<SectionLabel>{airo_tr("key")}</SectionLabel>

// Panel cards
<div className="bg-app-panel rounded-2xl p-3">
  {/* content */}
</div>

// Content spacing
<div className="space-y-5">
  {/* sections */}
</div>
```

### Theme Tokens
- **Action Color:** `--app-action` (#60a5fa light → #4a94f0 adjust)
- **Panel Background:** `bg-app-panel`
- **Glass Effects:** Neomorphic shadows + backdrop blur

---

## 🌐 Internationalization

**Supported Languages:** 9  
**Function:** `airo_tr(key: string)`  
**Rule:** ❌ NO hardcoded strings allowed

```tsx
// ✅ Correct
<h1>{airo_tr("home.title")}</h1>

// ❌ Wrong
<h1>Climate Control</h1>
```

---

## 🔄 Navigation Flow Diagram

```
[BootScreen] ──────────────┐
       │                   │
       ▼                   │
[Password] ───────────────►[Home] ◄─────────┐
                            │               │
                ┌───────────┼───────────┐   │
                ▼           ▼           ▼   │
          [Settings]   [Schedule]   [Weather]
                │           │
       ┌────────┼───┐       ├─► [ScheduleEntry]
       ▼        ▼   ▼
  [Parameters] [WiFi] [ChangePassword]
       
  [MobilePairing] ─── Setup Flow
  [FirmwareUpload] ─── Admin Flow
  [ScreenSaver] ──── Idle State
  [DevPanel] ─────── Debug Only
  [UIKit] ────────── Dev Showcase
```

---

## 📁 File Structure

```
/src/app/screens/
├── BootScreen.tsx          # System boot
├── ScreenSaver.tsx         # Idle display
├── Password.tsx            # Auth
├── ChangePassword.tsx      # Auth
├── Home2.tsx               # Main control (exported as Home)
├── Weather.tsx             # Weather info
├── Settings.tsx            # Settings menu
├── Parameters.tsx          # Climate params
├── WiFiSetup.tsx           # WiFi config
├── Schedule.tsx            # Schedule list
├── ScheduleEntry.tsx       # Schedule editor
├── MobilePairing.tsx       # QR pairing
├── FirmwareUpload.tsx      # OTA update
├── DevPanel.tsx            # Debug tools
└── (UIKit in components/)
```

---

## 🚀 Navigation Implementation

**Router:** `react-router` v7  
**Route Definition:** `/src/app/routes.tsx`  
**Layout:** `RootLayout` wrapper for all routes

```tsx
// Programmatic navigation example
import { useNavigate } from 'react-router';

const navigate = useNavigate();
navigate('/home');
navigate('/settings');
navigate('/schedule/entry', { state: { mode: 'create' } });
```

---

## 📝 Notes

1. **LVGL Removed:** All C/C++ LVGL v9.x code removed, pure React now
2. **Home Screen:** `Home2.tsx` exports as `Home` component
3. **Shared Components:** `SectionLabel` unified (was 4 duplicates)
4. **Code Cleanup:** 8 obsolete files deleted, all audited
5. **Mobile Connection:** Icon sizing/alignment fixed in header

---

## 🔧 Development Tips

### Adding a New Screen
1. Create `/src/app/screens/NewScreen.tsx`
2. Add route in `/src/app/routes.tsx`
3. Use standard 50px header height
4. Apply `SectionLabel` + `bg-app-panel` patterns
5. All text via `airo_tr()`
6. Test on 320×480 viewport

### Testing Flows
```bash
# Development server (already running)
# Navigate to: /<route-name>

# Examples:
http://localhost:5173/
http://localhost:5173/home
http://localhost:5173/settings
```

---

**Last Updated:** 2026-05-03  
**Design Status:** Home screen Glass Ambient complete, other screens legacy design  
**Next Steps:** Migrate remaining screens to new design system
