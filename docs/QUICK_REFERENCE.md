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

**Last Updated:** 2026-05-03
