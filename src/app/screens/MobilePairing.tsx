import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useController } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Smartphone, Trash2, QrCode, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode';

export function MobilePairing() {
  const { settings, removeMobileDevice } = useController();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxDevices = 5;
  const connectedCount = settings.mobileDevices.length;

  useEffect(() => {
    if (showQR && canvasRef.current) {
      const pairingData = JSON.stringify({
        deviceId: 'VRF-AC-' + Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      });

      QRCode.toCanvas(canvasRef.current, pairingData, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [showQR]);

  const handleGenerateQR = () => {
    if (connectedCount >= maxDevices) return;
    setShowQR(true);
  };

  const confirmRemoveDevice = () => {
    if (deleteTarget) {
      removeMobileDevice(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const deleteTargetDevice = settings.mobileDevices.find(d => d.id === deleteTarget);

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">{t('mobile.title')}</h1>
      </div>

      {showQR ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
          <div className="bg-app-card rounded-2xl p-6 mb-6">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
          <div className="text-center mb-6">
            <div className="font-medium text-app-text text-sm mb-1">{t('mobile.scan_qr')}</div>
            <div className="text-sm text-app-text-sub">{t('mobile.scan_desc')}</div>
          </div>
          <button
            onClick={() => setShowQR(false)}
            className="px-6 py-2 bg-app-control text-app-text rounded-xl hover:bg-app-hover transition-colors"
          >
            {t('mobile.close')}
          </button>
        </div>
      ) : (
        <>
          {/* Device Count - neomorphic style matching Home status bar */}
          <div className="px-4 pt-3 pb-1 flex-shrink-0">
            <div className="grid grid-cols-3 bg-app-control/50 backdrop-blur-sm rounded-xl border border-app-line/50 py-2.5">
              <div className="flex flex-col items-center gap-1 py-1">
                <span className="text-[10px] text-app-text-hint uppercase tracking-widest">{t('mobile.connected')}</span>
                <span className="text-sm font-semibold text-app-text">{connectedCount}</span>
              </div>
              <div className="flex flex-col items-center gap-1 py-1 border-x border-app-line">
                <span className="text-[10px] text-app-text-hint uppercase tracking-widest">{t('mobile.limit')}</span>
                <span className="text-sm font-semibold text-app-text">{maxDevices}</span>
              </div>
              <div className="flex flex-col items-center gap-1 py-1">
                <span className="text-[10px] text-app-text-hint uppercase tracking-widest">{t('mobile.available')}</span>
                <span className={`text-sm font-semibold px-3 py-0.5 rounded-full ${
                  maxDevices - connectedCount > 0
                    ? 'text-app-success bg-app-success/15'
                    : 'text-app-danger bg-app-danger/15'
                }`}>
                  {maxDevices - connectedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Connected Devices List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
            {settings.mobileDevices.length > 0 ? (
              <div className="bg-app-card rounded-xl overflow-hidden mb-4">
                {settings.mobileDevices.map((device, index) => (
                  <div
                    key={device.id}
                    className={`flex items-center gap-3 px-4 py-4 ${
                      index < settings.mobileDevices.length - 1 ? 'border-b border-app-line' : ''
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-app-action" />
                    <div className="flex-1">
                      <div className="font-medium text-app-text text-sm">{device.name}</div>
                      <div className="text-xs text-app-text-dim">
                        {t('mobile.paired')}: {new Date(device.pairedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(device.id)}
                      className="p-2 hover:bg-app-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-app-danger" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Smartphone className="w-12 h-12 text-app-text-disabled mb-3" />
                <div className="text-sm text-app-text-sub mb-1">{t('mobile.no_devices')}</div>
                <div className="text-xs text-app-text-dim">{t('mobile.no_devices_desc')}</div>
              </div>
            )}
          </div>

          {/* Generate QR Button */}
          <div className="p-3 bg-app-header border-t border-app-line flex-shrink-0">
            <button
              onClick={handleGenerateQR}
              disabled={connectedCount >= maxDevices}
              className="w-full py-2.5 bg-app-action text-white rounded-xl font-medium hover:bg-app-action-hover active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <QrCode className="w-5 h-5" />
              {connectedCount >= maxDevices ? t('mobile.max_reached') : t('mobile.generate_qr')}
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-app-card rounded-2xl mx-6 w-full max-w-[280px] overflow-hidden">
            <div className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-app-danger/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-app-danger" />
              </div>
              <h3 className="text-base font-semibold text-app-text mb-1">{t('mobile.remove_title')}</h3>
              <p className="text-xs text-app-text-dim">
                {t('mobile.remove_desc')}
              </p>
            </div>
            <div className="flex border-t border-app-line">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-sm font-medium text-app-text-label hover:bg-app-hover transition-colors border-r border-app-line"
              >
                {t('dialog.cancel')}
              </button>
              <button
                onClick={confirmRemoveDevice}
                className="flex-1 py-3 text-sm font-medium text-app-danger hover:bg-app-danger/10 transition-colors"
              >
                {t('mobile.remove')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}