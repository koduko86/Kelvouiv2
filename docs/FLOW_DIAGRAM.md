# Airo° Kelvo - Navigation Flow Diagram

## 🗺️ Complete User Journey Map

```
                         ┌─────────────────┐
                         │   BOOT SCREEN   │ ◄── System Start
                         │   (/)           │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PASSWORD      │ ◄── Lock/Auth
                         │   (/password)   │
                         └────────┬────────┘
                                  │
                                  ▼
              ┌──────────────────────────────────────┐
              │           HOME DASHBOARD             │ ◄── Main Hub
              │      (/home) [Glass Ambient]         │
              │  ┌──────────────────────────────┐   │
              │  │ Temp Control • Mode • Fan    │   │
              │  │ Quick Actions • Status       │   │
              │  └──────────────────────────────┘   │
              └──┬───────────┬───────────┬──────────┘
                 │           │           │
    ┌────────────┤           │           └──────────────┐
    │            │           │                          │
    ▼            ▼           ▼                          ▼
┌────────┐  ┌─────────┐  ┌──────────┐           ┌──────────┐
│WEATHER │  │SETTINGS │  │SCHEDULE  │           │ (Others) │
│(/weather)│ │(/settings)│(/schedule)│           └──────────┘
└────────┘  └────┬────┘  └────┬─────┘
                 │            │
       ┌─────────┼────────┐   │
       │         │        │   ├──► ┌─────────────────┐
       ▼         ▼        ▼   │    │ SCHEDULE ENTRY  │
   ┌──────┐ ┌──────┐ ┌──────┐│    │ (/schedule/entry)│
   │PARAMS││ WiFi  ││CHANGE││    │ Create/Edit     │
   │      ││SETUP  ││PASS  ││    └─────────────────┘
   └──────┘ └──────┘ └──────┘│
   (/parameters) (/wifi) (/change-password)
```

---

## 🔐 Authentication Flow

```
┌──────────────┐
│  Any Screen  │
└──────┬───────┘
       │ (timeout/lock button)
       ▼
┌──────────────┐     ┌────────────────┐
│  PASSWORD    │────►│ CHANGE PASSWORD│
│              │     │ (settings menu)│
└──────┬───────┘     └────────────────┘
       │ (correct PIN)
       ▼
┌──────────────┐
│  HOME        │
└──────────────┘
```

---

## ⚙️ Settings Flow

```
┌──────────────┐
│  SETTINGS    │ Main Menu
└──────┬───────┘
       │
   ┌───┴────────────────────────────┐
   │                                │
   ▼                                ▼
┌─────────────┐            ┌────────────────┐
│ PARAMETERS  │            │  WiFi SETUP    │
│ - Temp range│            │  - Scan        │
│ - Fan modes │            │  - Connect     │
│ - Advanced  │            │  - Status      │
└─────────────┘            └────────────────┘
                                   │
                                   │
                           ┌───────┴────────┐
                           ▼                ▼
                  ┌────────────┐   ┌─────────────┐
                  │ CHANGE PWD │   │ MOBILE PAIR │
                  └────────────┘   │ (QR Code)   │
                                   └─────────────┘
```

---

## 📅 Schedule Flow

```
┌──────────────┐
│  SCHEDULE    │ Weekly Overview
│              │
│ Mo Tu We Th  │
│ Fr Sa Su     │
└──────┬───────┘
       │
       ├─► [+] New Entry
       │
       └─► [Edit] Existing
           │
           ▼
    ┌─────────────────┐
    │ SCHEDULE ENTRY  │
    │                 │
    │ - Time range    │
    │ - Days          │
    │ - Temperature   │
    │ - Mode          │
    └─────────────────┘
```

---

## 🔧 Admin/Setup Flow

```
┌─────────────────┐
│  INITIAL SETUP  │
└────────┬────────┘
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
┌──────────────┐    ┌───────────────┐
│ WiFi SETUP   │    │ MOBILE PAIRING│
│              │    │ QR Code Scan  │
└──────────────┘    └───────────────┘
         │                  │
         └──────┬───────────┘
                │
                ▼
         ┌──────────────┐
         │    HOME      │
         └──────────────┘

┌──────────────────┐
│ FIRMWARE UPLOAD  │ ◄── Admin/Maintenance
│ OTA Update       │     (settings menu)
└──────────────────┘

┌──────────────────┐
│   DEV PANEL      │ ◄── Debug Only
│   (/dev)         │     (hidden)
└──────────────────┘
```

---

## 💤 Idle State Flow

```
┌──────────────┐
│  Any Screen  │
└──────┬───────┘
       │ (no touch for X minutes)
       ▼
┌──────────────┐
│ SCREENSAVER  │ Ambient Display
│ - Clock      │ - Low brightness
│ - Weather    │ - Minimal UI
└──────┬───────┘
       │ (touch)
       ▼
┌──────────────┐
│  PASSWORD    │ (if locked)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  HOME        │
└──────────────┘
```

---

## 🚀 Boot Sequence

```
┌─────────────┐
│ POWER ON    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ BOOT SCREEN │
│ - Logo      │
│ - Init HW   │
│ - Load CFG  │
└──────┬──────┘
       │
       ├─► First Boot? ──Yes──► WiFi Setup Flow
       │                             │
       │                             ▼
       └─────────No──────────► Password Check
                                     │
                                     ▼
                                  HOME
```

---

## 📊 Screen Priority Matrix

| Screen | Frequency | User Type | Priority |
|--------|-----------|-----------|----------|
| Home | Daily | All | 🔴 Critical |
| Weather | Daily | All | 🟡 High |
| Schedule | Weekly | Advanced | 🟡 High |
| Settings | Monthly | All | 🟢 Medium |
| Password | Daily | All | 🔴 Critical |
| Parameters | Rare | Expert | 🔵 Low |
| WiFi Setup | Once | Installer | 🟢 Medium |
| Mobile Pair | Once | Owner | 🟢 Medium |
| Firmware | Rare | Admin | 🔵 Low |
| Screensaver | Auto | All | 🟡 High |

---

## 🎯 Design Migration Status

| Flow | Screens | Glass Ambient | Status |
|------|---------|---------------|--------|
| Control | Home, Weather | ✅ Home only | 50% |
| Auth | Password, Change | ❌ Legacy | 0% |
| Settings | 3 screens | ❌ Legacy | 0% |
| Schedule | 2 screens | ❌ Legacy | 0% |
| System | 3 screens | ❌ Legacy | 0% |
| Admin | 3 screens | ❌ Legacy | 0% |

**Overall Progress:** 1/15 screens (6.7%) migrated to new design

---

## 🔄 Next Migration Priority

1. **Password** - High frequency, critical UX
2. **Settings** - Main menu, hub screen
3. **Weather** - Companion to Home
4. **Schedule** - Advanced feature
5. **Parameters** - Expert users
6. **WiFi Setup** - One-time setup
7. **Others** - Lower priority

---

**Last Updated:** 2026-05-03  
**Design System:** Glass Ambient (Neomorphic Premium)  
**Target Device:** 320×480 ILI9488 TFT
