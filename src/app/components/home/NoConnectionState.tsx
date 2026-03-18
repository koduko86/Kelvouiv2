import { useController } from '../../context/ControllerContext';
import { useTranslation } from '../../context/i18n';
import { RefreshCw } from 'lucide-react';

const RADIUS = 86;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = CIRCUMFERENCE * 0.75;
const GAP_LENGTH = CIRCUMFERENCE * 0.25;
const TRACK_DASH = `${ARC_LENGTH} ${GAP_LENGTH}`;
const DANGER_ARC = `${CIRCUMFERENCE * 0.03} ${CIRCUMFERENCE * 0.97}`;

export function NoConnectionState() {
  const { updateSettings } = useController();
  const { t } = useTranslation();

  return (
    <div className="text-center relative w-full">
      <div className="relative flex items-center justify-center mx-auto" style={{ width: '186px', height: '186px' }}>
        <svg className="absolute inset-0" width="186" height="186" viewBox="0 0 186 186">
          <circle
            cx="93" cy="93" r={RADIUS}
            fill="none"
            style={{ stroke: 'var(--gauge-track)' }}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={TRACK_DASH}
            transform="rotate(135 93 93)"
          />
          <circle
            cx="93" cy="93" r={RADIUS}
            fill="none"
            style={{ stroke: 'var(--app-danger)' }}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.25"
            strokeDasharray={DANGER_ARC}
            transform="rotate(135 93 93)"
          />
        </svg>

        <div
          className="absolute rounded-full"
          style={{ width: '144px', height: '144px', background: 'var(--gauge-inner)' }}
        />

        <div
          className="absolute rounded-full"
          style={{ width: '80px', height: '80px', background: 'radial-gradient(circle, color-mix(in srgb, var(--app-danger) 10%, transparent) 0%, transparent 70%)' }}
        />

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative flex flex-col items-center">
            <div className="relative" style={{ width: '72px', height: '72px' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <rect x="8" y="18" width="56" height="30" rx="5" style={{ stroke: 'var(--app-text-hint)' }} strokeWidth="2.5" fill="none" />
                <path d="M20 28h32" style={{ stroke: 'var(--app-text-hint)' }} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M20 35h32" style={{ stroke: 'var(--app-text-hint)' }} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <circle cx="54" cy="40" r="2" style={{ fill: 'var(--app-text-disabled)' }} />
                <path d="M16 48 Q36 56 56 48" style={{ stroke: 'var(--app-text-hint)' }} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
                <circle cx="36" cy="36" r="32" style={{ stroke: 'var(--app-danger)' }} strokeWidth="2.5" fill="none" opacity="0.25" />
                <line x1="13" y1="13" x2="59" y2="59" style={{ stroke: 'var(--app-danger)' }} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
              </svg>
            </div>

            <div
              className="text-[10px] uppercase tracking-widest text-center text-app-danger/80"
              style={{ marginTop: '6px', fontWeight: 700 }}
            >
              {t('home.no_connection')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1.5 flex flex-col items-center">
        <span className="text-[10px] text-app-text-hint uppercase tracking-widest">
          {t('home.check_vrf')}
        </span>
      </div>

      <button
        onClick={() => updateSettings({ isConnected: true })}
        className="mt-3 mx-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-action/15 border border-app-action/25 text-app-action hover:bg-app-action/25 transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="text-xs font-semibold">{t('home.try_connect')}</span>
      </button>
    </div>
  );
}
