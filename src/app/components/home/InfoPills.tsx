import { useController } from '../../context/ControllerContext';
import { Droplets } from 'lucide-react';
import { displayTemp } from '../../utils/temperature';

export function InfoPills() {
  const { settings } = useController();

  if (!settings.isOn) return null;

  return (
    <div className="flex items-center justify-center gap-3 flex-shrink-0">
      {/* Temperature pill */}
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: 36,
          borderRadius: 9999,
          background: 'var(--pill-bg)',
          border: '1px solid var(--pill-border)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 12.26V5.5a3.5 3.5 0 0 0-7 0v6.76a5.5 5.5 0 1 0 7 0Z" style={{ stroke: 'var(--app-text-sub)' }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="16.5" r="2.5" style={{ fill: 'var(--app-text-hint)' }} />
          <path d="M12 16.5V7.5" style={{ stroke: 'var(--app-text-hint)' }} strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="text-[15px] font-light font-display text-app-text-sub">
          {displayTemp(settings.currentTemp, settings.temperatureUnit)}&deg;
        </span>
      </div>

      {/* Humidity pill */}
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: 36,
          borderRadius: 9999,
          background: 'var(--pill-bg)',
          border: '1px solid var(--pill-border)',
        }}
      >
        <Droplets className="w-4 h-4" style={{ color: 'var(--app-action)' }} />
        <span className="text-[15px] font-light font-display text-app-text-sub">
          {settings.currentHumidity}%
        </span>
      </div>
    </div>
  );
}
