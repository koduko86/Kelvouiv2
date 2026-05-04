# Typography Specification

**Purpose:** translate Tailwind font classes to concrete LVGL `lv_font_t` declarations for ESP32-S3 firmware.

---

## Font families

| Token | Family | Weights needed | Notes |
|-------|--------|----------------|-------|
| `--font-family-base` | **Inter** | 400, 500, 600, 700 | All UI text |
| `--font-family-display` | **Outfit** | 600 | Large temperature readout on Home only |

Source: `src/styles/theme.css` lines 5–6.

---

## Type scale (used in source)

Derived from `text-*` Tailwind classes encountered across `src/app/`:

| Tailwind class | Pixel size | Usage role | LVGL declaration |
|----------------|-----------|------------|-------------------|
| `text-[10px]` | 10 | Micro-labels (gauge ticks, dead-band markers) | `lv_font_montserrat_10` or custom `inter_10` |
| `text-[11px]` | 11 | Captions, badges, dialog hints, section labels | `inter_11` (subset Latin + Cyrillic + Arabic) |
| `text-xs` | 12 | Body small (descriptions, secondary info) | `inter_12` |
| `text-sm` | 14 | **Default body** (panel titles, button labels, list rows) | `inter_14` |
| `text-base` | 16 | Heading-3 (modal titles, group titles) | `inter_16` |
| `text-lg` | 18 | Heading-2 (occasional) | `inter_18` |
| `text-xl` – `text-7xl` | 20–72 | Display-only (Home temperature, BootScreen branding) | `outfit_48`, `outfit_72` |

**Recommendation:** ship 4 Inter sizes (11/12/14/16) + 2 Outfit sizes (48/72). Cut 10px (re-use 11) and 18px (re-use 16) to save flash.

---

## Weight mapping

| Tailwind | CSS weight | Inter file |
|----------|-----------|------------|
| `font-normal` (default) | 400 | Inter-Regular |
| `font-medium` | 500 | Inter-Medium |
| `font-semibold` | 600 | Inter-SemiBold |
| `font-bold` | 700 | Inter-Bold (rarely used; avoid if possible) |

LVGL convention: one `.ttf` per weight, converted via `lv_font_conv` per size. Total fonts = sizes × weights = up to 16 binaries. Realistic minimum to keep all current screens readable: **8** (Inter Reg/Med/SemiBold @ 12, 14, 16; Outfit SemiBold @ 48, 72).

---

## Glyph subsets (per language)

For 9 supported languages, each font binary must include:

| Language | Glyph range | Notes |
|----------|------------|-------|
| en, de, fr, it, es, pt, tr | Latin Basic + Latin Ext-A + Latin Ext-B | ~600 glyphs |
| ru | + Cyrillic Basic | + ~256 glyphs |
| ar | + Arabic + Arabic Pres-A + Arabic Pres-B + ZWNJ/ZWJ | + ~700 glyphs, **needs RTL shaper** |

LVGL v9 supports Arabic shaping (`LV_USE_BIDI`, `LV_USE_ARABIC_PERSIAN_CHARS`). Enable both. Verify line height — Arabic typically needs +20% vertical metrics.

---

## Roles by screen region

| Region | Class | Family | Weight | Px |
|--------|-------|--------|--------|-----|
| App header title | `text-sm font-semibold` | Inter | 600 | 14 |
| Section label (`SectionLabel`) | `text-[11px] font-semibold tracking-wide` | Inter | 600 | 11 |
| Panel card title | `text-sm font-medium` | Inter | 500 | 14 |
| Panel description | `text-xs` | Inter | 400 | 12 |
| Segmented button label | `text-sm font-medium` (or `text-[11px]` in dense modal) | Inter | 500 | 11–14 |
| Switch row title | `text-sm font-medium` | Inter | 500 | 14 |
| Switch row description | `text-xs` | Inter | 400 | 12 |
| Dialog title | `text-base font-semibold` (rendered by theme.css default `<h3>`) | Inter | 600 | 16 |
| Dialog body | `text-xs` | Inter | 400 | 12 |
| Home temperature digits | display class | Outfit | 600 | 72 |
| Home temperature unit | `text-2xl` | Outfit | 600 | 24 |
| BootScreen brand wordmark | `text-3xl` | Outfit | 600 | 30 |

`theme.css` ships base `h1..h3` + `body` defaults — reproduce the same hierarchy in LVGL via `lv_style_set_text_font` per role.

---

## Sizing rule for 3.5" TFT readability

Critical project rule (per CLAUDE.md): **fonts must be readable on 3.5" 320×480**. Minimum body text 12 px; minimum tap-target label 14 px. 10 px reserved for non-critical micro-labels next to a larger value.

For LVGL: do **not** drop body to 10–11 px to save flash. Keep 14 as default and budget memory accordingly.

---

**Last Updated:** 2026-05-04
