# LVGL Integration — Gap Analysis

**Question:** "Can a UI developer integrate this prototype to LVGL with the current docs?"

**Honest answer (updated 2026-05-04):** **Partially — the soft gaps are now closed.** Three follow-up docs were added (`ASSETS.md`, `TYPOGRAPHY.md`, `STATE_BINDINGS.md`). Together with the existing inventory + state shape, an LVGL developer now has ~70% of the information needed. The remaining 30% requires *measurement* (pixel coordinates) and *decisions* (persistence schema commit, animation budgets) that cannot be fabricated from the React source alone.

---

## ✅ What the docs give you today

| Area | Coverage | Where |
|------|----------|-------|
| Screen inventory | Complete (15 screens, 6 flows) | `SCREENS_AND_FLOWS.md`, `FLOW_DIAGRAM.md` |
| Navigation graph | Complete | `FLOW_DIAGRAM.md` |
| State model | `ControllerSettings` shape is canonical | `src/app/context/ControllerContext.tsx` |
| Color tokens | Light + dark, semantic names | `QUICK_REFERENCE.md`, `src/styles/theme.css` |
| i18n keys | 9 languages, single source | `src/app/context/i18n.ts` |
| Layout standards | 50px header, 430px content, panel/segment patterns | `QUICK_REFERENCE.md` |
| Domain logic | Hysteresis, aux-heat staging, schedule, mode/fan/swing | TS source |

---

## ❌ What's missing for an LVGL port

### 1. Pixel-exact widget specs
The prototype renders via Tailwind/Flexbox. LVGL needs absolute coordinates per widget:
- **Required:** `x, y, w, h` per element on each screen at 320×480.
- **Currently:** Implicit (computed by browser layout engine).
- **Fix:** Export each screen as a measured spec sheet (Figma frames already exist — annotate with absolute pixel positions, or auto-export via Figma API).

### 2. Typography mapping
- **Required:** Font family + size + weight + line-height **for each text role**, mapped to LVGL `lv_font_t` declarations. Specify glyph ranges per language (CJK not in scope; Latin Ext + Cyrillic + Arabic needed).
- **Currently:** Uses Tailwind defaults + `theme.css` body styles. No per-screen font role table.
- **Fix:** Produce `TYPOGRAPHY.md` listing roles (display-temp, panel-title, body, caption, micro) → `lv_font_montserrat_24` style mappings + glyph subsets.

### 3. Asset inventory
- **Required:** All icons, logos, gauge graphics, swing animations as PNG/C-array assets. Lucide icons used in React must be exported as `lv_image_dsc_t` or rasterized.
- **Currently:** `lucide-react` loaded as SVG components at runtime. No asset bundle exists.
- **Fix:** Generate `ASSETS.md` mapping each `import { X } from 'lucide-react'` to a target LVGL asset (and dimensions). Convert with `lv_img_conv` or LVGL's online tool.

### 4. Widget tree per screen
- **Required:** LVGL parent/child object tree (e.g. `lv_obj_t* root → header → tabs → panel → segmented_button[3]`).
- **Currently:** JSX trees are readable but mix layout containers with logic. No flat object hierarchy doc.
- **Fix:** For each screen, a `WIDGETS_<screen>.md` with the tree and which widget owns which state binding.

### 5. State bindings & event wiring
- **Required:** "When `auxHeat.enabled` changes, redraw which widgets? Which event triggers `updateSettings({ auxHeat: ... })`?"
- **Currently:** React handles this implicitly via re-render. LVGL needs explicit `lv_obj_invalidate()` calls and `lv_event_cb_t` handlers.
- **Fix:** A binding table per screen — widget ↔ state field ↔ event.

### 6. Animations & transitions
- **Required:** Easing function, duration, target property, trigger condition.
- **Currently:** CSS `transition-colors`, `active:scale-[0.97]`, custom keyframes (`fadeIn`). Implicit.
- **Fix:** `ANIMATIONS.md` with `lv_anim_t` recipes (e.g. button press: scale 1.0→0.97 over 80ms cubic-out).

### 7. Memory & rendering budget
- **Required:** Frame buffer mode (single/double), partial refresh strategy, max draw time per screen for ILI9488 + ESP32-S3.
- **Currently:** N/A (browser handles).
- **Fix:** Performance brief — which screens use full-screen redraws (gauge), which use partial (status bar).

### 8. Touch input & gesture mapping
- **Required:** Long-press thresholds, swipe directions per screen, tap zones (especially for the firmware 5-tap easter egg, slider drag, gauge tap).
- **Currently:** Inferred from `onClick`/`onPointerDown` handlers.
- **Fix:** Touch spec table per screen.

### 9. Dark mode behavior on hardware
- **Required:** Does the hardware UI follow user toggle (current React behavior), system ambient sensor, or schedule? Token swap mechanism in LVGL (`lv_theme_*` or manual style swap)?
- **Currently:** `RootLayout` toggles `.dark` class. Hardware equivalent undefined.
- **Fix:** Decide policy + document LVGL theme variant strategy.

### 10. Persistence
- **Required:** Which fields in `ControllerSettings` survive reboot? Stored where (NVS / flash / SD)? Schema versioning?
- **Currently:** React state in memory only; `developerMode` annotated as volatile but no other persistence map.
- **Fix:** Persistence schema doc.

### 11. Protocol / IO mapping
- **Required:** Which widget changes drive Modbus/BACnet/MQTT messages? Register map.
- **Currently:** UI shows protocol selection but no register/topic table.
- **Fix:** This is a separate firmware concern but should be cross-referenced.

---

## 📐 Status of the 6 follow-up docs

| Doc | Status | Notes |
|-----|--------|-------|
| **`TYPOGRAPHY.md`** | ✅ Done | Font families, type scale, LVGL `lv_font_t` plan, glyph subsets per language |
| **`ASSETS.md`** | ✅ Done | All ~65 Lucide icons inventoried + custom SVG + background style budget |
| **`STATE_BINDINGS.md`** | ✅ Done | Every `ControllerSettings` field with read/write/persist matrix + suggested NVS layout |
| **`PIXEL_SPECS.md`** | ❌ TODO | **Blocker.** Must be measured against the running prototype or exported from Figma — cannot be derived from Tailwind classes reliably (flexbox computes at runtime) |
| **`ANIMATIONS.md`** | ❌ TODO | Transition timings (CSS `transition-colors ~150ms`, `active:scale-[0.97] ~80ms`, fade-in keyframes) need formal LVGL `lv_anim_t` recipes |
| **`PERFORMANCE.md`** | ❌ TODO | Frame buffer mode, partial-refresh strategy for ILI9488 — firmware-side decision, not derivable from prototype |

---

## TL;DR

- **For visual reference & behavior alignment:** ✅ docs are sufficient.
- **For "hand off, build LVGL UI":** ⚠️ 70% there. Blocker = `PIXEL_SPECS.md` (measure once from Figma or running prototype).
- **What you can start today without PIXEL_SPECS:** font binaries, asset bundle, NVS schema implementation, state struct mirror, event handler skeleton. All of these are unblocked.

---

**Last Updated:** 2026-05-04
