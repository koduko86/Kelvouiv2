import { useState } from 'react';
import { useController, VRFMode, FanSpeed, Language } from '../context/ControllerContext';
import { useTranslation, usePlural } from '../context/i18n';
import { useNavigate } from 'react-router';
import { ArrowLeft, Monitor, Palette, Gauge } from 'lucide-react';
import { PinPad } from './Password';

type Tab = 'states' | 'palette' | 'plural';

/* ─── Color Token Definitions ─── */
const SURFACE_TOKENS = [
  { name: 'app-bg', var: '--app-bg' },
  { name: 'app-header', var: '--app-header' },
  { name: 'app-panel', var: '--app-panel' },
  { name: 'app-control', var: '--app-control' },
  { name: 'app-hover', var: '--app-hover' },
  { name: 'app-card', var: '--app-card' },
  { name: 'app-input-bg', var: '--app-input-bg' },
];

const TEXT_TOKENS = [
  { name: 'app-text', var: '--app-text' },
  { name: 'app-text-sub', var: '--app-text-sub' },
  { name: 'app-text-hint', var: '--app-text-hint' },
  { name: 'app-text-dim', var: '--app-text-dim' },
  { name: 'app-text-label', var: '--app-text-label' },
  { name: 'app-text-disabled', var: '--app-text-disabled' },
];

const ACTION_TOKENS = [
  { name: 'app-action', var: '--app-action' },
  { name: 'app-action-hover', var: '--app-action-hover' },
  { name: 'app-danger', var: '--app-danger' },
  { name: 'app-success', var: '--app-success' },
  { name: 'app-warning', var: '--app-warning' },
  { name: 'app-info', var: '--app-info' },
  { name: 'app-off', var: '--app-off' },
];

const MODE_TOKENS = [
  { name: 'mode-cool', var: '--mode-cool' },
  { name: 'mode-heat', var: '--mode-heat' },
  { name: 'mode-fan', var: '--mode-fan' },
  { name: 'mode-dry', var: '--mode-dry' },
  { name: 'mode-auto', var: '--mode-auto' },
];

const BRAND_TOKENS = [
  { name: 'brand-cyan', var: '--brand-cyan' },
  { name: 'brand-sky', var: '--brand-sky' },
  { name: 'brand-blue', var: '--brand-blue' },
  { name: 'brand-bg', var: '--brand-bg' },
];

const GAUGE_TOKENS = [
  { name: 'gauge-track', var: '--gauge-track' },
  { name: 'gauge-inner', var: '--gauge-inner' },
  { name: 'gauge-knob', var: '--gauge-knob' },
];

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  const computed = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return (
    <div className="flex items-center gap-2 py-1">
      <div
        className="w-7 h-7 rounded-lg border border-app-line flex-shrink-0"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-medium text-app-text truncate">{name}</div>
        <div className="text-[10px] text-app-text-hint font-mono truncate">{computed || cssVar}</div>
      </div>
    </div>
  );
}

function ColorSection({ title, tokens }: { title: string; tokens: { name: string; var: string }[] }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {tokens.map(t => <ColorSwatch key={t.var} name={t.name} cssVar={t.var} />)}
      </div>
    </div>
  );
}

/* ─── States Tab ─── */
const ALL_MODES: VRFMode[] = ['cool', 'heat', 'fan', 'dry', 'auto'];
const ALL_FAN: FanSpeed[] = ['off', 'low', 'med', 'high', 'auto'];
const ALL_LANGS: Language[] = ['en', 'de', 'tr', 'pt', 'ar', 'ru', 'es', 'it', 'fr'];

function StatesTab() {
  const { settings, updateSettings } = useController();
  const { t } = useTranslation();

  const toggles = [
    { label: 'Power', key: 'isOn', value: settings.isOn },
    { label: 'Connected', key: 'isConnected', value: settings.isConnected },
    { label: 'Error', key: 'hasError', value: settings.hasError },
    { label: 'WiFi', key: 'wifiConnected', value: settings.wifiConnected },
    { label: 'Cloud', key: 'cloudConnected', value: settings.cloudConnected },
    { label: 'Dark', key: 'darkTheme', value: settings.darkTheme },
    { label: 'Schedule', key: 'schedulingEnabled', value: settings.schedulingEnabled },
    { label: 'Swing', key: 'swingEnabled', value: settings.swingEnabled },
    { label: 'BT', key: 'bluetoothConnected', value: settings.bluetoothConnected },
    { label: 'PRO', key: 'bmsLicenseValid', value: settings.bmsLicenseValid },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Boolean Toggles */}
      <div>
        <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">Toggles</div>
        <div className="grid grid-cols-5 gap-1">
          {toggles.map(({ label, key, value }) => (
            <button
              key={key}
              onClick={() => updateSettings({ [key]: !value } as any)}
              className={`py-2 rounded-lg text-[10px] font-medium transition-all ${
                value ? 'bg-app-action text-white' : 'bg-app-control text-app-text-sub'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">Mode</div>
        <div className="flex gap-1">
          {ALL_MODES.map(m => (
            <button
              key={m}
              onClick={() => updateSettings({ mode: m })}
              className={`flex-1 py-2 rounded-lg text-[10px] font-medium capitalize ${
                settings.mode === m ? 'bg-app-action text-white' : 'bg-app-control text-app-text-sub'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Fan */}
      <div>
        <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">Fan</div>
        <div className="flex gap-1">
          {ALL_FAN.map(f => (
            <button
              key={f}
              onClick={() => updateSettings({ fanSpeed: f })}
              className={`flex-1 py-2 rounded-lg text-[10px] font-medium capitalize ${
                settings.fanSpeed === f ? 'bg-app-action text-white' : 'bg-app-control text-app-text-sub'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">Language</div>
        <div className="grid grid-cols-5 gap-1">
          {ALL_LANGS.map(l => (
            <button
              key={l}
              onClick={() => updateSettings({ language: l })}
              className={`py-2 rounded-lg text-[10px] font-medium uppercase ${
                settings.language === l ? 'bg-app-action text-white' : 'bg-app-control text-app-text-sub'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div>
        <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">Target Temp: {settings.targetTemp}°C</div>
        <input
          type="range"
          min={16}
          max={32}
          step={settings.tempStep}
          value={settings.targetTemp}
          onChange={e => updateSettings({ targetTemp: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}

/* ─── Plural Test Tab ─── */
function PluralTab() {
  const plural = usePlural();
  const { lang } = useTranslation();
  const [count, setCount] = useState(1);

  const examples = [
    { one: '{n} entry', other: '{n} entries', few: '{n} entries', many: '{n} entries', zero: 'No entries' },
    { one: '{n} device', other: '{n} devices', few: '{n} devices', many: '{n} devices' },
    { one: '{n} day', other: '{n} days', few: '{n} days', many: '{n} days' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] font-semibold text-app-text-dim uppercase tracking-wider mb-2">
          Count: {count} | Lang: {lang.toUpperCase()}
        </div>
        <input
          type="range" min={0} max={125} value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        {examples.map((forms, i) => (
          <div key={i} className="bg-app-card rounded-lg p-3">
            <div className="text-xs text-app-text font-medium">
              {plural(count, forms)}
            </div>
            <div className="text-[10px] text-app-text-hint mt-1">
              one: "{forms.one}" | other: "{forms.other}"
            </div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-app-text-hint">
        Test with n=0,1,2,3,5,11,21,101 to see plural form differences across languages.
      </div>
    </div>
  );
}

/* ─── Main DevPanel ─── */
const DEV_PASSWORD = '1331';

export function DevPanel() {
  const [tab, setTab] = useState<Tab>('states');
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!unlocked) {
    return (
      <PinPad
        correctPassword={DEV_PASSWORD}
        onSuccess={() => setUnlocked(true)}
        onBack={() => navigate('/home')}
        title="Dev Panel"
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Monitor }[] = [
    { id: 'states', label: 'States', icon: Monitor },
    { id: 'palette', label: 'Palette', icon: Palette },
    { id: 'plural', label: 'Plural', icon: Gauge },
  ];

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text">Dev Panel</h1>
        <div className="w-9" />
      </div>

      {/* Tab Bar */}
      <div className="flex bg-app-header border-b border-app-line px-2 py-1.5 gap-1 flex-shrink-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-medium transition-all ${
              tab === id ? 'bg-app-action/15 text-app-action' : 'text-app-text-hint'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {tab === 'states' && <StatesTab />}
        {tab === 'palette' && (
          <div>
            <ColorSection title="Surface" tokens={SURFACE_TOKENS} />
            <ColorSection title="Text" tokens={TEXT_TOKENS} />
            <ColorSection title="Action / Status" tokens={ACTION_TOKENS} />
            <ColorSection title="VRF Modes" tokens={MODE_TOKENS} />
            <ColorSection title="Brand" tokens={BRAND_TOKENS} />
            <ColorSection title="Gauge" tokens={GAUGE_TOKENS} />
          </div>
        )}
        {tab === 'plural' && <PluralTab />}
      </div>
    </div>
  );
}