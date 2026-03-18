import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../context/i18n';
import { Upload, RotateCcw, XCircle, Smartphone, Wifi } from 'lucide-react';

type FwState = 'waiting' | 'uploading' | 'completed' | 'restarting';

export function FirmwareUpload() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState<FwState>('waiting');
  const [progress, setProgress] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  /* Simulate upload arriving from mobile app after 5s */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state === 'waiting') setState('uploading');
    }, 5000);
    return () => clearTimeout(timer);
  }, [state]);

  /* Simulate upload progress */
  useEffect(() => {
    if (state !== 'uploading') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setState('completed');
          return 100;
        }
        return prev + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [state]);

  /* After completed, show restart warning */
  useEffect(() => {
    if (state !== 'completed') return;
    const timer = setTimeout(() => setState('restarting'), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleExitMode = useCallback(() => {
    if (state === 'uploading') return; // Can't exit during upload
    setShowExitConfirm(true);
  }, [state]);

  const confirmExit = useCallback(() => {
    setShowExitConfirm(false);
    navigate('/home');
  }, [navigate]);

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <h1 className="text-sm font-semibold text-app-text">{t('fw.title')}</h1>
      </div>

      {/* Main content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
        {/* Icon area */}
        <div className="relative mb-6">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${
            state === 'waiting'
              ? 'bg-app-action/10 border-2 border-dashed border-app-action/30'
              : state === 'uploading'
                ? 'bg-amber-500/10 border-2 border-amber-500/30'
                : state === 'completed'
                  ? 'bg-app-success/10 border-2 border-app-success/30'
                  : 'bg-app-danger/10 border-2 border-app-danger/30'
          }`}>
            {state === 'waiting' && (
              <div className="flex flex-col items-center gap-1">
                <Smartphone className="w-10 h-10 text-app-action animate-pulse" />
                <Wifi className="w-5 h-5 text-app-action/60" />
              </div>
            )}
            {state === 'uploading' && (
              <div className="relative">
                <Upload className="w-10 h-10 text-amber-400" />
                {/* Progress ring */}
                <svg className="absolute -inset-4" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="var(--app-line)" strokeWidth="3" />
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none" stroke="#f59e0b" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${175.9 * progress / 100} ${175.9 * (1 - progress / 100)}`}
                    transform="rotate(-90 32 32)"
                    className="transition-all duration-200"
                  />
                </svg>
              </div>
            )}
            {state === 'completed' && (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="3" />
                <path d="M15 24L22 31L33 17" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {state === 'restarting' && (
              <RotateCcw className="w-10 h-10 text-app-danger animate-spin" />
            )}
          </div>
        </div>

        {/* Status text */}
        <div className="text-center mb-4">
          <h2 className="text-base font-semibold text-app-text mb-2">{t('fw.mode')}</h2>
          <p className={`text-xs leading-relaxed ${
            state === 'restarting' ? 'text-app-danger' : 'text-app-text-dim'
          }`}>
            {state === 'waiting' && t('fw.waiting')}
            {state === 'uploading' && `${t('fw.uploading')} ${progress}%`}
            {state === 'completed' && t('fw.completed')}
            {state === 'restarting' && t('fw.restart_msg')}
          </p>
        </div>

        {/* Progress bar (only during upload) */}
        {state === 'uploading' && (
          <div className="w-full max-w-[240px] mb-6">
            <div className="h-1.5 rounded-full bg-app-control overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Pulsing dot animation for waiting */}
        {state === 'waiting' && (
          <div className="flex items-center gap-1.5 mb-6">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-app-action"
                style={{
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>
        )}

        {/* Firmware info card */}
        <div className="w-full max-w-[260px] bg-app-panel rounded-xl border border-app-line p-3.5 mb-4">
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-app-text-hint">{t('fw.version')}</span>
              <span className="text-app-text font-mono">v2.1.0-beta</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-app-text-hint">{t('fw.size')}</span>
              <span className="text-app-text font-mono">1.2 MB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-app-text-hint">{t('fw.protocol')}</span>
              <span className="text-app-text font-mono">BLE OTA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exit mode button — bottom */}
      {state !== 'restarting' && (
        <div className="px-6 pb-5 flex-shrink-0">
          <button
            onClick={handleExitMode}
            disabled={state === 'uploading'}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              state === 'uploading'
                ? 'bg-app-control text-app-text-disabled cursor-not-allowed'
                : 'bg-app-danger/10 border border-app-danger/20 text-app-danger hover:bg-app-danger/15'
            }`}
          >
            <XCircle className="w-4 h-4" />
            {t('fw.exit_mode')}
          </button>
        </div>
      )}

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-app-panel rounded-2xl p-5 mx-6 w-full max-w-[280px] border border-app-border">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-app-danger/15 flex items-center justify-center mb-3">
                <XCircle className="w-6 h-6 text-app-danger" />
              </div>
              <h3 className="font-semibold text-app-text mb-1">{t('fw.exit_mode')}</h3>
              <p className="text-xs text-app-text-dim mb-4">{t('fw.exit_confirm')}</p>
              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="py-2.5 rounded-xl bg-app-input-bg border border-app-border text-app-text-label text-sm font-medium hover:bg-app-hover transition-colors"
                >
                  {t('dialog.cancel')}
                </button>
                <button
                  onClick={confirmExit}
                  className="py-2.5 rounded-xl bg-app-danger text-white text-sm font-medium hover:bg-app-danger/90 transition-colors"
                >
                  {t('fw.exit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restart overlay */}
      {state === 'restarting' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-app-panel rounded-2xl p-6 mx-6 w-full max-w-[280px] border border-app-border text-center">
            <RotateCcw className="w-10 h-10 text-app-warning mx-auto mb-3 animate-spin" />
            <h3 className="font-semibold text-app-text mb-2">{t('fw.restart_title')}</h3>
            <p className="text-xs text-app-text-dim leading-relaxed">{t('fw.restart_msg')}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}