# State Bindings — `ControllerSettings` ↔ Screens

**Purpose:** for an LVGL port, this is the canonical map of which fields each screen reads, writes, and which need persistence. The single source of truth in code is `src/app/context/ControllerContext.tsx`.

---

## Field catalogue

Grouped by domain. **Persist** column = needs to survive reboot.

### Power & operating state

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `isOn` | `boolean` | Yes | Home, Schedule | Home (power tap), Schedule trigger |
| `isConnected` | `boolean` | No (live) | Home, all screens (status) | Bus driver |
| `cloudConnected` | `boolean` | No | Home, Settings (Protocols) | MQTT/cloud driver |
| `wifiConnected` | `boolean` | No | Home, WiFiSetup | WiFi driver |
| `hasError` | `boolean` | No | Home, Parameters | Bus driver |
| `errorCode` | `string` | No | Home, Parameters | Bus driver |
| `developerMode` | `boolean` | **No (volatile)** — resets on reboot | DevPanel | Settings (5-tap on firmware) |

### Climate control

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `currentTemp` | `number` | No (live) | Home, Weather, Parameters | Sensor driver |
| `targetTemp` | `number` | Yes | Home (gauge), Schedule, Parameters | Home (gauge drag), Settings, Schedule |
| `mode` | `'cool'\|'heat'\|'auto'\|'fan'\|'dry'` | Yes | Home, Parameters | Home (mode pill), Schedule |
| `fanSpeed` | `'off'\|'low'\|'med'\|'high'\|'auto'` | Yes | Home, Parameters | Home, Schedule |
| `enabledFanSpeeds` | `FanSpeed[]` | Yes | Home (which buttons render) | Settings |
| `swingEnabled` | `boolean` | Yes | Home, Parameters | Home swing pill |
| `swingAngle` | `0\|15\|30\|45\|60\|75\|90` | Yes | Parameters | Parameters |
| `swingSpeed` | `'slow'\|'normal'\|'fast'` | Yes | — | Settings (Climate) |
| `enabledSwingAngles` | `SwingAngle[]` | Yes | Parameters | Settings |
| `autoVane` | `boolean` | Yes | Parameters | Parameters |
| `minTemp` / `maxTemp` | `number` | Yes | Home (gauge bounds), Schedule | Settings (Climate) |
| `tempStep` | `0.5\|1` | Yes | Home, Schedule, Settings | Settings |
| `temperatureUnit` | `'celsius'\|'fahrenheit'` | Yes | Everywhere displaying temp | Settings |
| `hysteresis` | `number` (0.5–3.0, step 0.5) | Yes | Settings (visualisation), bus | Settings |
| `auxHeat` | `AuxHeatConfig` (11 sub-fields) | Yes | Settings, Aux logic | Settings → AuxHeatModal |
| `currentHumidity` | `number` | No (live) | Home, Weather | Sensor driver |

### Display & UX

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `darkTheme` | `boolean` | Yes | RootLayout (toggles `.dark`), Home, Weather | Settings (Display) |
| `screenSaverEnabled` | `boolean` | Yes | RootLayout idle timer | Settings |
| `screenTimeout` | `number` (sec) | Yes | RootLayout idle timer | Settings |
| `radarWakeEnabled` | `boolean` | Yes | RootLayout/sensor handler | Settings |
| `backgroundStyle` | `'none'\|'aurora'\|'waves'\|'gradient'\|'mesh'\|'circles'` | Yes | Home (HomeBackground) | Settings (Display) |
| `language` | `'en'\|'de'\|'tr'\|'pt'\|'ar'\|'ru'\|'es'\|'it'\|'fr'` | Yes | i18n provider, RootLayout (RTL) | Settings (General) |

### Schedule

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `schedulingEnabled` | `boolean` | Yes | Home (badge), Schedule trigger loop | Schedule |
| `schedule` | `DaySchedule[]` (7) | Yes | Schedule, ScheduleEntry, trigger loop | ScheduleEntry |

### Network & devices

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `dhcpEnabled` | `boolean` | Yes | Settings (Network) | Settings |
| `ipAddress`, `subnetMask`, `gateway`, `dns` | `string` | Yes (when DHCP off) | Settings | Settings |
| `macAddress` | `string` | Read-only (factory) | Settings | — |
| `bluetoothEnabled` | `boolean` | Yes | Settings | Settings |
| `bluetoothConnected` | `boolean` | No (live) | Settings | BLE driver |
| `mobileDevices` | `MobileDevice[]` | Yes | MobilePairing | MobilePairing |
| `password` | `string` | Yes (hashed in firmware!) | Password, ChangePassword | ChangePassword |
| `settingsLockEnabled` | `boolean` | Yes | Home (route guard), Settings | Settings |
| `bmsLicenseValid` | `boolean` | Yes | Settings (Protocols gate) | Provisioning flow |

### Protocols

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `activeProtocol` | `ProtocolType` (legacy) | Yes | — | Settings |
| `activeFieldProtocol` | `'none'\|'modbus'\|'bacnet'` | Yes | Bus driver | Settings |
| `activeCloudProtocol` | `'none'\|'mqtt'\|'openadr'` | Yes | Cloud driver | Settings |
| `protocolConnected` | `Record<string, boolean>` | No (live) | Settings | Drivers |

### Location & weather

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `country`, `city`, `timezone` | `string` | Yes | Weather, Settings (General) | Provisioning / Settings (currently disabled UI) |
| `weatherData` | `WeatherData` (7 sub-fields) | No (live) | Home, Weather | Weather fetcher |

### Device identity

| Field | Type | Persist | Read by | Written by |
|-------|------|---------|---------|-----------|
| `deviceName` | `string` | Yes | Home, Settings | Settings |

---

## Suggested LVGL persistence layout (NVS)

```
namespace "kelvo"
  blob "climate"   → { targetTemp, mode, fanSpeed, swingEnabled, swingAngle,
                       swingSpeed, autoVane, minTemp, maxTemp, tempStep,
                       temperatureUnit, hysteresis, auxHeat (11 fields) }
  blob "schedule"  → schedule[7]
  blob "display"   → { darkTheme, screenSaverEnabled, screenTimeout,
                       radarWakeEnabled, backgroundStyle, language }
  blob "network"   → { dhcpEnabled, ip/mask/gw/dns, bluetoothEnabled,
                       activeFieldProtocol, activeCloudProtocol }
  blob "auth"      → { passwordHash, settingsLockEnabled }
  blob "devices"   → mobileDevices[]
  u8   "schemaVersion" → migration anchor
```

**Volatile (memory only):** `isConnected`, `wifiConnected`, `cloudConnected`, `currentTemp`, `currentHumidity`, `weatherData`, `bluetoothConnected`, `protocolConnected`, `developerMode`, `hasError`, `errorCode`.

---

## Event hooks needed in LVGL

For each writable field, the firmware must hook the corresponding widget's `LV_EVENT_VALUE_CHANGED` (or `LV_EVENT_CLICKED` for buttons) to:
1. Update the shared state struct (mirror of `ControllerSettings`).
2. Persist if marked "Yes" above.
3. Push to bus (Modbus/BACnet/MQTT) if the field is also exposed on a register/topic.
4. Invalidate any other widget reading the same field.

A small pub/sub layer (e.g. `lv_observer_t` in v9 or a custom dirty-flag table) saves manual `lv_obj_invalidate` calls.

---

**Last Updated:** 2026-05-04
