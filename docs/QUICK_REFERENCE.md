# Airo° Kelvo - Quick Reference

## 🎯 Key Numbers
- **15 screens** total
- **6 main flows**
- **9 languages** (i18n)
- **320×480** display
- **50px** header standard
- **430px** content area

## 🗂️ Flow Categories

| Flow | Screens | Routes |
|------|---------|--------|
| **System** | 3 | `/`, `/screensaver`, `/dev` |
| **Auth** | 2 | `/password`, `/change-password` |
| **Control** | 2 | `/home`, `/weather` |
| **Settings** | 3 | `/settings`, `/parameters`, `/wifi` |
| **Schedule** | 2 | `/schedule`, `/schedule/entry` |
| **Admin** | 3 | `/pairing`, `/firmware`, `/ui-kit` |

## 🎨 Design Tokens (Cheat Sheet)

```tsx
// Standard header
<div className="h-[50px]">...</div>

// Section title
<SectionLabel>{airo_tr("key")}</SectionLabel>

// Panel card
<div className="bg-app-panel rounded-2xl p-3">...</div>

// Content spacing
<div className="space-y-5">...</div>

// Action color
className="text-app-action"
// or CSS: var(--app-action)
```

### Light vs Dark Token Map

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--app-bg` | `#f5f7fa` | `#030712` | Screen base |
| `--app-panel` | `#e8ebf0` | `#111827` | Card surface |
| `--app-control` | `#e3e6ed` | `#1f2937` | Button / track surface (must differ from panel) |
| `--app-hover` | `#d5d9e2` | `#2d3748` | Hover/pressed state |
| `--app-line` | `#c4c9d4` | `#475569` | Hairline separators |
| `--app-border` | `#a8aebb` | `#64748b` | Strong borders |
| `--app-action` | `#4a94f0` | `#7dd3fc` | Primary accent (sky-300 in dark for contrast) |
| `--app-action-hover` | `#2b6fdb` | `#38bdf8` | Hover variant |
| `--app-text` | `#0f1419` | `#f9fafb` | Primary text |
| `--app-text-sub` | `#363d49` | `#d1d5db` | Secondary text |
| `--app-text-dim` | `#515b6a` | `#9ca3af` | Tertiary/disabled |
| `--app-text-hint` | `#6b7585` | `#b0b8c4` | Captions |

**Dark mode toggle:** `Settings > Display > Dark Theme`. `RootLayout` auto-applies `.dark` class to `<html>` based on `settings.darkTheme`.

### Segmented Button (canonical pattern)

```tsx
className={`py-2 px-3 rounded-lg transition-all border ${
  active
    ? 'bg-app-action/15 text-app-action border-app-action/40'
    : 'bg-app-control text-app-text-sub border-app-line'
}`}
```

Used in: temp unit, temp step, swing, AuxHeatModal — single visual language across the app.

### Navigation Row (clickable list item)

```tsx
<button className="w-full flex items-center gap-3 px-4 py-3.5
                   hover:bg-app-hover active:bg-app-hover transition-colors">
  <div className="w-8 h-8 rounded-lg bg-app-action/15 flex items-center justify-center">
    <Icon className="w-4 h-4 text-app-action" />
  </div>
  <span className="flex-1 text-left font-medium text-app-text text-sm">{label}</span>
  <ChevronRight className="w-5 h-5 text-app-action" strokeWidth={2.5} />
</button>
```

Distinguishes nav rows from static info rows (which use `text-app-text-sub` icons, no chevron).

## 🌐 i18n Usage

```tsx
import { airo_tr } from '../i18n';

// ✅ Always use translation
{airo_tr("home.temperature")}
{airo_tr("settings.wifi.title")}

// ❌ Never hardcode
"Temperature" // WRONG!
```

## 📱 Screen Sizes (3.5" TFT)

```
┌─────────────────┐ 320px
│    Header 50px  │
├─────────────────┤
│                 │
│   Content Area  │
│     430px       │
│                 │
│                 │
└─────────────────┘
      480px total
```

## 🔀 Common Navigation Patterns

```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();

// Main flows
navigate('/home');           // Dashboard
navigate('/settings');       // Settings menu
navigate('/schedule');       // Schedule list
navigate('/schedule/entry'); // New schedule

// Auth
navigate('/password');       // Lock screen
navigate('/change-password'); // Change PIN

// Setup
navigate('/wifi');           // WiFi config
navigate('/pairing');        // Mobile pairing
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/app/routes.tsx` | Route definitions |
| `src/app/screens/*` | Screen components |
| `src/app/components/SectionLabel.tsx` | Standard headers |
| `src/i18n/index.ts` | Translation system |
| `src/styles/theme.css` | Design tokens |

## 🔥 Settings > Climate > Auxiliary Heat Staging

New feature (2026-05-04). Two-stage heating control with VRF + relay output.

**Settings shape** (`ControllerContext.AuxHeatConfig`):
```ts
{
  enabled: boolean;
  heatingMode: 'single' | 'two_stage';
  stage1Source: 'vrf' | 'relay';
  stage2Source: 'vrf' | 'relay';
  stage2Trigger: 'temp_or_time' | 'temp_and_time';
  tempOffset: 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 3.0; // °C
  timeDelayMin: 5 | 10 | 15 | 30;
  minOnTimeMin: 5 | 10 | 15 | 30;       // ≥ 10 recommended
  fanDuringHeating: 'off' | 'stage1' | 'stage2' | 'both';
  fanDelayOffMin: 0 | 5 | 10 | 15;
  circulateModeFan: 'off' | 'low';
}
```

UI: toggle row in Climate tab → "Configure" button opens `AuxHeatModal` (full-screen modal). Stage 2 fields hidden when `heatingMode === 'single'`. Default exported as `DEFAULT_AUX_HEAT` from `ControllerContext`.

## 🚨 Critical Rules

1. ✅ **50px header** everywhere
2. ✅ **Always** use `airo_tr()` for text
3. ✅ Large fonts for 3.5" TFT readability
4. ✅ `SectionLabel` for section titles
5. ✅ `bg-app-panel rounded-2xl p-3` for cards
6. ❌ **NO LVGL code** (removed completely)
7. ❌ **NO hardcoded strings**

## 🎯 Current Status

| Screen | Design | i18n | Status |
|--------|--------|------|--------|
| Home | ✅ Glass Ambient | ✅ | Complete |
| BootScreen | 🔄 Legacy | ✅ | Working |
| Password | 🔄 Legacy | ✅ | Working |
| Settings | 🔄 Legacy | ✅ | Working |
| Schedule | 🔄 Legacy | ✅ | Working |
| Weather | 🔄 Legacy | ✅ | Working |
| Others | 🔄 Legacy | ✅ | Working |

**Next:** Migrate remaining screens to Glass Ambient design system.

---

**Last Updated:** 2026-05-04 — added dark mode token map, segmented button canon, Auxiliary Heat Staging.
