import { BackgroundStyle } from '../../context/ControllerContext';

interface Props {
  style: BackgroundStyle;
  dark?: boolean;
}

export function HomeBackground({ style, dark }: Props) {
  if (style === 'none') return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {style === 'aurora' && <Aurora dark={dark} />}
      {style === 'waves' && <Waves dark={dark} />}
      {style === 'gradient' && <Gradient dark={dark} />}
      {style === 'mesh' && <Mesh dark={dark} />}
      {style === 'circles' && <Circles dark={dark} />}
    </div>
  );
}

/* ─── Aurora: soft colorful blobs ─── */
function Aurora({ dark }: { dark?: boolean }) {
  const o = dark ? 0.18 : 0.25;
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 480" preserveAspectRatio="none">
      <defs>
        <filter id="au-blur"><feGaussianBlur stdDeviation="60" /></filter>
      </defs>
      <ellipse cx="80" cy="160" rx="180" ry="140" fill="#60a5fa" opacity={o} filter="url(#au-blur)" />
      <ellipse cx="260" cy="320" rx="160" ry="120" fill="#a78bfa" opacity={o * 0.8} filter="url(#au-blur)" />
      <ellipse cx="160" cy="420" rx="200" ry="100" fill="#34d399" opacity={o * 0.6} filter="url(#au-blur)" />
    </svg>
  );
}

/* ─── Waves: layered flowing curves ─── */
function Waves({ dark }: { dark?: boolean }) {
  const o = dark ? 0.12 : 0.18;
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 480" preserveAspectRatio="none">
      <path d="M0 320 Q80 280 160 310 T320 290 V480 H0 Z" fill="#60a5fa" opacity={o} />
      <path d="M0 360 Q80 330 160 350 T320 340 V480 H0 Z" fill="#818cf8" opacity={o * 0.9} />
      <path d="M0 400 Q80 370 160 390 T320 380 V480 H0 Z" fill="#a78bfa" opacity={o * 0.7} />
      <path d="M0 200 Q100 170 200 195 T320 180 V240 Q200 260 100 240 T0 250 Z" fill="#60a5fa" opacity={o * 0.4} />
    </svg>
  );
}

/* ─── Gradient: elegant radial gradient ─── */
function Gradient({ dark }: { dark?: boolean }) {
  const o = dark ? 0.2 : 0.3;
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 480" preserveAspectRatio="none">
      <defs>
        <radialGradient id="gr-main" cx="30%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={o} />
          <stop offset="50%" stopColor="#818cf8" stopOpacity={o * 0.5} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-sec" cx="80%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity={o * 0.6} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="480" fill="url(#gr-main)" />
      <rect width="320" height="480" fill="url(#gr-sec)" />
    </svg>
  );
}

/* ─── Mesh: geometric mesh pattern ─── */
function Mesh({ dark }: { dark?: boolean }) {
  const o = dark ? 0.08 : 0.12;
  const stroke = dark ? '#60a5fa' : '#3b82f6';
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 480" preserveAspectRatio="none">
      <defs>
        <pattern id="mesh-p" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M0 0 L60 60 M60 0 L0 60" stroke={stroke} strokeWidth="0.5" opacity={o} />
          <rect width="60" height="60" fill="none" stroke={stroke} strokeWidth="0.3" opacity={o * 0.6} />
        </pattern>
        <radialGradient id="mesh-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={dark ? 0.15 : 0.2} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="480" fill="url(#mesh-p)" />
      <rect width="320" height="480" fill="url(#mesh-glow)" />
    </svg>
  );
}

/* ─── Circles: concentric soft rings ─── */
function Circles({ dark }: { dark?: boolean }) {
  const o = dark ? 0.1 : 0.15;
  const color = '#60a5fa';
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 480" preserveAspectRatio="none">
      <defs>
        <radialGradient id="ci-glow" cx="50%" cy="42%" r="45%">
          <stop offset="0%" stopColor={color} stopOpacity={o * 0.8} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="480" fill="url(#ci-glow)" />
      {[70, 120, 170, 220].map((r) => (
        <circle key={r} cx="160" cy="200" r={r} fill="none" stroke={color} strokeWidth="0.8" opacity={o * (1 - r / 300)} />
      ))}
      {[50, 90, 130].map((r) => (
        <circle key={`b${r}`} cx="260" cy="400" r={r} fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity={o * 0.5 * (1 - r / 200)} />
      ))}
    </svg>
  );
}
