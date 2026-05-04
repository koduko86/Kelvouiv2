# Asset Inventory — Icons & Images

**Purpose:** complete list of visual assets the React prototype uses, mapped to LVGL equivalents for firmware port.

---

## Lucide Icons (in use)

All icons imported from `lucide-react`. Every icon needs an LVGL equivalent: either `lv_image_dsc_t` (PNG → C array) or a `lv_symbol_t` from FontAwesome built-in.

**Recommended workflow:** export each icon as 1bpp/4bpp PNG at the sizes used (16, 20, 24, 32 px), convert with `lv_img_conv_v9` to C arrays, store in `assets/icons/`.

### Used icons (deduplicated)

| Icon | Used in | Sizes used (px) |
|------|---------|----------------|
| `Activity` | Settings (Hysteresis) | 16 |
| `AirVent` | UIKit | 16 |
| `AlertTriangle` | UIKit, Settings, MobilePairing | 16 |
| `ArrowLeft` | All screens (back nav) | 20 |
| `Bluetooth` | Settings | 20 |
| `CalendarClock` | Schedule, UIKit | 16, 20 |
| `CalendarDays` | ScheduleEntry | 16 |
| `Check` | UIKit, ChangePassword, Settings | 16 |
| `ChevronRight` | UIKit, Settings (nav rows) | 20 |
| `Clock` | Settings, ScheduleEntry | 16 |
| `Cloud` | Settings, UIKit, Weather | 16 |
| `CloudFog` | Weather | 16 |
| `CloudLightning` | Weather | 16 |
| `CloudOff` | Settings | 16 |
| `CloudRain` | Weather | 16 |
| `CloudSnow` | Weather | 16 |
| `CloudSun` | UIKit, Weather | 16 |
| `Cpu` | Settings | 20 |
| `Delete` | WiFiSetup, ChangePassword, Password | 20 |
| `Download` | Settings | 16 |
| `Droplet` | Parameters, UIKit | 16 |
| `Droplets` | Weather | 16 |
| `Edit2` | Schedule | 16 |
| `Eye` / `EyeOff` | WiFiSetup | 16 |
| `Fan` | Settings, Parameters, UIKit | 16 |
| `Flame` | Parameters, UIKit, AuxHeatModal, Settings | 16 |
| `FlaskConical` | Settings | 16 |
| `Footprints` | Settings | 16 |
| `Gauge` | DevPanel, Weather, Settings, ScheduleEntry | 16, 20 |
| `Globe` | Settings | 24 |
| `Home` | Weather, Settings | 12, 16 |
| `HouseWifi` | Settings | 16 |
| `KeyRound` | Password | 24 |
| `Layers` | AuxHeatModal | 16 |
| `Loader2` | WiFiSetup | 16 |
| `Lock` | Settings, ChangePassword, WiFiSetup, UIKit | 20 |
| `MapPin` | Settings | 16 |
| `Monitor` | Settings, DevPanel | 16, 20 |
| `MonitorSmartphone` | Settings | 16 |
| `Moon` | Settings | 16 |
| `Network` | Settings | 20 |
| `Palette` | DevPanel | 20 |
| `Pencil` | Settings | 14 |
| `Plus` | Schedule, UIKit | 16 |
| `Power` / `PowerOff` | Schedule, ScheduleEntry, Settings, UIKit | 14, 16 |
| `QrCode` | MobilePairing | 24 |
| `Radar` | Settings | 16 |
| `RefreshCw` | UIKit, WiFiSetup, Home2 | 16 |
| `RotateCcw` | FirmwareUpload | 16 |
| `Save` | Settings | 14 |
| `Settings2` | Settings | 16 |
| `ShieldCheck` | Settings, Weather | 24 |
| `SlidersHorizontal` | Settings (Aux Heat Configure) | 16 |
| `Smartphone` | Settings, MobilePairing, FirmwareUpload, UIKit | 20 |
| `Snowflake` | Parameters, UIKit | 16 |
| `Sun` | Weather | 16 |
| `SunSnow` | Settings | 16 |
| `Thermometer` | Weather, ScheduleEntry, AuxHeatModal | 16 |
| `Timer` | AuxHeatModal | 16 |
| `Trash2` | UIKit, Schedule, MobilePairing | 16 |
| `TreePine` | Weather | 16 |
| `Unplug` | Settings | 16 |
| `Upload` | FirmwareUpload | 16 |
| `Wallpaper` | Settings | 16 |
| `Wifi` / `WifiOff` | All connectivity screens | 20 |
| `Wind` | Settings, Weather, AuxHeatModal | 16 |
| `X` | WiFiSetup, AuxHeatModal | 20 |
| `XCircle` | FirmwareUpload | 20 |
| `Zap` | AuxHeatModal | 16 |

**Total: ~65 unique icons.** Export at 16, 20, 24 px (and 12 for `Home` thumbnails).

---

## Custom SVG / Inline graphics

| Asset | Source | Notes |
|-------|--------|-------|
| Auto-mode icon | `src/app/components/AutoModeIcon.tsx` | Custom SVG, redraw natively in LVGL with `lv_canvas` or convert to image |
| Fan-speed icons | `src/app/components/FanSpeedIcon.tsx` | 5 variants (off / low / med / high / auto) |
| Modbus / BACnet / MQTT / OpenADR logos | inline SVG in `Settings.tsx` (`ModbusLogo`, etc.) | Vendor logos — convert to PNG, respect trademark |
| `figma:asset/*` raster imports | None currently | If added later, convert via `lv_img_conv` |

---

## Background styles (Home Glass Ambient)

`src/app/components/home/HomeBackground.tsx` provides 5 procedural backgrounds (`aurora`, `waves`, `gradient`, `mesh`, `circles`). Each is SVG/CSS-based.

For LVGL: render once as 320×480 PNG per style + theme (light/dark) → 10 background images, ~600 KB total at PNG-24. Alternative: implement a lightweight gradient/mesh renderer as `lv_canvas` draw routine.

---

## Fonts (see TYPOGRAPHY.md)

- **Inter** (UI text)
- **Outfit** (display — large temp readout on Home)

LVGL needs `lv_font_t` declarations for: Inter Regular 12/14/16/20, Inter Medium 14/16, Inter SemiBold 14/16/24, Outfit SemiBold 48/72.

---

**Last Updated:** 2026-05-04
