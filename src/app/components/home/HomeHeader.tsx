import { useController } from '../../context/ControllerContext';
import { Smartphone } from 'lucide-react';

/* ─── H3 "Monoline" ───
   Ultra minimal — no background fill, just content floating
   on the page bg with a single thin hairline at the bottom.
   Airy, breathable, maximum content space feel.
*/

function AiroLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M 4 12 Q 16 8, 28 12 Q 40 16, 52 12" style={{ stroke: 'var(--brand-cyan)' }} strokeWidth="5" strokeLinecap="round"/>
      <path d="M 4 28 Q 16 24, 28 28 Q 40 32, 52 28" style={{ stroke: 'var(--brand-sky)' }} strokeWidth="5" strokeLinecap="round"/>
      <path d="M 4 44 Q 16 40, 28 44 Q 40 48, 52 44" style={{ stroke: 'var(--brand-blue)' }} strokeWidth="5" strokeLinecap="round"/>
      <path d="M 45 12 L 54 12 L 50 8 M 54 12 L 50 16" style={{ stroke: 'var(--brand-cyan)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 45 28 L 54 28 L 50 24 M 54 28 L 50 32" style={{ stroke: 'var(--brand-sky)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 45 44 L 54 44 L 50 40 M 54 44 L 50 48" style={{ stroke: 'var(--brand-blue)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WifiIcon({ connected }: { connected: boolean }) {
  if (!connected) return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--app-text-disabled)' }}>
      <path d="M2.45 9.45A13.5 13.5 0 0 1 21.55 9.45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <path d="M5.28 12.28A9.5 9.5 0 0 1 18.72 12.28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.3"/>
      <path d="M5 5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--app-text-hint)' }}>
      <path d="M2.45 9.45A13.5 13.5 0 0 1 21.55 9.45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5.28 12.28A9.5 9.5 0 0 1 18.72 12.28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function HomeHeader({ onSettings }: { onSettings: () => void }) {
  const { settings } = useController();

  return (
    <div
      className="flex-shrink-0 flex items-center justify-between px-4"
      style={{
        height: 50,
        borderBottom: '1px solid var(--app-line)',
      }}
    >
      {/* Left: logo + name — lightweight */}
      <div className="flex items-center gap-2">
        <AiroLogo size={18} />
        <span
          className="text-sm text-app-text"
          style={{ fontWeight: 500, letterSpacing: '0.01em' }}
        >
          {settings.deviceName}
        </span>
      </div>

      {/* Right: minimal icon row — no backgrounds, just glyphs */}
      <div className="flex items-center gap-2">
        {settings.cloudConnected && (
          <div className="w-7 h-7 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--app-text-hint)' }}>
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {settings.bluetoothEnabled && settings.bluetoothConnected && (
          <div className="w-7 h-7 flex items-center justify-center">
            <Smartphone className="w-[18px] h-[18px]" style={{ color: 'var(--app-text-hint)' }} />
          </div>
        )}

        <div className="w-7 h-7 flex items-center justify-center -mt-[2px]">
          <WifiIcon connected={settings.wifiConnected} />
        </div>

        {/* Thin divider */}
        <div className="w-px h-4 mx-1" style={{ background: 'var(--app-line)' }} />

        {/* Settings — ghost button, no bg */}
        <button
          onClick={onSettings}
          className="w-8 h-8 -mr-1 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-app-text-sub">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}