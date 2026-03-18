import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useController } from '../context/ControllerContext';
import { useTranslation, type TranslationKey } from '../context/i18n';
import { displayTemp } from '../utils/temperature';
import svgPaths from '../../imports/svg-qqskaanaam';

const DAY_KEYS: TranslationKey[] = ['day.sun', 'day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat'];
const MONTH_KEYS: TranslationKey[] = ['month.jan', 'month.feb', 'month.mar', 'month.apr', 'month.may', 'month.jun', 'month.jul', 'month.aug', 'month.sep', 'month.oct', 'month.nov', 'month.dec'];

/** Offline screensaver: black screen with animated Airo logo */
function OfflineScreenSaver({ onTap, tapLabel }: { onTap: () => void; tapLabel: string }) {
  return (
    <div
      className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-pointer select-none"
      onClick={onTap}
    >
      {/* Burn-in prevention drift + ambient glow */}
      <style>{`
        @keyframes ssWave1 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
        @keyframes ssWave2 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-6px); } }
        @keyframes ssWave3 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
        @keyframes ssDriftX { 0%, 100% { transform: translateX(-20px); } 50% { transform: translateX(20px); } }
        @keyframes ssDriftY { 0%, 100% { transform: translateY(20px); } 50% { transform: translateY(-20px); } }
      `}</style>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ background: 'radial-gradient(circle at center, rgba(96,165,250,0.2) 0%, transparent 70%)' }}
      />

      <div
        className="relative z-10 flex flex-col items-center"
        style={{ animation: 'ssDriftX 30s ease-in-out infinite, ssDriftY 39s ease-in-out infinite' }}
      >
        {/* Animated Airo Logo */}
        <div className="relative shrink-0 w-16 h-16 mb-5">
          <svg className="absolute block w-full h-full" fill="none" viewBox="0 0 64 64">
            <g style={{ animation: 'ssWave1 3s ease-in-out infinite' }}>
              <path d={svgPaths.p1c8597e0} stroke="white" strokeLinecap="round" strokeWidth="3.84" />
              <path d={svgPaths.p3af07800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </g>
            <g style={{ animation: 'ssWave2 3s ease-in-out infinite 0.4s' }}>
              <path d={svgPaths.p3e491580} stroke="#E0F2FE" strokeLinecap="round" strokeWidth="3.84" />
              <path d={svgPaths.p2d04d400} stroke="#E0F2FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </g>
            <g style={{ animation: 'ssWave3 3s ease-in-out infinite 0.8s' }}>
              <path d={svgPaths.p1a1753c0} stroke="#BFDBFE" strokeLinecap="round" strokeWidth="3.84" />
              <path d={svgPaths.p1af07700} stroke="#BFDBFE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </g>
          </svg>
        </div>

        {/* Brand text */}
        <div className="text-[32px] font-bold text-white tracking-tight leading-none mb-1">
          Airo&deg;
        </div>
        <div className="text-sm font-medium text-white/40 tracking-[0.2em] uppercase">
          Kelvo
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 text-center">
        <div className="text-xs text-white/25 tracking-wide">
          {tapLabel}
        </div>
      </div>
    </div>
  );
}

export function ScreenSaver() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { settings } = useController();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWake = () => navigate('/home');

  /* ── Offline mode: no WiFi → minimal brand screensaver ── */
  if (!settings.wifiConnected) {
    return <OfflineScreenSaver onTap={handleWake} tapLabel={t('ss.tap_wake')} />;
  }

  /* ── Online mode: full clock + weather screensaver ── */
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');

  const dayName = t(DAY_KEYS[currentTime.getDay()]);
  const monthName = t(MONTH_KEYS[currentTime.getMonth()]);
  const date = currentTime.getDate();
  const year = currentTime.getFullYear();

  return (
    <div
      className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-pointer select-none"
      onClick={handleWake}
    >
      {/* Burn-in prevention drift */}
      <style>{`
        @keyframes ssDriftX { 0%, 100% { transform: translateX(-20px); } 50% { transform: translateX(20px); } }
        @keyframes ssDriftY { 0%, 100% { transform: translateY(20px); } 50% { transform: translateY(-20px); } }
      `}</style>
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)' }}
      />

      <div
        className="relative z-10 text-center"
        style={{ animation: 'ssDriftX 30s ease-in-out infinite, ssDriftY 39s ease-in-out infinite' }}
      >
        {/* Clock */}
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="relative">
              <span
                className="text-8xl font-extralight tracking-tight text-white font-display"
              >
                {hours}
                <span className="inline-block opacity-75">:</span>
                {minutes}
              </span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <div className="text-xl font-light text-white/75">
            {dayName}
          </div>
          <div className="text-base font-light text-white/60">
            {monthName} {date}, {year}
          </div>
        </div>

        {/* Current Temperature & Location */}
        <div className="mt-8 space-y-2">
          <div
            className="text-5xl font-extralight text-white/65 font-display"
          >
            {displayTemp(settings.currentTemp, settings.temperatureUnit)}&deg;
          </div>
          <div
            className="text-xs font-light text-white/50 tracking-widest uppercase"
          >
            {settings.city}
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 text-center">
        <div className="text-xs text-white/35 tracking-wide">
          {t('ss.tap_wake')}
        </div>
      </div>

      {/* Static gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(100,150,255,0.3) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(150,100,255,0.3) 0%, transparent 70%)' }}
      />
    </div>
  );
}