import { useState } from 'react';
import { useController, WeatherCondition } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { useNavigate } from 'react-router';
import { ArrowLeft, Cloud, CloudRain, CloudSnow, Wind, CloudFog, Sun, CloudSun, Droplets, CloudLightning, Gauge, ShieldCheck, Home, TreePine, Thermometer } from 'lucide-react';
import { displayTemp } from '../utils/temperature';

const WEATHER_CONDITIONS: WeatherCondition[] = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'stormy', 'snowy', 'windy', 'foggy'];

const CONDITION_COLORS: Record<WeatherCondition, string> = {
  sunny: '#f59e0b',
  cloudy: '#6b7280',
  rainy: '#3b82f6',
  snowy: '#93c5fd',
  windy: '#06b6d4',
  stormy: '#9333ea',
  foggy: '#9ca3af',
  'partly-cloudy': '#f97316',
};

const CONDITION_GRADIENTS: Record<WeatherCondition, { light: string; dark: string }> = {
  sunny: {
    light: 'linear-gradient(135deg, #fef9c330 0%, #fde68a40 40%, #fbbf2450 100%)',
    dark: 'linear-gradient(135deg, #42200630 0%, #451a0340 50%, #78350f50 100%)',
  },
  cloudy: {
    light: 'linear-gradient(135deg, #f8fafc30 0%, #e2e8f040 50%, #cbd5e150 100%)',
    dark: 'linear-gradient(135deg, #1f293730 0%, #1f293740 50%, #37415150 100%)',
  },
  rainy: {
    light: 'linear-gradient(135deg, #dbeafe30 0%, #93c5fd40 50%, #60a5fa50 100%)',
    dark: 'linear-gradient(135deg, #0c192930 0%, #17255440 50%, #1e3a5f50 100%)',
  },
  snowy: {
    light: 'linear-gradient(135deg, #f0f9ff30 0%, #e0f2fe40 50%, #bae6fd50 100%)',
    dark: 'linear-gradient(135deg, #1e293b30 0%, #1e3a5f40 50%, #134e4a50 100%)',
  },
  windy: {
    light: 'linear-gradient(135deg, #ecfeff30 0%, #a5f3fc40 50%, #67e8f950 100%)',
    dark: 'linear-gradient(135deg, #134e4a30 0%, #164e6340 50%, #17255450 100%)',
  },
  stormy: {
    light: 'linear-gradient(135deg, #f3e8ff30 0%, #d8b4fe40 50%, #c084fc50 100%)',
    dark: 'linear-gradient(135deg, #2e106530 0%, #3b076440 50%, #4c1d9550 100%)',
  },
  foggy: {
    light: 'linear-gradient(135deg, #f9fafb30 0%, #e5e7eb40 50%, #d1d5db50 100%)',
    dark: 'linear-gradient(135deg, #1f293730 0%, #1f293740 50%, #37415150 100%)',
  },
  'partly-cloudy': {
    light: 'linear-gradient(135deg, #ffedd530 0%, #fdba7440 50%, #fb923c50 100%)',
    dark: 'linear-gradient(135deg, #43140730 0%, #7c2d1240 50%, #9a341250 100%)',
  },
};

const CONDITION_I18N_KEYS: Record<WeatherCondition, string> = {
  sunny: 'weather.sunny',
  'partly-cloudy': 'weather.partly_cloudy',
  cloudy: 'weather.cloudy',
  rainy: 'weather.rainy',
  stormy: 'weather.stormy',
  snowy: 'weather.snowy',
  windy: 'weather.windy',
  foggy: 'weather.foggy',
};

function WeatherIcon({ condition }: { condition: WeatherCondition }) {
  const iconProps = { strokeWidth: 1.5 };
  const cls = "w-14 h-14";
  switch (condition) {
    case 'sunny': return <Sun {...iconProps} className={`${cls} text-yellow-500`} />;
    case 'cloudy': return <Cloud {...iconProps} className={`${cls} text-app-text-dim`} />;
    case 'rainy': return <CloudRain {...iconProps} className={`${cls} text-app-info`} />;
    case 'snowy': return <CloudSnow {...iconProps} className={`${cls} text-mode-dry`} />;
    case 'windy': return <Wind {...iconProps} className={`${cls} text-cyan-500`} />;
    case 'stormy': return <CloudLightning {...iconProps} className={`${cls} text-purple-600 dark:text-purple-400`} />;
    case 'foggy': return <CloudFog {...iconProps} className={`${cls} text-app-text-hint`} />;
    case 'partly-cloudy': return <CloudSun {...iconProps} className={`${cls} text-orange-500`} />;
  }
}

export function Weather() {
  const { settings } = useController();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const weather = settings.weatherData;
  const [currentCondition, setCurrentCondition] = useState<WeatherCondition>(weather.condition);

  const isDark = settings.darkTheme;

  const cycleWeather = () => {
    const currentIndex = WEATHER_CONDITIONS.indexOf(currentCondition);
    setCurrentCondition(WEATHER_CONDITIONS[(currentIndex + 1) % WEATHER_CONDITIONS.length]);
  };

  const conditionColor = CONDITION_COLORS[currentCondition];
  const gradient = CONDITION_GRADIENTS[currentCondition];

  const heroText = isDark ? 'text-white' : 'text-gray-800';
  const heroSub = isDark ? 'text-white/60' : 'text-gray-700/70';

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-bg border-b border-app-line/40 flex-shrink-0">
        <button
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">{t('weather.title')}</h1>
      </div>

      {/* Content — 430px available */}
      <div className="flex-1 flex flex-col px-4 py-3 gap-3 min-h-0">

        {/* Hero card — Frosted Glass */}
        <div
          onClick={cycleWeather}
          className="relative rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] overflow-hidden border border-white/20 dark:border-white/10"
          style={{ background: isDark ? gradient.dark : gradient.light }}
        >
          {/* Accent glow — subtle */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 85% 25%, ${conditionColor}18 0%, transparent 50%)` }}
          />
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 bg-white/30 dark:bg-black/25 backdrop-blur-sm pointer-events-none" />

          {/* Main hero content */}
          <div className="relative z-10 flex items-center justify-between p-4 pb-3">
            <div>
              <div className={`text-[10px] ${heroSub} uppercase tracking-widest mb-1`}>
                {t('weather.title')}
              </div>
              <div className={`text-5xl font-extralight ${heroText} leading-none font-display`}>
                {displayTemp(weather.outdoorTemp, settings.temperatureUnit)}&deg;
              </div>
              <div className={`text-sm ${heroSub} capitalize mt-1.5 font-medium`}>
                {t(CONDITION_I18N_KEYS[currentCondition])}
              </div>
              <div className={`text-xs ${heroSub} mt-1`}>
                {t('weather.feels_like')} <span className={`text-sm font-light ${heroText} ml-0.5 font-display`}>{displayTemp(weather.feelsLike, settings.temperatureUnit)}&deg;</span>
              </div>
            </div>
            <div className="drop-shadow-xl" style={{ filter: `drop-shadow(0 0 12px ${conditionColor}60)` }}>
              <WeatherIcon condition={currentCondition} />
            </div>
          </div>

          {/* Embedded gauge bars — roomier */}
          <div className="relative z-10 px-4 pb-3 pt-0 space-y-3">
            {/* Temperature gauge */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Thermometer className={`w-3.5 h-3.5 ${heroSub}`} />
                  <span className={`text-[10px] ${heroSub} uppercase tracking-wider`}>{t('weather.temperature')}</span>
                </div>
                <span className={`text-[10px] ${heroSub} font-medium`}>
                  {(() => {
                    const diff = settings.currentTemp - weather.outdoorTemp;
                    return diff > 0 ? `▲${diff}°` : diff < 0 ? `▼${Math.abs(diff)}°` : '—';
                  })()}
                </span>
              </div>
              <div className="relative h-7 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                {(() => {
                  const minT = Math.min(settings.currentTemp, weather.outdoorTemp) - 5;
                  const maxT = Math.max(settings.currentTemp, weather.outdoorTemp) + 5;
                  const range = maxT - minT || 1;
                  const indoorPos = ((settings.currentTemp - minT) / range) * 100;
                  const outdoorPos = ((weather.outdoorTemp - minT) / range) * 100;
                  return (
                    <>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${Math.max(14, Math.min(86, indoorPos))}%` }}>
                        <div className="bg-amber-500 text-white text-[11px] font-medium rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                          <Home className="w-3 h-3" />
                          {displayTemp(settings.currentTemp, settings.temperatureUnit)}&deg;
                        </div>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${Math.max(14, Math.min(86, outdoorPos))}%` }}>
                        <div className="bg-sky-500 text-white text-[11px] font-medium rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                          <TreePine className="w-3 h-3" />
                          {displayTemp(weather.outdoorTemp, settings.temperatureUnit)}&deg;
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Humidity gauge */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Droplets className={`w-3.5 h-3.5 ${heroSub}`} />
                  <span className={`text-[10px] ${heroSub} uppercase tracking-wider`}>{t('weather.humidity')}</span>
                </div>
                <span className={`text-[10px] ${heroSub} font-medium`}>
                  {(() => {
                    const diff = settings.currentHumidity - weather.outdoorHumidity;
                    return diff > 0 ? `▲${diff}%` : diff < 0 ? `▼${Math.abs(diff)}%` : '—';
                  })()}
                </span>
              </div>
              <div className="relative h-7 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                {(() => {
                  const minH = Math.min(settings.currentHumidity, weather.outdoorHumidity) - 10;
                  const maxH = Math.max(settings.currentHumidity, weather.outdoorHumidity) + 10;
                  const range = maxH - minH || 1;
                  const indoorPos = ((settings.currentHumidity - minH) / range) * 100;
                  const outdoorPos = ((weather.outdoorHumidity - minH) / range) * 100;
                  return (
                    <>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${Math.max(14, Math.min(86, indoorPos))}%` }}>
                        <div className="bg-amber-500 text-white text-[11px] font-medium rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                          <Home className="w-3 h-3" />
                          {settings.currentHumidity}%
                        </div>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${Math.max(14, Math.min(86, outdoorPos))}%` }}>
                        <div className="bg-sky-500 text-white text-[11px] font-medium rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                          <TreePine className="w-3 h-3" />
                          {weather.outdoorHumidity}%
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid 2×2 — fills remaining space */}
        <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
          {/* Humidity */}
          <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 flex flex-col justify-center">
            <div className="absolute -right-3 -bottom-3 opacity-[0.06]">
              <Droplets className="w-14 h-14 text-blue-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-app-action/15 rounded-lg">
                  <Droplets className="w-4 h-4 text-app-action" />
                </div>
                <span className="text-[10px] text-app-text-sub uppercase tracking-wider">{t('weather.humidity')}</span>
              </div>
              <div className="text-xl font-light text-app-text font-display">{weather.outdoorHumidity}<span className="text-sm ml-0.5">%</span></div>
            </div>
          </div>

          {/* Wind */}
          <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/40 dark:to-cyan-900/30 flex flex-col justify-center">
            <div className="absolute -right-3 -bottom-3 opacity-[0.06]">
              <Wind className="w-14 h-14 text-cyan-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-cyan-500/15 rounded-lg">
                  <Wind className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-[10px] text-app-text-sub uppercase tracking-wider">{t('weather.wind')}</span>
              </div>
              <div className="text-xl font-light text-app-text font-display">{weather.windSpeed} <span className="text-sm">km/h</span></div>
            </div>
          </div>

          {/* UV Index */}
          <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30 flex flex-col justify-center">
            <div className="absolute -right-3 -bottom-3 opacity-[0.06]">
              <ShieldCheck className="w-14 h-14 text-amber-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-amber-500/15 rounded-lg">
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-[10px] text-app-text-sub uppercase tracking-wider">UV</span>
              </div>
              <div className="text-xl font-light text-app-text font-display">{weather.uvIndex}</div>
            </div>
          </div>

          {/* Pressure */}
          <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30 flex flex-col justify-center">
            <div className="absolute -right-3 -bottom-3 opacity-[0.06]">
              <Gauge className="w-14 h-14 text-violet-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-violet-500/15 rounded-lg">
                  <Gauge className="w-4 h-4 text-violet-500" />
                </div>
                <span className="text-[10px] text-app-text-sub uppercase tracking-wider">{t('weather.pressure' as any)}</span>
              </div>
              <div className="text-xl font-light text-app-text font-display">{weather.pressure} <span className="text-sm">hPa</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}