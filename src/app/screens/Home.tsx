import { useCallback, useRef, useEffect, useState } from 'react';
import { useController } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { useNavigate } from 'react-router';
import { AirVent, CalendarClock, CloudSun, CalendarDays } from 'lucide-react';
import { HomeHeader } from '../components/home/HomeHeader';
import { StatusBar } from '../components/home/StatusBar';
import { TemperatureGauge } from '../components/home/TemperatureGauge';
import { NoConnectionState } from '../components/home/NoConnectionState';
import { ActionButton } from '../components/home/ActionButton';
import { InfoPills } from '../components/home/InfoPills';
import { HomeBackground } from '../components/home/HomeBackground';

/* ─── S2 "Frost" — cool neutral modern palette ─── */
const S2_VARS: Record<string, string> = {
  '--app-bg': '#F9FAFB',
  '--app-header': '#F3F4F6',
  '--app-panel': '#F3F4F6',
  '--app-control': '#E5E7EB',
  '--app-hover': '#D1D5DB',
  '--app-line': '#E5E7EB',
  '--app-border': '#D1D5DB',
  '--app-text': '#111827',
  '--app-text-sub': '#374151',
  '--app-text-hint': '#6B7280',
  '--app-text-dim': '#9CA3AF',
  '--app-text-disabled': '#D1D5DB',
  '--app-action': '#3B82F6',
  '--app-action-hover': '#2563EB',
  '--gauge-track': '#E5E7EB',
  '--gauge-inner': '#F9FAFB',
  '--gauge-knob': '#F3F4F6',
  '--pill-bg': '#F3F4F6',
  '--pill-border': '#E5E7EB',
};

export function Home() {
  const { settings } = useController();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const prevIsOnRef = useRef(settings.isOn);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (settings.isOn && !prevIsOnRef.current) {
      setFadeIn(true);
      const timer = setTimeout(() => setFadeIn(false), 800);
      return () => clearTimeout(timer);
    }
    prevIsOnRef.current = settings.isOn;
  }, [settings.isOn]);

  const goWeather = useCallback(() => settings.isConnected && navigate('/weather'), [settings.isConnected, navigate]);
  const goParams = useCallback(() => settings.isConnected && navigate('/parameters'), [settings.isConnected, navigate]);
  const goSchedule = useCallback(() => settings.isConnected && navigate('/schedule'), [settings.isConnected, navigate]);
  const goSettings = useCallback(() => navigate(settings.settingsLockEnabled ? '/password' : '/settings'), [settings.settingsLockEnabled, navigate]);

  const { isConnected, isOn } = settings;
  const scheduleActive = isConnected && settings.schedulingEnabled;

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ ...S2_VARS, background: 'var(--app-bg)' } as React.CSSProperties}
    >
      <HomeBackground style={settings.backgroundStyle} dark={settings.darkTheme} />
      <HomeHeader onSettings={goSettings} />

      {/* Schedule indicator — floating top-right below header */}
      {scheduleActive && (
        <div className="absolute right-4 top-[58px] z-10 cursor-pointer" onClick={goSchedule}>
          <CalendarDays className="w-7 h-7 text-app-action" />
        </div>
      )}

      {/* Info Pills — current readings at top */}
      {isConnected && isOn && (
        <div className="flex-shrink-0 mt-4">
          <InfoPills />
        </div>
      )}

      {/* Content — gauge centered, StatusBar below gauge */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0 relative overflow-hidden">
        {!isConnected ? (
          <NoConnectionState />
        ) : (
          <>
            <TemperatureGauge fadeIn={fadeIn} />
            <div style={{ marginTop: -8, opacity: isOn ? 1 : 0.4, pointerEvents: isOn ? 'auto' : 'none' }}>
              <StatusBar onTap={goParams} />
            </div>
          </>
        )}
      </div>

      {/* HW buttons hint */}
      {isConnected && (
        <div className="text-center text-[10px] text-app-text-hint mb-2">
          {t('home.hw_buttons')}
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="px-4 pb-3 flex-shrink-0 relative z-[1]">
        <div className="grid grid-cols-3 gap-2">
          <ActionButton
            onClick={goWeather}
            disabled={!isConnected}
            icon={<CloudSun className="w-5 h-5 text-app-text-sub" />}
            label={t('home.weather')}
          />
          <ActionButton
            onClick={goParams}
            disabled={!isConnected}
            icon={<AirVent className="w-5 h-5 text-app-text-sub" />}
            label={t('home.parameters')}
          />
          <ActionButton
            onClick={goSchedule}
            disabled={!isConnected}
            active={scheduleActive}
            icon={<CalendarClock className={`w-5 h-5 ${scheduleActive ? 'text-white' : 'text-app-text-sub'}`} />}
            label={t('home.schedule')}
          />
        </div>
      </div>
    </div>
  );
}