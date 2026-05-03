# Airo° Kelvo - Technical Architecture

## 🏗️ System Overview

**Platform:** ESP32-S3 microcontroller  
**Display:** 320×480 ILI9488 TFT LCD (RGB666, vertical orientation)  
**UI Framework:** React 19 + Tailwind CSS v4  
**Router:** React Router v7  
**Build Tool:** Vite  
**Language:** TypeScript/TSX

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   ESP32-S3 Hardware                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  ILI9488 LCD │  │  Touch Panel │  │   WiFi    │ │
│  │  320×480 RGB │  │   Resistive  │  │  Module   │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │
└─────────┼──────────────────┼────────────────┼───────┘
          │                  │                │
┌─────────┼──────────────────┼────────────────┼───────┐
│         │                  │                │       │
│  ┌──────▼──────┐    ┌──────▼──────┐  ┌──────▼─────┐│
│  │   Display   │    │    Touch    │  │  Network   ││
│  │   Driver    │    │   Driver    │  │   Stack    ││
│  └──────┬──────┘    └──────┬──────┘  └──────┬─────┘│
│         │                  │                │       │
│         └──────────────────┼────────────────┘       │
│                            │                        │
│                    ┌───────▼────────┐               │
│                    │  Browser Engine│               │
│                    │  (WebView/Wasm)│               │
│                    └───────┬────────┘               │
│                            │                        │
└────────────────────────────┼────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   React App     │
                    │   (Vite Build)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐       ┌──────▼──────┐      ┌─────▼──────┐
   │ Router   │       │ Components  │      │   i18n     │
   │ (Routes) │       │ (UI Layer)  │      │ (9 langs)  │
   └──────────┘       └─────────────┘      └────────────┘
```

---

## 🎨 Frontend Architecture

### Layer Structure

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (Screens)        │
│  - 15 screen components                     │
│  - Route-based navigation                   │
│  - User interaction handlers                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       Component Layer (Shared UI)           │
│  - SectionLabel                             │
│  - Reusable controls (sliders, buttons)     │
│  - Layout components                        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Style Layer (Tailwind)              │
│  - theme.css (design tokens)                │
│  - fonts.css (typography)                   │
│  - Utility classes                          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       Internationalization Layer            │
│  - airo_tr() function                       │
│  - 9 language files                         │
│  - Dynamic language switching               │
└─────────────────────────────────────────────┘
```

---

## 🗂️ Directory Structure

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root component
│   │   ├── RootLayout.tsx       # Common layout wrapper
│   │   ├── routes.tsx           # Route definitions
│   │   ├── screens/             # 15 screen components
│   │   │   ├── BootScreen.tsx
│   │   │   ├── Home2.tsx        # Main dashboard
│   │   │   ├── Password.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Schedule.tsx
│   │   │   └── ...
│   │   └── components/          # Shared components
│   │       ├── SectionLabel.tsx
│   │       ├── ui-kit/          # Component showcase
│   │       └── ...
│   ├── i18n/
│   │   ├── index.ts             # Translation system
│   │   └── languages/           # 9 language files
│   ├── styles/
│   │   ├── theme.css            # Design tokens
│   │   ├── fonts.css            # Typography
│   │   └── index.css            # Global styles
│   └── main.tsx                 # App entry point
├── docs/                        # Documentation
│   ├── SCREENS_AND_FLOWS.md
│   ├── QUICK_REFERENCE.md
│   ├── FLOW_DIAGRAM.md
│   └── ARCHITECTURE.md (this file)
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
└── vite.config.ts               # Build config
```

---

## 🛣️ Routing System

### Implementation: React Router v7

```tsx
// /src/app/routes.tsx
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: "/", Component: BootScreen },
      { path: "/home", Component: Home },
      { path: "/settings", Component: Settings },
      // ... 12 more routes
    ],
  },
]);

// /src/app/App.tsx
import { RouterProvider } from 'react-router';

export default function App() {
  return <RouterProvider router={router} />;
}
```

### Navigation Patterns

```tsx
// Component-level navigation
import { useNavigate } from 'react-router';

function MyComponent() {
  const navigate = useNavigate();
  
  const goHome = () => navigate('/home');
  const goBack = () => navigate(-1);
  const withState = () => navigate('/schedule/entry', {
    state: { mode: 'edit', id: 123 }
  });
}
```

---

## 🌐 Internationalization System

### Core Function: `airo_tr(key: string)`

```tsx
// /src/i18n/index.ts
export function airo_tr(key: string): string {
  // Loads from current language file
  // Returns translated string or key if missing
}

// Usage in components
import { airo_tr } from '../i18n';

export function Home() {
  return (
    <div>
      <h1>{airo_tr("home.title")}</h1>
      <p>{airo_tr("home.temperature")}</p>
    </div>
  );
}
```

### Supported Languages (9)

1. 🇬🇧 English (en)
2. 🇹🇷 Turkish (tr)
3. 🇩🇪 German (de)
4. 🇫🇷 French (fr)
5. 🇪🇸 Spanish (es)
6. 🇮🇹 Italian (it)
7. 🇷🇺 Russian (ru)
8. 🇨🇳 Chinese (zh)
9. 🇯🇵 Japanese (ja)

---

## 🎨 Design System

### Tailwind v4 Configuration

```css
/* /src/styles/theme.css */
@theme {
  --app-action: #60a5fa;        /* Primary action color */
  --app-action-hover: #4a94f0;  /* Light mode adjust */
  --app-panel: #f5f5f5;         /* Panel background */
  /* ... more tokens */
}
```

### Component Patterns

```tsx
// Standard header (50px)
<div className="h-[50px] flex items-center justify-between px-4">
  <h1>{airo_tr("title")}</h1>
</div>

// Section label
<SectionLabel>{airo_tr("section.title")}</SectionLabel>

// Panel card
<div className="bg-app-panel rounded-2xl p-3 space-y-3">
  {/* content */}
</div>

// Content spacing
<div className="space-y-5">
  {/* sections with 1.25rem gap */}
</div>
```

### Design Constraints (320×480)

| Element | Size | Reason |
|---------|------|--------|
| Header | 50px | Standard across all screens |
| Content Area | 430px | 480 - 50 header |
| Touch Target | ≥44×44px | Finger-friendly on 3.5" |
| Font Size | Large | TFT readability |
| Panel Padding | 12px (p-3) | Comfortable spacing |
| Border Radius | 16px (rounded-2xl) | Soft neomorphic |
| Content Gap | 20px (space-y-5) | Visual breathing room |

---

## 🔧 Build System

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      // Optimizations for ESP32-S3
    }
  }
});
```

### Build Output

```bash
# Development
npm run dev       # Start dev server

# Production
npm run build     # Creates optimized bundle
# Output: /dist/ → Deploy to ESP32-S3
```

---

## 🔐 State Management

### Current Approach: React Hooks

```tsx
// Local state (per screen)
const [temperature, setTemperature] = useState(22);

// Shared state (via Context/Props)
// TODO: Implement global state for:
// - Current climate mode
// - User preferences
// - Connection status
```

### Future: Consider Context API

```tsx
// Climate control state
export const ClimateContext = createContext();

// User preferences
export const PreferencesContext = createContext();
```

---

## 📡 Data Flow (Planned)

```
┌──────────────┐
│  UI Screen   │ ◄── User Input
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  React State │ ◄── Local state updates
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  API Layer   │ ◄── Send to VRF controller
└──────┬───────┘        (MODBUS/Serial)
       │
       ▼
┌──────────────┐
│ ESP32 Bridge │ ◄── Hardware control
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ VRF Hardware │ ◄── Physical climate control
└──────────────┘
```

---

## 🚀 Performance Considerations

### Display Rendering (ILI9488)

- **Resolution:** 320×480 (153,600 pixels)
- **Color Depth:** RGB666 (18-bit, 262K colors)
- **Refresh Target:** 30-60 FPS
- **Optimization:** Use CSS transforms for smooth animations

### Memory Management (ESP32-S3)

- **RAM:** Limited (~512KB available)
- **Strategy:** Lazy load screens, minimize bundle size
- **Caching:** Route-based code splitting

### Touch Response

- **Latency Target:** <100ms
- **Debouncing:** Prevent double-tap
- **Visual Feedback:** Immediate state change

---

## 🔄 Migration History

### Phase 1: LVGL → React (COMPLETE)
- ✅ Removed all C/C++ LVGL v9.x code
- ✅ Migrated to React + Tailwind
- ✅ Established routing system
- ✅ Implemented i18n (9 languages)

### Phase 2: Design System (IN PROGRESS)
- ✅ Created "Glass Ambient" design
- ✅ Standardized header (50px)
- ✅ Unified SectionLabel component
- ⏳ Migrate remaining 14 screens
- ⏳ Create shared component library

### Phase 3: Hardware Integration (PLANNED)
- ⏳ ESP32-S3 firmware
- ⏳ Display driver (ILI9488)
- ⏳ Touch input handling
- ⏳ VRF controller API

---

## 🧩 Component Hierarchy

```
App (RouterProvider)
├── RootLayout (common wrapper)
│   ├── BootScreen
│   ├── Home (Glass Ambient design)
│   │   ├── Header (50px)
│   │   ├── Temperature Display (large)
│   │   ├── Mode Selector
│   │   ├── Quick Actions
│   │   └── Status Cards
│   ├── Password
│   │   ├── Header
│   │   ├── PIN Input
│   │   └── Numpad
│   ├── Settings
│   │   ├── Header
│   │   ├── Menu Items
│   │   └── Navigation Links
│   ├── Schedule
│   │   ├── Header
│   │   ├── Weekly Grid
│   │   └── Entry List
│   └── ... (11 more screens)
└── Shared Components
    ├── SectionLabel
    ├── Buttons
    ├── Sliders
    └── Icons
```

---

## 📝 Code Standards

### TypeScript

```tsx
// ✅ Strict typing
interface HomeProps {
  temperature: number;
  mode: 'cool' | 'heat' | 'fan' | 'auto';
}

// ✅ Function components
export function Home({ temperature, mode }: HomeProps) {
  return <div>...</div>;
}
```

### Tailwind Classes

```tsx
// ✅ Use design tokens
className="text-app-action"

// ✅ Semantic grouping
className="flex items-center justify-between h-[50px] px-4"

// ❌ Avoid arbitrary values (unless necessary)
className="w-[237px]" // Use design system
```

### Internationalization

```tsx
// ✅ Always use airo_tr()
{airo_tr("home.title")}

// ❌ Never hardcode
"Climate Control"
```

---

## 🔧 Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| pnpm | 9+ | Package manager |
| TypeScript | 5+ | Type safety |
| Vite | 6+ | Build tool |
| React | 19 | UI framework |
| Tailwind | 4 | Styling |
| React Router | 7 | Navigation |

---

## 📊 Project Metrics

| Metric | Count |
|--------|-------|
| Total Screens | 15 |
| Total Routes | 15 |
| Supported Languages | 9 |
| Design Tokens | ~30 |
| Shared Components | ~10 |
| Lines of Code | ~5,000 |
| Bundle Size (est.) | <500KB |

---

## 🎯 Next Steps

### Immediate (Sprint 1)
1. Complete Home screen Glass Ambient design
2. Migrate Password screen
3. Migrate Settings screen
4. Create shared component library

### Short-term (Sprint 2-3)
1. Migrate all 15 screens to Glass Ambient
2. Implement global state management
3. Add touch gesture support
4. Optimize for ESP32-S3 performance

### Long-term (Q2-Q3 2026)
1. ESP32-S3 hardware integration
2. VRF controller API implementation
3. Mobile app pairing
4. OTA firmware updates

---

**Last Updated:** 2026-05-03  
**Version:** 1.0.0  
**Status:** Active Development
