/**
 * @file UIKit.tsx
 * @brief Airo Kelvo - Figma UI Kit Reference
 *
 * Standalone page that renders all design tokens, typography,
 * color swatches, component variants, and spacing rules
 * for Figma handoff. Access via /ui-kit route.
 *
 * Folder: /src/app/components/ui-kit/
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Snowflake, Flame, Fan, Droplet, CloudSun, AirVent, CalendarClock, Wifi, WifiOff, Cloud, Smartphone, Lock, ChevronRight, Plus, Trash2, Power, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { Switch } from '../ui/switch';
import { AutoModeIcon } from '../AutoModeIcon';
import { FanSpeedIcon } from '../FanSpeedIcon';
import { HomeBackground } from '../home/HomeBackground';
import type { BackgroundStyle, VRFMode, FanSpeed } from '../../context/ControllerContext';

/* ─── Section wrapper ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold tracking-wide text-app-text-hint px-1 mb-2 uppercase">
        {title}
      </div>
      <div className="bg-app-panel rounded-2xl p-3">
        {children}
      </div>
    </div>
  );
}

/* ─── Color Swatch ─── */
function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div
        className="w-6 h-6 rounded-md border border-app-line flex-shrink-0"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-app-text truncate">{name}</div>
        <div className="text-[9px] text-app-text-dim font-mono">{cssVar}</div>
      </div>
    </div>
  );
}

/* ─── Typography Sample ─── */
function TypoRow({ label, className, style, text }: { label: string; className?: string; style?: React.CSSProperties; text: string }) {
  return (
    <div className="flex items-baseline gap-3 py-1.5 border-b border-app-line/30 last:border-0">
      <div className="text-[9px] text-app-text-dim w-20 flex-shrink-0 font-mono">{label}</div>
      <div className={className} style={style}>{text}</div>
    </div>
  );
}

export function UIKit() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'tokens' | 'components' | 'screens'>('tokens');
  const [switchOn, setSwitchOn] = useState(true);

  const tabs = [
    { id: 'tokens' as const, label: 'Tokens' },
    { id: 'components' as const, label: 'Components' },
    { id: 'screens' as const, label: 'Screens' },
  ];

  return (
    <div className="h-full flex flex-col bg-app-bg overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4"
        style={{ height: 50, borderBottom: '1px solid var(--app-line)' }}
      >
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-app-text" />
        </button>
        <span className="text-sm text-app-text" style={{ fontWeight: 600 }}>UI Kit</span>
        <span className="text-[10px] text-app-text-dim ml-auto">320x480 / 3.5" TFT</span>
      </div>

      {/* Tab bar */}
      <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="flex-1 py-1.5 rounded-lg text-[10px] transition-colors"
            style={{
              fontWeight: tab === t.id ? 700 : 500,
              background: tab === t.id ? 'var(--app-action)' : 'var(--app-panel)',
              color: tab === t.id ? '#fff' : 'var(--app-text-sub)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {tab === 'tokens' && <TokensTab />}
        {tab === 'components' && <ComponentsTab switchOn={switchOn} setSwitchOn={setSwitchOn} />}
        {tab === 'screens' && <ScreensTab />}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  TOKENS TAB                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TokensTab() {
  return (
    <div className="space-y-5">
      {/* Typography */}
      <Section title="Typography Scale">
        <TypoRow label="text-[10px]" className="text-[10px] text-app-text" text="Min size - Tab labels, badges" />
        <TypoRow label="text-[11px]" className="text-[11px] text-app-text" text="Status badges, section labels" />
        <TypoRow label="text-xs" className="text-xs text-app-text" text="Descriptions, secondary info" />
        <TypoRow label="text-sm" className="text-sm text-app-text" text="Row titles, input fields, buttons" />
        <TypoRow label="text-base" className="text-base text-app-text" text="Modal titles" />
        <TypoRow label="text-3xl" className="text-3xl font-display text-app-text" style={{ fontWeight: 300 }} text="OFF" />
        <TypoRow label="text-5xl" className="text-5xl font-display" style={{ fontWeight: 200, color: 'var(--mode-cool)' }} text="22°" />
      </Section>

      {/* Font Families */}
      <Section title="Font Families">
        <div className="py-1">
          <div className="text-sm text-app-text" style={{ fontFamily: 'var(--font-family-base)' }}>Inter - Base UI font</div>
          <div className="text-[9px] text-app-text-dim font-mono mt-0.5">--font-family-base</div>
        </div>
        <div className="py-1 mt-2">
          <div className="text-sm font-display text-app-text">Outfit - Display / Temperature</div>
          <div className="text-[9px] text-app-text-dim font-mono mt-0.5">--font-family-display</div>
        </div>
      </Section>

      {/* Surface Colors */}
      <Section title="Surface Colors">
        <div className="grid grid-cols-2 gap-x-3">
          <Swatch name="Background" cssVar="--app-bg" />
          <Swatch name="Header" cssVar="--app-header" />
          <Swatch name="Panel" cssVar="--app-panel" />
          <Swatch name="Control" cssVar="--app-control" />
          <Swatch name="Hover" cssVar="--app-hover" />
          <Swatch name="Card" cssVar="--app-card" />
          <Swatch name="Input BG" cssVar="--app-input-bg" />
        </div>
      </Section>

      {/* Text Colors */}
      <Section title="Text Colors">
        <div className="grid grid-cols-2 gap-x-3">
          <Swatch name="Text" cssVar="--app-text" />
          <Swatch name="Text Sub" cssVar="--app-text-sub" />
          <Swatch name="Text Hint" cssVar="--app-text-hint" />
          <Swatch name="Text Dim" cssVar="--app-text-dim" />
          <Swatch name="Text Label" cssVar="--app-text-label" />
          <Swatch name="Text Disabled" cssVar="--app-text-disabled" />
        </div>
      </Section>

      {/* Action / Status Colors */}
      <Section title="Action & Status">
        <div className="grid grid-cols-2 gap-x-3">
          <Swatch name="Action" cssVar="--app-action" />
          <Swatch name="Action Hover" cssVar="--app-action-hover" />
          <Swatch name="Danger" cssVar="--app-danger" />
          <Swatch name="Success" cssVar="--app-success" />
          <Swatch name="Warning" cssVar="--app-warning" />
          <Swatch name="Info" cssVar="--app-info" />
        </div>
      </Section>

      {/* Mode Colors */}
      <Section title="VRF Mode Colors">
        <div className="grid grid-cols-2 gap-x-3">
          <Swatch name="Cool" cssVar="--mode-cool" />
          <Swatch name="Heat" cssVar="--mode-heat" />
          <Swatch name="Fan" cssVar="--mode-fan" />
          <Swatch name="Dry" cssVar="--mode-dry" />
          <Swatch name="Auto" cssVar="--mode-auto" />
        </div>
      </Section>

      {/* Brand Colors */}
      <Section title="Brand Colors">
        <div className="grid grid-cols-2 gap-x-3">
          <Swatch name="Cyan" cssVar="--brand-cyan" />
          <Swatch name="Sky" cssVar="--brand-sky" />
          <Swatch name="Blue" cssVar="--brand-blue" />
          <Swatch name="BG" cssVar="--brand-bg" />
        </div>
      </Section>

      {/* Line / Border */}
      <Section title="Lines & Borders">
        <div className="grid grid-cols-2 gap-x-3">
          <Swatch name="Line" cssVar="--app-line" />
          <Swatch name="Border" cssVar="--app-border" />
        </div>
      </Section>

      {/* Spacing */}
      <Section title="Spacing Standards">
        <div className="space-y-2 text-[10px] text-app-text">
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 bg-app-action/20 rounded" style={{ width: 50 }} />
            <span>Header: 50px</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 bg-app-action/20 rounded" style={{ width: 20 }} />
            <span>Content gap: space-y-5 (20px)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 bg-app-action/20 rounded" style={{ width: 12 }} />
            <span>Panel padding: p-3 (12px)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 bg-app-action/20 rounded" style={{ width: 16 }} />
            <span>Content padding: px-4 (16px)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-3 bg-app-action/20 rounded" style={{ width: 16 }} />
            <span>Border radius: rounded-2xl (16px)</span>
          </div>
        </div>
      </Section>

      {/* Layout */}
      <Section title="Layout Spec">
        <div className="text-[10px] text-app-text space-y-1.5">
          <div>Screen: <b>320 x 480px</b></div>
          <div>Header: <b>50px fixed</b></div>
          <div>Content area: <b>430px</b> (480 - 50)</div>
          <div>Panel style: <b>bg-app-panel rounded-2xl p-3</b></div>
          <div>Min font: <b>10px</b></div>
        </div>
      </Section>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  COMPONENTS TAB                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ComponentsTab({ switchOn, setSwitchOn }: { switchOn: boolean; setSwitchOn: (v: boolean) => void }) {
  const modes: { id: VRFMode; icon: any; color: string }[] = [
    { id: 'cool', icon: Snowflake, color: 'var(--mode-cool)' },
    { id: 'heat', icon: Flame, color: 'var(--mode-heat)' },
    { id: 'fan', icon: Fan, color: 'var(--mode-fan)' },
    { id: 'dry', icon: Droplet, color: 'var(--mode-dry)' },
    { id: 'auto', icon: AutoModeIcon, color: 'var(--mode-auto)' },
  ];

  const fanSpeeds: FanSpeed[] = ['off', 'low', 'med', 'high', 'auto'];

  return (
    <div className="space-y-5">
      {/* Header Icons */}
      <Section title="Header Status Icons (18x18)">
        <div className="text-[9px] text-app-text-dim mb-2">
          All header icons: <b>18x18px</b>, strokeWidth: <b>2</b>, color: <b>var(--h2-text-sub)</b>
        </div>
        <div className="flex items-center gap-4 py-2">
          {/* Cloud */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-app-control">
              <Cloud className="w-[18px] h-[18px]" style={{ color: 'var(--app-text-sub)' }} strokeWidth={2} />
            </div>
            <span className="text-[9px] text-app-text-dim">Cloud</span>
          </div>
          {/* Mobile */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-app-control">
              <Smartphone className="w-[18px] h-[18px]" style={{ color: 'var(--app-text-sub)' }} strokeWidth={2} />
            </div>
            <span className="text-[9px] text-app-text-dim">Mobile</span>
          </div>
          {/* Wifi */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-app-control">
              <Wifi className="w-[18px] h-[18px]" style={{ color: 'var(--app-text-sub)' }} strokeWidth={2} />
            </div>
            <span className="text-[9px] text-app-text-dim">Wi-Fi</span>
          </div>
          {/* Wifi Off */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-app-control">
              <WifiOff className="w-[18px] h-[18px]" style={{ color: 'var(--app-text-disabled)' }} strokeWidth={2} />
            </div>
            <span className="text-[9px] text-app-text-dim">Wi-Fi Off</span>
          </div>
        </div>
        <div className="mt-2 text-[9px] text-app-text-dim space-y-0.5">
          <div>Container: <b>w-6 h-6</b> flex center</div>
          <div>Gap between icons: <b>gap-1.5</b> (6px)</div>
          <div>Disabled state: <b>var(--app-text-disabled)</b></div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="space-y-2">
          {/* Primary */}
          <button className="w-full py-2.5 rounded-xl text-sm text-white" style={{ background: 'var(--app-action)', fontWeight: 600 }}>
            Primary Action
          </button>
          {/* Secondary */}
          <button className="w-full py-2.5 rounded-xl text-sm" style={{ background: 'var(--app-control)', color: 'var(--app-text)', fontWeight: 500 }}>
            Secondary
          </button>
          {/* Danger */}
          <button className="w-full py-2.5 rounded-xl text-sm text-white" style={{ background: 'var(--app-danger)', fontWeight: 600 }}>
            Danger / Delete
          </button>
          {/* Ghost */}
          <button className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--app-action)', fontWeight: 600 }}>
            <RefreshCw className="w-4 h-4" />
            Ghost / Outlined
          </button>
          {/* Disabled */}
          <button disabled className="w-full py-2.5 rounded-xl text-sm opacity-40" style={{ background: 'var(--app-control)', color: 'var(--app-text-disabled)', fontWeight: 500 }}>
            Disabled
          </button>
        </div>
      </Section>

      {/* Switch */}
      <Section title="Switch Toggle">
        <div className="flex items-center justify-between">
          <span className="text-sm text-app-text">Toggle switch</span>
          <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
        </div>
      </Section>

      {/* Mode Icons */}
      <Section title="VRF Mode Icons">
        <div className="flex items-center justify-around py-2">
          {modes.map(({ id, icon: Icon, color }) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                <Icon style={{ width: 22, height: 22, color }} strokeWidth={1.8} />
              </div>
              <span className="text-[9px] text-app-text-dim capitalize">{id}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Fan Speed Icons */}
      <Section title="Fan Speed Icons">
        <div className="flex items-center justify-around py-2">
          {fanSpeeds.map((speed) => (
            <div key={speed} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-app-control">
                <FanSpeedIcon speed={speed} isActive={false} />
              </div>
              <span className="text-[9px] text-app-text-dim capitalize">{speed}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Panel Card */}
      <Section title="Panel Card">
        <div className="bg-app-panel rounded-2xl p-3 border border-app-line/30">
          <div className="text-sm text-app-text" style={{ fontWeight: 500 }}>Panel Title</div>
          <div className="text-xs text-app-text-hint mt-1">Description text goes here</div>
        </div>
      </Section>

      {/* List Row */}
      <Section title="List Row Patterns">
        {/* Navigation row */}
        <div className="flex items-center justify-between py-2.5 border-b border-app-line/30">
          <div className="flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-app-text-sub" />
            <span className="text-sm text-app-text">Wi-Fi Setup</span>
          </div>
          <ChevronRight className="w-4 h-4 text-app-text-dim" />
        </div>
        {/* Toggle row */}
        <div className="flex items-center justify-between py-2.5 border-b border-app-line/30">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-app-text-sub" />
            <span className="text-sm text-app-text">Lock Settings</span>
          </div>
          <Switch checked={false} />
        </div>
        {/* Value row */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5">
            <Power className="w-4 h-4 text-app-text-sub" />
            <span className="text-sm text-app-text">Screen Timeout</span>
          </div>
          <span className="text-xs text-app-text-hint">30s</span>
        </div>
      </Section>

      {/* Section Label */}
      <Section title="Section Label Component">
        <div className="text-[11px] font-semibold tracking-wide text-app-text-hint px-1 mb-2 uppercase">
          Section Label
        </div>
        <div className="text-[9px] text-app-text-dim font-mono space-y-0.5">
          <div>Import: <b>{'@/components/SectionLabel'}</b></div>
          <div>text-[11px] font-semibold tracking-wide</div>
          <div>Shared across Settings, Schedule, Parameters, ScheduleEntry</div>
        </div>
      </Section>

      {/* Status Badges */}
      <Section title="Status Badges">
        <div className="flex flex-wrap gap-2 py-1">
          <span className="px-2 py-0.5 rounded-full text-[11px] text-white" style={{ background: 'var(--app-success)', fontWeight: 600 }}>Connected</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] text-white" style={{ background: 'var(--app-danger)', fontWeight: 600 }}>Error</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] text-white" style={{ background: 'var(--app-warning)', fontWeight: 600 }}>Warning</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] text-white" style={{ background: 'var(--app-info)', fontWeight: 600 }}>Info</span>
          <span className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: 'var(--app-control)', color: 'var(--app-text-dim)', fontWeight: 600 }}>Disabled</span>
        </div>
      </Section>

      {/* Glass Panel (Home2 style) */}
      <Section title="Glass Panel (Home Screen)">
        <div
          className="rounded-2xl p-4 flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.45)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <span className="text-sm text-app-text-sub">Glassmorphic surface</span>
        </div>
      </Section>

      {/* Bottom Nav */}
      <Section title="Bottom Navigation Bar">
        <div
          className="flex items-center justify-around rounded-2xl"
          style={{
            height: 56,
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.45)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          {[
            { icon: <CloudSun className="w-5 h-5" />, label: 'Weather', active: false },
            { icon: <AirVent className="w-5 h-5" />, label: 'Parameters', active: true },
            { icon: <CalendarClock className="w-5 h-5" />, label: 'Schedule', active: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-1 flex-1"
              style={{ color: item.active ? 'var(--app-action)' : 'var(--app-text-sub)' }}
            >
              {item.icon}
              <span className="text-[10px]" style={{ fontWeight: item.active ? 600 : 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  SCREENS TAB                               */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ScreensTab() {
  const bgStyles: BackgroundStyle[] = ['none', 'aurora', 'waves', 'gradient', 'mesh', 'circles'];

  return (
    <div className="space-y-5">
      {/* Screen Map */}
      <Section title="Screen Map (Routes)">
        <div className="text-[10px] text-app-text space-y-1">
          {[
            { path: '/', name: 'Boot Screen', desc: 'Splash + auto-redirect' },
            { path: '/home', name: 'Home (Glass Ambient)', desc: 'Main gauge + mode/fan/swing' },
            { path: '/parameters', name: 'Parameters', desc: 'Mode, fan, swing, temp control' },
            { path: '/weather', name: 'Weather', desc: 'Outdoor conditions' },
            { path: '/schedule', name: 'Schedule', desc: 'Weekly schedule entries' },
            { path: '/schedule/entry', name: 'Schedule Entry', desc: 'Add/edit schedule entry' },
            { path: '/settings', name: 'Settings', desc: '5-tab settings panel' },
            { path: '/password', name: 'Password', desc: '4-digit PIN lock' },
            { path: '/change-password', name: 'Change Password', desc: '3-step PIN change' },
            { path: '/wifi', name: 'Wi-Fi Setup', desc: 'Network scan + connect' },
            { path: '/pairing', name: 'Mobile Pairing', desc: 'QR code + device list' },
            { path: '/firmware', name: 'Firmware Upload', desc: 'OTA update flow' },
            { path: '/screensaver', name: 'Screen Saver', desc: 'Clock + burn-in protection' },
            { path: '/dev', name: 'Dev Panel', desc: 'Debug states + color palette' },
            { path: '/ui-kit', name: 'UI Kit', desc: 'This page' },
          ].map((s) => (
            <div key={s.path} className="flex items-start gap-2 py-1 border-b border-app-line/20 last:border-0">
              <span className="font-mono text-app-action w-28 flex-shrink-0">{s.path}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{s.name}</div>
                <div className="text-app-text-dim">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Background Styles Preview */}
      <Section title="Background Styles">
        <div className="grid grid-cols-3 gap-2">
          {bgStyles.map((bg) => (
            <div key={bg} className="flex flex-col items-center gap-1">
              <div
                className="w-full rounded-lg overflow-hidden border border-app-line"
                style={{ aspectRatio: '2/3', background: '#F0F2F6', position: 'relative' }}
              >
                <HomeBackground style={bg} />
              </div>
              <span className="text-[9px] text-app-text-dim capitalize">{bg}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* i18n Languages */}
      <Section title="Supported Languages (9)">
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          {[
            { flag: 'EN', label: 'English' },
            { flag: 'DE', label: 'Deutsch' },
            { flag: 'TR', label: 'Turkce' },
            { flag: 'PT', label: 'Portugues' },
            { flag: 'AR', label: 'Arabic (RTL)' },
            { flag: 'RU', label: 'Russian' },
            { flag: 'ES', label: 'Espanol' },
            { flag: 'IT', label: 'Italiano' },
            { flag: 'FR', label: 'Francais' },
          ].map((l) => (
            <div key={l.flag} className="bg-app-control rounded-lg px-2 py-1.5 text-center">
              <div className="text-app-text" style={{ fontWeight: 600 }}>{l.flag}</div>
              <div className="text-app-text-dim text-[9px]">{l.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Design Rules */}
      <Section title="Design Rules">
        <div className="text-[10px] text-app-text space-y-1.5">
          <div>Header height: <b>50px</b> (all screens)</div>
          <div>Content area: <b>430px</b></div>
          <div>Min font size: <b>10px</b></div>
          <div>Row titles: <b>text-sm</b> (14px)</div>
          <div>Descriptions: <b>text-xs</b> (12px)</div>
          <div>Modal titles: <b>text-base</b> (16px)</div>
          <div>Tab labels: <b>text-[10px]</b></div>
          <div>Status badges: <b>text-[11px]</b></div>
          <div>Section label: <b>text-[11px] uppercase tracking-wide</b></div>
          <div>Panel: <b>bg-app-panel rounded-2xl p-3</b></div>
          <div>Spacing: <b>space-y-5</b></div>
          <div>No hardcoded strings: use <b>t('key')</b></div>
          <div>Action color: <b>#4a94f0</b> (light) / <b>#60a5fa</b> (dark)</div>
        </div>
      </Section>
    </div>
  );
}

export default UIKit;