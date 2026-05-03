import {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  useController,
  VRFMode,
  FanSpeed,
} from "../context/ControllerContext";
import { useTranslation } from "../context/i18n";
import { useNavigate } from "react-router";
import {
  AirVent,
  CalendarClock,
  CloudSun,
  Snowflake,
  Flame,
  Fan,
  Droplet,
  Droplets,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { AutoModeIcon } from "../components/AutoModeIcon";
import { displayTemp } from "../utils/temperature";
import { HomeBackground } from "../components/home/HomeBackground";

/* ══════════════════════════════════════════════════════════
   Home2 — Reimagined main screen
   Style: "Glass Ambient" — large floating temp, glassmorphic panels
   ══════════════════════════════════════════════════════════ */

const MODE_MAP: Record<VRFMode, string> = {
  cool: "var(--mode-cool)",
  heat: "var(--mode-heat)",
  fan: "var(--mode-fan)",
  dry: "var(--mode-dry)",
  auto: "var(--mode-auto)",
};

const MODE_ICONS: Record<VRFMode, any> = {
  cool: Snowflake,
  heat: Flame,
  fan: Fan,
  dry: Droplet,
  auto: AutoModeIcon,
};

const FAN_LABELS: Record<FanSpeed, string> = {
  off: "—",
  low: "L",
  med: "M",
  high: "H",
  auto: "A",
};

/* ─── Gauge ─── */
const R = 100;
const C = 2 * Math.PI * R;
const ARC = C * 0.7;
const GAP = C * 0.3;
const MIN_T = 16;
const MAX_T = 32;
const RANGE = MAX_T - MIN_T;
const D2R = Math.PI / 180;

function AiroLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
    >
      <path
        d="M 4 12 Q 16 8, 28 12 Q 40 16, 52 12"
        style={{ stroke: "var(--brand-cyan)" }}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 4 28 Q 16 24, 28 28 Q 40 32, 52 28"
        style={{ stroke: "var(--brand-sky)" }}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 4 44 Q 16 40, 28 44 Q 40 48, 52 44"
        style={{ stroke: "var(--brand-blue)" }}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 45 12 L 54 12 L 50 8 M 54 12 L 50 16"
        style={{ stroke: "var(--brand-cyan)" }}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 45 28 L 54 28 L 50 24 M 54 28 L 50 32"
        style={{ stroke: "var(--brand-sky)" }}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 45 44 L 54 44 L 50 40 M 54 44 L 50 48"
        style={{ stroke: "var(--brand-blue)" }}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WifiIcon({ connected }: { connected: boolean }) {
  if (!connected)
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: "var(--app-text-disabled)" }}
      >
        <path
          d="M2.45 9.45A13.5 13.5 0 0 1 21.55 9.45"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M5.28 12.28A9.5 9.5 0 0 1 18.72 12.28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle
          cx="12"
          cy="18"
          r="1.5"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M5 5L19 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: "var(--h2-text-sub)" }}
    >
      <path
        d="M2.45 9.45A13.5 13.5 0 0 1 21.55 9.45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5.28 12.28A9.5 9.5 0 0 1 18.72 12.28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="18"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Home() {
  const { settings, updateSettings } = useController();
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

  const goWeather = useCallback(
    () => settings.isConnected && navigate("/weather"),
    [settings.isConnected, navigate],
  );
  const goParams = useCallback(
    () => settings.isConnected && navigate("/parameters"),
    [settings.isConnected, navigate],
  );
  const goSchedule = useCallback(
    () => settings.isConnected && navigate("/schedule"),
    [settings.isConnected, navigate],
  );
  const goSettings = useCallback(
    () =>
      navigate(
        settings.settingsLockEnabled
          ? "/password"
          : "/settings",
      ),
    [settings.settingsLockEnabled, navigate],
  );

  const { isConnected, isOn, hasError } = settings;
  const isDark = settings.darkTheme;
  const shadowSm = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.08)"
    : "0 2px 12px rgba(0,0,0,0.04)";
  const shadowMd = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.10)"
    : "0 4px 24px rgba(0,0,0,0.04)";
  const shadowLg = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.12)"
    : "0 4px 20px rgba(0,0,0,0.06)";
  const knobShadow = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 1px rgba(255,255,255,0.14)"
    : "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 12px rgba(0,0,0,0.04)";
  const actionBg = isDark ? "rgba(125,211,252,0.18)" : "rgba(59,130,246,0.12)";
  const actionBorder = isDark ? "rgba(125,211,252,0.32)" : "rgba(59,130,246,0.2)";
  const scheduleActive =
    isConnected && settings.schedulingEnabled;

  const modeColor = !isOn
    ? "var(--h2-off)"
    : hasError
      ? "var(--app-danger)"
      : MODE_MAP[settings.mode];
  const ModeIcon = MODE_ICONS[settings.mode];

  const gaugeData = useMemo(() => {
    const progress = isOn
      ? (settings.targetTemp - MIN_T) / RANGE
      : 0;
    const activeLen = ARC * progress;
    const dash = `${activeLen} ${C - activeLen}`;
    const angle = 144 + progress * 252;
    const rad = angle * D2R;
    const kx = 110 + R * Math.cos(rad);
    const ky = 110 + R * Math.sin(rad);
    return { progress, dash, kx, ky };
  }, [isOn, settings.targetTemp]);

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={
        (isDark
          ? {
              "--h2-bg": "#0B1020",
              "--h2-surface": "rgba(255,255,255,0.08)",
              "--h2-surface-border": "rgba(255,255,255,0.16)",
              "--h2-text": "#F3F4F6",
              "--h2-text-sub": "#CBD5E1",
              "--h2-text-hint": "#94A3B8",
              "--h2-text-dim": "#64748B",
              "--h2-off": "#94A3B8",
              "--h2-track": "rgba(255,255,255,0.18)",
              "--h2-inner": "rgba(255,255,255,0.06)",
              "--h2-line": "rgba(255,255,255,0.14)",
              background: "var(--h2-bg)",
            }
          : {
              "--h2-bg": "#F0F2F6",
              "--h2-surface": "rgba(255,255,255,0.65)",
              "--h2-surface-border": "rgba(255,255,255,0.45)",
              "--h2-text": "#111827",
              "--h2-text-sub": "#4B5563",
              "--h2-text-hint": "#6B7280",
              "--h2-text-dim": "#9CA3AF",
              "--h2-off": "#9CA3AF",
              "--h2-track": "#D1D5DB",
              "--h2-inner": "rgba(255,255,255,0.7)",
              "--h2-line": "rgba(0,0,0,0.06)",
              background: "var(--h2-bg)",
            }) as React.CSSProperties
      }
    >
      {/* ── Background style from settings ── */}
      <HomeBackground style={settings.backgroundStyle} dark={isDark} />

      {/* ── Ambient glow based on mode ── */}
      {isConnected && isOn && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute rounded-full transition-all duration-1000"
            style={{
              width: 300,
              height: 300,
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              background: `radial-gradient(circle, ${modeColor} 0%, transparent 70%)`,
              opacity: 0.12,
              filter: "blur(40px)",
            }}
          />
        </div>
      )}

      {/* ══ HEADER — 50px ══ */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 relative z-10"
        style={{
          height: 50,
          borderBottom: "1px solid var(--h2-line)",
        }}
      >
        <div className="flex items-center gap-2">
          <AiroLogo size={18} />
          <span
            className="text-sm"
            style={{
              color: "var(--h2-text)",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            {settings.deviceName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {settings.cloudConnected && (
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "var(--h2-text-sub)" }}
              >
                <path
                  d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {settings.bluetoothEnabled &&
            settings.bluetoothConnected && (
              <div className="w-6 h-6 flex items-center justify-center">
                <Smartphone
                  className="w-[18px] h-[18px]"
                  style={{ color: "var(--h2-text-sub)" }}
                  strokeWidth={2}
                />
              </div>
            )}
          <WifiIcon connected={settings.wifiConnected} />
          <div
            className="w-px h-4 mx-0.5"
            style={{ background: "var(--h2-line)" }}
          />
          <button
            onClick={goSettings}
            className="w-8 h-8 -mr-1 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: "transparent" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "var(--h2-text-sub)" }}
            >
              <circle
                cx="12"
                cy="5"
                r="1.5"
                fill="currentColor"
              />
              <circle
                cx="12"
                cy="12"
                r="1.5"
                fill="currentColor"
              />
              <circle
                cx="12"
                cy="19"
                r="1.5"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="flex-1 flex flex-col items-center relative z-[1] min-h-0 overflow-hidden">
        {!isConnected ? (
          /* ── No Connection ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div
              className="w-full rounded-3xl flex flex-col items-center py-8 px-6"
              style={{
                background: "var(--h2-surface)",
                border: "1px solid var(--h2-surface-border)",
                backdropFilter: "blur(12px)",
                boxShadow: shadowMd,
              }}
            >
              <div style={{ width: 64, height: 64 }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 72 72"
                  fill="none"
                >
                  <rect
                    x="8"
                    y="18"
                    width="56"
                    height="30"
                    rx="5"
                    style={{ stroke: "var(--h2-text-hint)" }}
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d="M20 28h32"
                    style={{ stroke: "var(--h2-text-hint)" }}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <path
                    d="M20 35h32"
                    style={{ stroke: "var(--h2-text-hint)" }}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <circle
                    cx="54"
                    cy="40"
                    r="2"
                    style={{ fill: "var(--h2-text-dim)" }}
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="32"
                    style={{ stroke: "var(--app-danger)" }}
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.25"
                  />
                  <line
                    x1="13"
                    y1="13"
                    x2="59"
                    y2="59"
                    style={{ stroke: "var(--app-danger)" }}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </svg>
              </div>
              <div
                className="text-[11px] uppercase tracking-widest text-center mt-3"
                style={{
                  color: "var(--app-danger)",
                  fontWeight: 700,
                }}
              >
                {t("home.no_connection")}
              </div>
              <div
                className="text-[10px] uppercase tracking-widest text-center mt-1.5"
                style={{ color: "var(--h2-text-hint)" }}
              >
                {t("home.check_vrf")}
              </div>
              <button
                onClick={() =>
                  updateSettings({ isConnected: true })
                }
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all"
                style={{
                  background: actionBg,
                  border: `1px solid ${actionBorder}`,
                  color: "var(--app-action)",
                }}
              >
                <RefreshCw className="w-4 h-4" />
                <span
                  className="text-xs"
                  style={{ fontWeight: 600 }}
                >
                  {t("home.try_connect")}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Mode / Fan / Swing — rectangular pill, above gauge ── */}
            {isOn && (
              <div
                className="flex items-center justify-center gap-5 mx-auto px-6 flex-shrink-0 cursor-pointer mt-4"
                onClick={goParams}
                style={{
                  height: 44,
                  borderRadius: 14,
                  background: "var(--h2-surface)",
                  border: "1px solid var(--h2-surface-border)",
                  backdropFilter: "blur(10px)",
                  boxShadow: shadowSm,
                }}
              >
                {/* Mode */}
                <ModeIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: modeColor,
                  }}
                  strokeWidth={1.8}
                />
                <div
                  className="w-px h-4"
                  style={{ background: "var(--h2-track)" }}
                />
                {/* Fan */}
                <div className="flex items-center gap-1.5">
                  <Fan
                    className="w-5 h-5"
                    style={{ color: "#0ea5e9" }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--h2-text-sub)",
                      fontWeight: 600,
                    }}
                  >
                    {FAN_LABELS[settings.fanSpeed]}
                  </span>
                </div>
                <div
                  className="w-px h-4"
                  style={{ background: "var(--h2-track)" }}
                />
                {/* Swing */}
                <div className="flex items-center gap-1">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    {settings.swingEnabled ? (
                      <>
                        <rect
                          x="4"
                          y="3"
                          width="16"
                          height="3.5"
                          rx="1.5"
                          fill="#10b981"
                        />
                        <path
                          d="M 8 18 C 8 12, 16 12, 16 8"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </>
                    ) : (
                      <>
                        <rect
                          x="4"
                          y="3"
                          width="16"
                          height="3.5"
                          rx="1.5"
                          fill="var(--h2-text-dim)"
                        />
                        <line
                          x1="12"
                          y1="8"
                          x2="12"
                          y2="20"
                          stroke="var(--h2-text-dim)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </>
                    )}
                  </svg>
                  {settings.swingEnabled && (
                    <span
                      className="text-[10px]"
                      style={{
                        color: "#10b981",
                        fontWeight: 700,
                      }}
                    >
                      {settings.swingAngle}°
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── Central gauge area ── */}
            <div
              className="flex-1 flex items-center justify-center min-h-0"
              style={{ marginTop: 16 }}
            >
              <div
                className="relative"
                style={{ width: 220, height: 220 }}
              >
                {/* Gauge SVG */}
                <svg
                  className="absolute inset-0"
                  width="220"
                  height="220"
                  viewBox="0 0 220 220"
                  overflow="visible"
                >
                  <defs>
                    <linearGradient
                      id="h2-arc-g"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: modeColor,
                          stopOpacity: 0.8,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: modeColor,
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                    <filter id="h2-glow">
                      <feGaussianBlur
                        stdDeviation="3"
                        result="blur"
                      />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Track */}
                  <circle
                    cx="110"
                    cy="110"
                    r={R}
                    fill="none"
                    style={{ stroke: "var(--h2-track)" }}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${ARC} ${GAP}`}
                    transform="rotate(144 110 110)"
                  />

                  {/* Active arc */}
                  <circle
                    cx="110"
                    cy="110"
                    r={R}
                    fill="none"
                    stroke="url(#h2-arc-g)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={gaugeData.dash}
                    className="transition-all duration-700 ease-out"
                    transform="rotate(144 110 110)"
                    opacity={isOn ? 1 : 0}
                    filter={isOn ? "url(#h2-glow)" : undefined}
                  />

                  {/* Knob */}
                  {isOn && (
                    <>
                      <circle
                        cx={gaugeData.kx}
                        cy={gaugeData.ky}
                        r="10"
                        fill="white"
                        stroke="var(--h2-track)"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={gaugeData.kx}
                        cy={gaugeData.ky}
                        r="4.5"
                        style={{ fill: modeColor }}
                      />
                    </>
                  )}
                </svg>

                {/* Inner glass circle */}
                <div
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    width: 160,
                    height: 160,
                    top: 30,
                    left: 30,
                    background: "var(--h2-inner)",
                    backdropFilter: "blur(8px)",
                    border:
                      "1px solid var(--h2-surface-border)",
                    boxShadow:
                      knobShadow,
                  }}
                >
                  {!isOn ? (
                    <div className="flex flex-col items-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mb-1"
                      >
                        <path
                          d="M12 2v10"
                          stroke="var(--h2-text-dim)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18.36 6.64A9 9 0 1 1 5.64 6.64"
                          stroke="var(--h2-text-dim)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div
                        className="text-3xl tracking-tight leading-none font-display"
                        style={{
                          color: "var(--h2-text-dim)",
                          fontWeight: 300,
                        }}
                      >
                        {t("home.off_label")}
                      </div>
                      <div
                        className="text-[10px] uppercase tracking-widest mt-2"
                        style={{ color: "var(--h2-text-dim)" }}
                      >
                        {t("home.standby")}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div
                        className={`text-5xl tracking-tighter leading-none font-display ${fadeIn ? "animate-[fadeScaleIn_0.8s_ease-out]" : ""}`}
                        style={{
                          color: modeColor,
                          fontWeight: 200,
                        }}
                      >
                        {displayTemp(
                          settings.targetTemp,
                          settings.temperatureUnit,
                        )}
                        &deg;
                      </div>
                      {hasError ? (
                        <div
                          className="flex flex-col items-center mt-2"
                          style={{ gap: 2 }}
                        >
                          <div
                            className="text-[10px] uppercase tracking-widest"
                            style={{
                              color: "var(--app-danger)",
                              fontWeight: 500,
                            }}
                          >
                            {t("home.error")}
                          </div>
                          {settings.errorCode && (
                            <div
                              className="text-[11px] tracking-wider"
                              style={{
                                color: "var(--app-danger)",
                                opacity: 0.7,
                                fontWeight: 600,
                              }}
                            >
                              Err {settings.errorCode}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="text-[10px] uppercase tracking-widest mt-2.5"
                          style={{
                            color: "var(--h2-text-hint)",
                            fontWeight: 400,
                          }}
                        >
                          {t("home.target")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Live readings — rectangular pill, below gauge ── */}
            {isOn && (
              <div
                className="flex flex-col items-center flex-shrink-0"
                style={{ marginBottom: 8 }}
              >
                <span
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{
                    color: "var(--h2-text-hint)",
                    fontWeight: 400,
                  }}
                >
                  {t("home.current")}
                </span>
                <div
                  className="flex items-center justify-center gap-4 mx-auto px-6"
                  style={{
                    height: 40,
                    borderRadius: 14,
                    background: "var(--h2-surface)",
                    border:
                      "1px solid var(--h2-surface-border)",
                    backdropFilter: "blur(10px)",
                    boxShadow: shadowSm,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M15.5 12.26V5.5a3.5 3.5 0 0 0-7 0v6.76a5.5 5.5 0 1 0 7 0Z"
                        style={{ stroke: "var(--h2-text-sub)" }}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="16.5"
                        r="2.5"
                        style={{ fill: "var(--h2-text-hint)" }}
                      />
                      <path
                        d="M12 16.5V7.5"
                        style={{
                          stroke: "var(--h2-text-hint)",
                        }}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className="text-sm font-display"
                      style={{
                        color: "var(--h2-text-sub)",
                        fontWeight: 300,
                      }}
                    >
                      {displayTemp(
                        settings.currentTemp,
                        settings.temperatureUnit,
                      )}
                      &deg;
                    </span>
                  </div>
                  <div
                    className="w-px h-3.5"
                    style={{ background: "var(--h2-track)" }}
                  />
                  <div className="flex items-center gap-1.5">
                    <Droplets
                      className="w-[18px] h-[18px]"
                      style={{ color: "var(--app-action)" }}
                    />
                    <span
                      className="text-sm font-display"
                      style={{
                        color: "var(--h2-text-sub)",
                        fontWeight: 300,
                      }}
                    >
                      {settings.currentHumidity}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* HW buttons hint */}
      {isConnected && (
        <div
          className="text-center text-[10px] mb-1.5 relative z-[1]"
          style={{ color: "var(--h2-text-hint)" }}
        >
          {t("home.hw_buttons")}
        </div>
      )}

      {/* ══ BOTTOM NAV — floating glassmorphic bar ══ */}
      <div className="px-4 pb-3 flex-shrink-0 relative z-[1]">
        <div
          className="flex items-center justify-around rounded-2xl"
          style={{
            height: 56,
            background: "var(--h2-surface)",
            border: "1px solid var(--h2-surface-border)",
            backdropFilter: "blur(12px)",
            boxShadow: shadowLg,
          }}
        >
          <NavItem
            onClick={goWeather}
            disabled={!isConnected}
            icon={<CloudSun className="w-5 h-5" />}
            label={t("home.weather")}
          />
          <NavItem
            onClick={goParams}
            disabled={!isConnected}
            icon={<AirVent className="w-5 h-5" />}
            label={t("home.parameters")}
          />
          <NavItem
            onClick={goSchedule}
            disabled={!isConnected}
            active={scheduleActive}
            icon={<CalendarClock className="w-5 h-5" />}
            label={t("home.schedule")}
          />
        </div>
      </div>
    </div>
  );
}

function NavItem({
  onClick,
  disabled,
  active,
  icon,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all"
      style={{
        opacity: disabled ? 0.35 : 1,
        color: active
          ? "var(--app-action)"
          : "var(--h2-text-sub)",
      }}
    >
      {icon}
      <span
        className="text-[10px]"
        style={{ fontWeight: active ? 600 : 500 }}
      >
        {label}
      </span>
    </button>
  );
}

export default Home;