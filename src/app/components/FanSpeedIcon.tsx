import type { FanSpeed } from '../context/ControllerContext';

export function FanSpeedIcon({ speed, isActive }: { speed: FanSpeed; isActive: boolean }) {
  const activeBar = isActive ? 'bg-white' : 'bg-app-text-label';
  const inactiveBar = isActive ? 'bg-white/40' : 'bg-app-border';

  switch (speed) {
    case 'off':
      return (
        <div className="flex items-center justify-center w-6 h-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={isActive ? 'stroke-white' : 'stroke-app-text-label'} />
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={isActive ? 'stroke-white' : 'stroke-app-text-label'} />
          </svg>
        </div>
      );
    case 'low':
      return (
        <div className="flex items-end justify-center gap-0.5 w-6 h-6">
          <div className={`w-1.5 h-2 rounded-full ${activeBar}`} />
          <div className={`w-1.5 h-3.5 rounded-full ${inactiveBar}`} />
          <div className={`w-1.5 h-5 rounded-full ${inactiveBar}`} />
        </div>
      );
    case 'med':
      return (
        <div className="flex items-end justify-center gap-0.5 w-6 h-6">
          <div className={`w-1.5 h-2 rounded-full ${activeBar}`} />
          <div className={`w-1.5 h-3.5 rounded-full ${activeBar}`} />
          <div className={`w-1.5 h-5 rounded-full ${inactiveBar}`} />
        </div>
      );
    case 'high':
      return (
        <div className="flex items-end justify-center gap-0.5 w-6 h-6">
          <div className={`w-1.5 h-2 rounded-full ${activeBar}`} />
          <div className={`w-1.5 h-3.5 rounded-full ${activeBar}`} />
          <div className={`w-1.5 h-5 rounded-full ${activeBar}`} />
        </div>
      );
    case 'auto':
      return (
        <div className="flex items-center justify-center w-6 h-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" fill="none" className={isActive ? 'stroke-white' : 'stroke-app-text-label'} />
            <text x="12" y="16.5" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="800" fontFamily="sans-serif" className={isActive ? 'fill-white' : 'fill-app-text-label'}>A</text>
          </svg>
        </div>
      );
  }
}