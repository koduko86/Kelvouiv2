import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../context/i18n';
import svgPaths from '../../imports/svg-qqskaanaam';

function BootLogo() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="i">
      <style>{`
        @keyframes waveShift1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        @keyframes waveShift2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-8px); }
        }
        @keyframes waveShift3 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
      `}</style>
      <svg className="absolute block size-full" fill="none" viewBox="0 0 64 64">
        <g id="i">
          <g style={{ animation: 'waveShift1 2s ease-in-out infinite' }}>
            <path d={svgPaths.p1c8597e0} stroke="white" strokeLinecap="round" strokeWidth="3.84" />
            <path d={svgPaths.p3af07800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          </g>
          <g style={{ animation: 'waveShift2 2s ease-in-out infinite 0.3s' }}>
            <path d={svgPaths.p3e491580} stroke="#E0F2FE" strokeLinecap="round" strokeWidth="3.84" />
            <path d={svgPaths.p2d04d400} stroke="#E0F2FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          </g>
          <g style={{ animation: 'waveShift3 2s ease-in-out infinite 0.6s' }}>
            <path d={svgPaths.p1a1753c0} stroke="#BFDBFE" strokeLinecap="round" strokeWidth="3.84" />
            <path d={svgPaths.p1af07700} stroke="#BFDBFE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function BootScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 1;
      });
    }, 100);

    const timer = setTimeout(() => navigate('/home'), 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="h-full w-full bg-brand-bg flex flex-col items-center justify-center relative overflow-hidden">
      <p className="absolute top-3 text-[11px] text-brand-text-sub/60 tracking-[0.5px]">
        airolabs.com
      </p>

      <div className="relative z-10 flex flex-col items-center -translate-y-[40%]">
        <div className="flex items-center gap-[12px] mb-6">
          <BootLogo />
          <div className="h-[72px] relative">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[72px] not-italic text-[48px] text-white tracking-[-0.96px] whitespace-nowrap">
              Airo&deg;
            </p>
          </div>
        </div>

        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic text-brand-cyan text-[20px] text-center whitespace-nowrap mb-2">
          {t('boot.tagline')}
        </p>

        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic text-brand-text-sub text-[14px] text-center tracking-[1.4px] whitespace-nowrap">
          {t('boot.slogan')}
        </p>
      </div>

      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-3 px-12">
        <p className="text-xs text-brand-cyan font-medium tracking-wide mb-1">
          {t('boot.initializing')}
        </p>
        <div className="w-full max-w-[280px] h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, var(--brand-cyan), var(--brand-sky))`
            }}
          />
        </div>
      </div>
    </div>
  );
}