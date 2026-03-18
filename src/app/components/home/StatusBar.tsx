import { useController, VRFMode, FanSpeed } from '../../context/ControllerContext';
import { Snowflake, Flame, Fan, Droplet } from 'lucide-react';
import { AutoModeIcon } from '../AutoModeIcon';

const MODE_ICONS: Record<VRFMode, any> = {
  cool: Snowflake, heat: Flame, fan: Fan, dry: Droplet, auto: AutoModeIcon,
};

const MODE_MAP: Record<VRFMode, string> = {
  cool: 'var(--mode-cool)', heat: 'var(--mode-heat)',
  fan: 'var(--mode-fan)', dry: 'var(--mode-dry)', auto: 'var(--mode-auto)',
};

const FAN_COLOR = '#0ea5e9';
const SWING_ON_COLOR = '#10b981';

function FanBars({ speed, color }: { speed: FanSpeed; color: string }) {
  if (speed === 'off') {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" opacity="0.4" />
        <line x1="7.5" y1="12" x2="16.5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }
  if (speed === 'auto') {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2.2" fill="none" />
        <text x="12" y="16.5" textAnchor="middle" fill={color} fontSize="13" fontWeight="800" fontFamily="sans-serif">A</text>
      </svg>
    );
  }

  const bars = speed === 'low' ? [true, false, false]
    : speed === 'med' ? [true, true, false]
    : [true, true, true]; // high

  const dim = `color-mix(in srgb, ${color} 25%, transparent)`;

  return (
    <div className="flex items-end" style={{ gap: 4, height: 30 }}>
      <div className="rounded-sm" style={{ width: 6, height: 9, backgroundColor: bars[0] ? color : dim }} />
      <div className="rounded-sm" style={{ width: 6, height: 19, backgroundColor: bars[1] ? color : dim }} />
      <div className="rounded-sm" style={{ width: 6, height: 30, backgroundColor: bars[2] ? color : dim }} />
    </div>
  );
}

function SwingIcon({ enabled, angle, color }: { enabled: boolean; angle: number; color: string }) {
  if (!enabled) {
    return (
      <div className="relative">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          {/* Üst bar */}
          <rect x="3" y="3" width="18" height="4" rx="2" fill={color} />
          {/* Düz dikey çizgi */}
          <line x1="12" y1="9" x2="12" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Çapraz slash */}
          <line x1="7" y1="19" x2="17" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="relative">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        {/* Üst bar */}
        <rect x="3" y="3" width="18" height="4" rx="2" fill={color} />
        {/* Kıvrımlı ok */}
        <path d="M 8 20 C 8 14, 16 14, 16 10" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 13.5 10.5 L 16 10 L 15.5 12.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {/* Angle badge */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          bottom: -5,
          right: -7,
          width: 22,
          height: 17,
          borderRadius: 9,
          backgroundColor: color,
          fontSize: 10,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1,
        }}
      >
        {angle}°
      </div>
    </div>
  );
}

export function StatusBar({ onTap }: { onTap: () => void }) {
  const { settings } = useController();
  const modeCssVar = MODE_MAP[settings.mode];
  const ModeIcon = MODE_ICONS[settings.mode];
  const swingColor = settings.swingEnabled ? SWING_ON_COLOR : 'var(--app-text-disabled)';

  return (
    <div
      onClick={onTap}
      className="relative z-10 flex items-center justify-center cursor-pointer"
      style={{ margin: '6px 4px 12px' }}
    >
      <div
        className="flex items-center px-6"
        style={{
          height: 48,
          gap: 25,
          borderRadius: 9999,
          background: 'var(--pill-bg)',
          border: '1px solid var(--pill-border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Mode */}
        <ModeIcon
          style={{ width: 28, height: 28, color: modeCssVar }}
          strokeWidth={1.8}
        />

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'var(--pill-border)' }} />

        {/* Fan */}
        <FanBars speed={settings.fanSpeed} color={FAN_COLOR} />

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'var(--pill-border)' }} />

        {/* Swing */}
        <SwingIcon enabled={settings.swingEnabled} angle={settings.swingAngle} color={swingColor} />
      </div>
    </div>
  );
}