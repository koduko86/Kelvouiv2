import { useMemo } from 'react';
import { useController, VRFMode } from '../../context/ControllerContext';
import { useTranslation } from '../../context/i18n';
import { displayTemp } from '../../utils/temperature';

/* ─── Static gauge constants ─── */
const RADIUS = 86;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = CIRCUMFERENCE * 0.75;
const GAP_LENGTH = CIRCUMFERENCE * 0.25;
const TRACK_DASH = `${ARC_LENGTH} ${GAP_LENGTH}`;
const MIN_TEMP = 16;
const MAX_TEMP = 32;
const TEMP_RANGE = MAX_TEMP - MIN_TEMP;
const DEG_TO_RAD = Math.PI / 180;

const MODE_MAP: Record<VRFMode, string> = {
  cool: 'var(--mode-cool)', heat: 'var(--mode-heat)',
  fan: 'var(--mode-fan)', dry: 'var(--mode-dry)', auto: 'var(--mode-auto)',
};

export function TemperatureGauge({ fadeIn }: { fadeIn: boolean }) {
  const { settings } = useController();
  const { t } = useTranslation();

  const modeCssVar = MODE_MAP[settings.mode];
  const displayColor = !settings.isOn
    ? 'var(--app-off)'
    : settings.hasError
      ? 'var(--app-danger)'
      : modeCssVar;

  const gaugeData = useMemo(() => {
    const progress = settings.isOn ? (settings.targetTemp - MIN_TEMP) / TEMP_RANGE : 0;
    const activeLength = ARC_LENGTH * progress;
    const activeDash = `${activeLength} ${CIRCUMFERENCE - activeLength}`;
    const angle = 135 + progress * 270;
    const rad = angle * DEG_TO_RAD;
    const knobX = 93 + RADIUS * Math.cos(rad);
    const knobY = 93 + RADIUS * Math.sin(rad);
    return { progress, activeDash, knobX, knobY };
  }, [settings.isOn, settings.targetTemp]);

  const { isOn, hasError } = settings;

  return (
    <div className="text-center relative w-full">
      {/* Temperature Gauge */}
      <div className="relative flex items-center justify-center mx-auto" style={{ width: '186px', height: '186px' }}>
        <svg className="absolute inset-0" width="186" height="186" viewBox="0 0 186 186" overflow="visible">
          <defs>
            <linearGradient id={`arc-g-${settings.mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: displayColor, stopOpacity: 0.85 }} />
              <stop offset="100%" style={{ stopColor: displayColor, stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx="93" cy="93" r={RADIUS}
            fill="none"
            style={{ stroke: 'var(--gauge-track)' }}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={TRACK_DASH}
            transform="rotate(135 93 93)"
          />

          {/* Active arc */}
          <circle
            cx="93" cy="93" r={RADIUS}
            fill="none"
            stroke={`url(#arc-g-${settings.mode})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={gaugeData.activeDash}
            className="transition-all duration-700 ease-out"
            transform="rotate(135 93 93)"
            opacity={isOn ? 0.95 : 0}
          />

          {/* Knob */}
          {isOn && (
            <>
              <circle cx={gaugeData.knobX} cy={gaugeData.knobY} r="10" fill="none" stroke="var(--gauge-track)" strokeWidth="1" opacity="0.6" />
              <circle cx={gaugeData.knobX} cy={gaugeData.knobY} r="8.4" fill="white" stroke="var(--app-text-dim)" strokeWidth="1.6" />
              <circle cx={gaugeData.knobX} cy={gaugeData.knobY} r="4.2" style={{ fill: displayColor }} />
            </>
          )}
        </svg>

        {/* Inner circle */}
        <div
          className="absolute rounded-full"
          style={{ width: '144px', height: '144px', background: 'var(--gauge-inner)' }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative flex flex-col items-center">
            {!isOn ? (
              <>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mb-1">
                  <path d="M12 2v10" stroke="var(--app-text-disabled)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" stroke="var(--app-text-disabled)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="text-3xl tracking-tight leading-none transition-all duration-500 text-app-text-disabled font-display" style={{ fontWeight: 300 }}>
                  {t('home.off_label')}
                </div>
                <div className="text-[10px] text-app-text-disabled uppercase tracking-widest" style={{ marginTop: '8px' }}>
                  {t('home.standby')}
                </div>
              </>
            ) : (
              <>
                <div
                  className={`text-5xl tracking-tighter leading-none transition-all duration-500 font-display ${fadeIn ? 'animate-[fadeScaleIn_0.8s_ease-out]' : ''}`}
                  style={{ color: displayColor, fontWeight: 200 }}
                >
                  {displayTemp(settings.targetTemp, settings.temperatureUnit)}&deg;
                </div>
                {hasError ? (
                  <div className="flex flex-col items-center" style={{ marginTop: '8px', gap: '3px' }}>
                    <div className="text-[10px] uppercase tracking-widest text-app-danger" style={{ fontWeight: 500 }}>
                      {t('home.error')}
                    </div>
                    {settings.errorCode && (
                      <div className="text-[11px] tracking-wider text-app-danger/70" style={{ fontWeight: 600, fontFamily: 'var(--font-family-base)' }}>
                        Err {settings.errorCode}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[10px] text-app-text-hint uppercase tracking-widest text-center" style={{ marginTop: '10px', fontWeight: 400 }}>
                    {t('home.target')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}