import { useController, VRFMode, FanSpeed } from '../context/ControllerContext';
import { useNavigate } from 'react-router';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Snowflake, Flame, Fan, Droplet } from 'lucide-react';
import { FanSpeedIcon } from '../components/FanSpeedIcon';
import { AutoModeIcon } from '../components/AutoModeIcon';
import { SectionLabel } from '../components/SectionLabel';

const modes: { id: VRFMode; icon: any; cssVar: string }[] = [
  { id: 'cool', icon: Snowflake, cssVar: 'var(--mode-cool)' },
  { id: 'heat', icon: Flame, cssVar: 'var(--mode-heat)' },
  { id: 'fan', icon: Fan, cssVar: 'var(--mode-fan)' },
  { id: 'dry', icon: Droplet, cssVar: 'var(--mode-dry)' },
  { id: 'auto', icon: AutoModeIcon, cssVar: 'var(--mode-auto)' },
];

// Swing angles are now dynamic from settings.enabledSwingAngles

export function Parameters() {
  const { settings, updateSettings } = useController();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const SwingIcon = ({ enabled, isActive }: { enabled: boolean; isActive?: boolean }) => {
    const colorClass = isActive ? 'text-white' : 'text-app-text-label';
    if (enabled) {
      return (
        <div className="relative w-6 h-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={colorClass}>
            <rect x="3" y="3" width="18" height="4" rx="2" fill="currentColor"/>
            <path d="M 8 20 C 8 14, 16 14, 16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M 13.5 10.5 L 16 10 L 15.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      );
    }
    return (
      <div className="relative w-6 h-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={colorClass}>
          {/* Üst bar */}
          <rect x="3" y="3" width="18" height="4" rx="2" fill="currentColor"/>
          {/* Düz dikey çizgi */}
          <line x1="12" y1="9" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          {/* Çapraz slash */}
          <line x1="7" y1="19" x2="17" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="h-full bg-app-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">{t('home.parameters')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 pt-4 pb-3 justify-between">
        {/* Mode Section */}
        <div>
          <SectionLabel>{t('home.mode')}</SectionLabel>
            <div className="flex gap-1.5">
              {modes.map(({ id, icon: Icon, cssVar }) => (
                <button
                  key={id}
                  onClick={() => updateSettings({ mode: id })}
                  className={`flex-1 flex flex-col items-center justify-center py-3.5 rounded-xl transition-all relative min-w-0 border ${
                    settings.mode === id
                      ? 'text-white border-transparent'
                      : 'bg-app-control border-transparent text-app-text-dim'
                  }`}
                  style={settings.mode === id ? { backgroundColor: id === 'auto' ? 'var(--mode-auto-bg)' : cssVar } : {}}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 ${settings.mode === id ? 'text-white' : ''}`}
                    strokeWidth={1.5}
                    style={{ color: settings.mode === id ? undefined : cssVar }}
                  />
                  <span className={`text-[10px] font-medium capitalize leading-tight text-center break-words max-w-full px-0.5 ${settings.mode === id ? 'text-white/90' : 'text-app-text-sub'}`}>
                    {t(`mode.${id}` as any)}
                  </span>
                </button>
              ))}
            </div>
        </div>

        {/* Fan Speed Section */}
        <div>
          <SectionLabel>{t('home.fan')}</SectionLabel>
            <div className="flex gap-1.5">
              {settings.enabledFanSpeeds.map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ fanSpeed: speed })}
                  className={`flex-1 py-2.5 px-0.5 rounded-xl transition-all flex flex-col items-center justify-center gap-1 min-w-0 border ${
                    settings.fanSpeed === speed
                      ? 'bg-app-action text-white border-transparent'
                      : 'bg-app-control text-app-text-dim border-transparent'
                  }`}
                >
                  <FanSpeedIcon speed={speed} isActive={settings.fanSpeed === speed} />
                  <span className="text-[10px] font-medium uppercase leading-tight text-center break-words max-w-full">{t(`fan.${speed}` as any)}</span>
                </button>
              ))}
            </div>
        </div>

        {/* Swing Section */}
        <div>
          <SectionLabel>{t('home.swing')}</SectionLabel>
          <div className="bg-app-panel rounded-2xl p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ swingEnabled: true })}
                className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-3 border ${
                  settings.swingEnabled
                    ? 'bg-app-action text-white border-transparent'
                    : 'bg-app-control text-app-text-dim border-transparent'
                }`}
              >
                <SwingIcon enabled={true} isActive={settings.swingEnabled} />
                <span className="text-sm font-medium uppercase">{t('home.on')}</span>
              </button>
              <button
                onClick={() => updateSettings({ swingEnabled: false })}
                className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-3 border ${
                  !settings.swingEnabled
                    ? 'bg-app-action text-white border-transparent'
                    : 'bg-app-control text-app-text-dim border-transparent'
                }`}
              >
                <SwingIcon enabled={false} isActive={!settings.swingEnabled} />
                <span className="text-sm font-medium uppercase">{t('home.off')}</span>
              </button>
            </div>

            {/* Swing Angle - always visible, disabled when swing is OFF */}
            <div className="mt-2.5 pt-2.5 border-t border-app-line">
              <div className="text-[10px] font-semibold tracking-wide text-app-text-hint mb-1.5">{t('swing.angle' as any)}</div>
              <div className="flex gap-1.5">
                {(settings.enabledSwingAngles || [0, 30, 45, 60, 90]).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => settings.swingEnabled && updateSettings({ swingAngle: angle })}
                    disabled={!settings.swingEnabled}
                    className={`flex-1 py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 min-w-0 border ${
                      !settings.swingEnabled
                        ? 'bg-app-control/50 text-app-text-hint border-transparent opacity-40 cursor-not-allowed'
                        : settings.swingAngle === angle
                          ? 'bg-app-action text-white border-transparent'
                          : 'bg-app-control text-app-text-dim border-transparent'
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      {/* Bar */}
                      <rect x="4" y="2" width="16" height="3" rx="1.5" fill="currentColor"/>
                      {/* Curved arrow pointing at angle */}
                      {(() => {
                        const rad = angle * Math.PI / 180;
                        const len = 14;
                        const startX = 10;
                        const startY = 9;
                        const endX = startX + Math.sin(rad) * len;
                        const endY = startY + Math.cos(rad) * len;
                        const cpX = startX + Math.sin(rad) * 7 - Math.cos(rad) * 4;
                        const cpY = startY + Math.cos(rad) * 7 + Math.sin(rad) * 4;
                        const ax = endX - Math.sin(rad - 0.5) * 3.5;
                        const ay = endY - Math.cos(rad - 0.5) * 3.5;
                        const bx = endX - Math.sin(rad + 0.5) * 3.5;
                        const by = endY - Math.cos(rad + 0.5) * 3.5;
                        return (
                          <>
                            <path d={angle === 0 ? `M ${startX} ${startY} L ${startX} ${startY + len}` : `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                            <path d={`M ${ax} ${ay} L ${endX} ${endY} L ${bx} ${by}`} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </>
                        );
                      })()}
                    </svg>
                    <span className="text-[10px] font-medium">{angle}°</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}