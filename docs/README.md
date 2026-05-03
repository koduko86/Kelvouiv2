# Airo° Kelvo - Documentation Index

**Project:** ESP32-S3 VRF Climate Control Thermostat  
**Display:** 320×480 ILI9488 TFT LCD  
**UI:** React + Tailwind CSS (Neomorphic Premium Design)

---

## 📚 Documentation Overview

This documentation package provides complete information about the Airo° Kelvo interface design, architecture, and implementation.

---

## 📖 Available Documents

### 1. **SCREENS_AND_FLOWS.md** 📱
**Start here if you need:** Complete screen inventory and flow descriptions

**Contents:**
- ✅ All 15 screens listed and categorized
- ✅ 6 main user flows explained
- ✅ Navigation patterns and routing
- ✅ Design standards and component usage
- ✅ i18n system overview
- ✅ File structure reference

**Best for:** Understanding what screens exist and how they connect

---

### 2. **QUICK_REFERENCE.md** ⚡
**Start here if you need:** Quick lookup and code snippets

**Contents:**
- ✅ Key numbers at a glance
- ✅ Flow categories table
- ✅ Design token cheat sheet
- ✅ i18n usage examples
- ✅ Common navigation patterns
- ✅ Critical rules checklist

**Best for:** Quick lookups while coding, copy-paste snippets

---

### 3. **FLOW_DIAGRAM.md** 🗺️
**Start here if you need:** Visual navigation maps

**Contents:**
- ✅ Complete user journey diagram
- ✅ Authentication flow chart
- ✅ Settings flow tree
- ✅ Schedule flow map
- ✅ Admin/setup flow
- ✅ Boot sequence diagram
- ✅ Screen priority matrix
- ✅ Design migration status

**Best for:** Understanding user journeys and screen relationships

---

### 4. **ARCHITECTURE.md** 🏗️
**Start here if you need:** Technical implementation details

**Contents:**
- ✅ System architecture diagram
- ✅ Frontend layer structure
- ✅ Directory structure breakdown
- ✅ Routing system implementation
- ✅ i18n system internals
- ✅ Design system tokens
- ✅ Build configuration
- ✅ State management patterns
- ✅ Performance considerations
- ✅ Component hierarchy
- ✅ Code standards
- ✅ Development roadmap

**Best for:** Understanding how everything works under the hood

---

## 🎯 Quick Start Guide

### New to the project?
1. Read **SCREENS_AND_FLOWS.md** (10 min) - Get the big picture
2. Skim **QUICK_REFERENCE.md** (5 min) - Bookmark for later
3. Review **FLOW_DIAGRAM.md** (5 min) - Visualize the flows
4. Deep dive **ARCHITECTURE.md** (20 min) - Understand implementation

### Need to add a new screen?
1. Check **SCREENS_AND_FLOWS.md** → "Adding a New Screen"
2. Reference **QUICK_REFERENCE.md** → Design tokens
3. Review **ARCHITECTURE.md** → Routing system
4. Follow existing patterns in `/src/app/screens/`

### Working on navigation?
1. Check **FLOW_DIAGRAM.md** → Find the relevant flow
2. Reference **ARCHITECTURE.md** → Routing system
3. Update `/src/app/routes.tsx`

### Implementing i18n?
1. Check **QUICK_REFERENCE.md** → i18n usage
2. Reference **ARCHITECTURE.md** → i18n system
3. Add keys to `/src/i18n/languages/*.ts`

### Migrating to Glass Ambient design?
1. Check **FLOW_DIAGRAM.md** → Migration priority
2. Reference **QUICK_REFERENCE.md** → Design tokens
3. Study `/src/app/screens/Home2.tsx` as example
4. Apply standard patterns (SectionLabel, panels, spacing)

---

## 📊 Project Summary

| Aspect | Details |
|--------|---------|
| **Total Screens** | 15 |
| **Main Flows** | 6 (System, Auth, Control, Settings, Schedule, Admin) |
| **Languages** | 9 (EN, TR, DE, FR, ES, IT, RU, ZH, JA) |
| **Display** | 320×480 vertical TFT |
| **Framework** | React 19 + Tailwind CSS v4 |
| **Router** | React Router v7 |
| **Design** | Glass Ambient (Neomorphic Premium) |
| **Status** | 1/15 screens migrated to new design |

---

## 🎨 Design System Quick Reference

```tsx
// Header (50px standard)
<div className="h-[50px]">...</div>

// Section title
<SectionLabel>{airo_tr("key")}</SectionLabel>

// Panel card
<div className="bg-app-panel rounded-2xl p-3">...</div>

// Content spacing
<div className="space-y-5">...</div>

// Action color
className="text-app-action"
```

---

## 🌐 Internationalization

```tsx
import { airo_tr } from '../i18n';

// ✅ Always use
{airo_tr("home.temperature")}

// ❌ Never use
"Temperature"
```

---

## 🗺️ Navigation Quick Links

| Route | Screen | Purpose |
|-------|--------|---------|
| `/` | BootScreen | System start |
| `/home` | Home | Main dashboard |
| `/password` | Password | Authentication |
| `/settings` | Settings | Configuration |
| `/schedule` | Schedule | Automation |
| `/wifi` | WiFiSetup | Network |
| `/pairing` | MobilePairing | Mobile app |
| `/dev` | DevPanel | Debug |

[See SCREENS_AND_FLOWS.md for complete list]

---

## 🚨 Critical Rules

1. ✅ **50px header** on all screens
2. ✅ **Always use `airo_tr()`** for text
3. ✅ **Large fonts** for 3.5" TFT readability
4. ✅ **`SectionLabel`** for section titles
5. ✅ **`bg-app-panel rounded-2xl p-3`** for cards
6. ❌ **NO LVGL code** (completely removed)
7. ❌ **NO hardcoded strings** (use i18n)

---

## 🔄 Project History

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Complete | LVGL → React migration |
| **Phase 2** | 🔄 In Progress | Glass Ambient design system |
| **Phase 3** | ⏳ Planned | ESP32-S3 hardware integration |

**Current Status:**
- ✅ LVGL removed (8 files deleted)
- ✅ React + Tailwind working
- ✅ i18n system (9 languages)
- ✅ Home screen Glass Ambient complete
- ⏳ 14 screens pending migration

---

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📁 Key File Locations

| File | Purpose |
|------|---------|
| `/src/app/routes.tsx` | Route definitions |
| `/src/app/screens/*` | Screen components |
| `/src/app/components/SectionLabel.tsx` | Standard headers |
| `/src/i18n/index.ts` | Translation system |
| `/src/styles/theme.css` | Design tokens |
| `/package.json` | Dependencies |

---

## 🎯 Next Steps

### Immediate Priority
1. ✅ Documentation complete
2. ⏳ Migrate Password screen to Glass Ambient
3. ⏳ Migrate Settings screen
4. ⏳ Create shared component library

### This Sprint
1. Complete 5 screen migrations
2. Establish component patterns
3. Test on 320×480 viewport
4. Optimize bundle size

### Next Sprint
1. Complete all 15 screens
2. Hardware integration planning
3. Performance optimization
4. Mobile app pairing prototype

---

## 💡 Tips for Developers

### Adding Features
- Check existing screens for similar patterns
- Use shared components when possible
- Follow design token system
- Test on 320×480 resolution

### Debugging
- Use React DevTools
- Check `/dev` panel for debug info
- Test all i18n languages
- Verify touch targets (≥44px)

### Code Review
- All text via `airo_tr()`
- Header always 50px
- Panel cards use standard classes
- No hardcoded colors (use tokens)

---

## 🤝 Contributing

When adding new features:
1. ✅ Read relevant documentation first
2. ✅ Follow established patterns
3. ✅ Update documentation if needed
4. ✅ Test on target resolution
5. ✅ Verify all languages work

---

## 📞 Support

**Project Lead:** [Your Name]  
**Last Updated:** 2026-05-03  
**Version:** 1.0.0

---

## 📑 Document Index Summary

| Document | Pages | Read Time | Priority |
|----------|-------|-----------|----------|
| SCREENS_AND_FLOWS.md | ~8 | 10 min | 🔴 High |
| QUICK_REFERENCE.md | ~3 | 5 min | 🔴 High |
| FLOW_DIAGRAM.md | ~6 | 5 min | 🟡 Medium |
| ARCHITECTURE.md | ~12 | 20 min | 🟢 Low (deep dive) |
| README.md (this) | ~4 | 5 min | 🔴 High (start here) |

**Total Reading Time:** ~45 minutes for complete understanding

---

**Happy Coding! 🚀**
