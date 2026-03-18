import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Wifi, Lock, RefreshCw, Loader2, X, Eye, EyeOff, Delete } from 'lucide-react';

interface WiFiNetwork {
  ssid: string;
  signal: number;
  secured: boolean;
}

const MOCK_NETWORKS: WiFiNetwork[] = [
  { ssid: 'HomeNetwork_5G', signal: 95, secured: true },
  { ssid: 'Office WiFi', signal: 80, secured: true },
  { ssid: 'Guest Network', signal: 60, secured: false },
  { ssid: 'Neighbor WiFi', signal: 45, secured: true },
];

const ALPHA_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const SPECIAL_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
  ['*', '"', '\'', ':', ';', '!', '?', '.', ','],
];

function getSignalBars(signal: number) {
  if (signal > 80) return 4;
  if (signal > 60) return 3;
  if (signal > 40) return 2;
  return 1;
}

export function WiFiSetup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(false);
  const [networks] = useState<WiFiNetwork[]>(MOCK_NETWORKS);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [showSpecialChars, setShowSpecialChars] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  const handleNetworkSelect = (network: WiFiNetwork) => {
    if (network.secured) {
      setSelectedNetwork(network);
      setPassword('');
    } else {
      handleConnect(network);
    }
  };

  const handleConnect = (_network: WiFiNetwork) => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setSelectedNetwork(null);
      setPassword('');
      navigate('/settings');
    }, 1500);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setPassword(password.slice(0, -1));
    } else if (key === 'space') {
      setPassword(password + ' ');
    } else {
      const char = isUpperCase && !showSpecialChars ? key.toUpperCase() : key;
      setPassword(password + char);
    }
  };

  const keyboardLayout = showSpecialChars ? SPECIAL_LAYOUT : ALPHA_LAYOUT;

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
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text">{t('wifi.title')}</h1>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="p-2 -mr-2 hover:bg-app-hover rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-app-text-sub ${scanning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Networks List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
        {scanning ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-app-action animate-spin mb-3" />
            <div className="text-sm text-app-text-sub">{t('wifi.scanning')}</div>
          </div>
        ) : networks.length > 0 ? (
          <div className="bg-app-card rounded-xl overflow-hidden">
            {networks.map((network, index) => (
              <button
                key={network.ssid}
                onClick={() => handleNetworkSelect(network)}
                disabled={selectedNetwork !== null}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-app-hover transition-colors ${
                  index < networks.length - 1 ? 'border-b border-app-line' : ''
                } ${selectedNetwork === network ? 'bg-app-action/10' : ''} disabled:opacity-50`}
              >
                <Wifi className="w-5 h-5 text-app-action" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-app-text text-sm">{network.ssid}</div>
                  <div className="text-xs text-app-text-dim">{t('wifi.signal')}: {network.signal}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-end gap-0.5 h-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 ${i < getSignalBars(network.signal) ? 'bg-app-action' : 'bg-app-border'}`}
                        style={{ height: `${(i + 1) * 25}%` }}
                      />
                    ))}
                  </div>
                  {network.secured && <Lock className="w-4 h-4 text-app-text-hint" />}
                  {selectedNetwork === network && <Loader2 className="w-4 h-4 text-app-action animate-spin" />}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Wifi className="w-12 h-12 text-app-text-disabled mb-3" />
            <div className="text-sm text-app-text-sub mb-4">{t('wifi.no_networks')}</div>
            <button
              onClick={handleScan}
              className="px-4 py-2 bg-app-action text-white rounded-xl hover:bg-app-action-hover transition-colors"
            >
              {t('wifi.scan')}
            </button>
          </div>
        )}
      </div>

      {/* Password Dialog Modal */}
      {selectedNetwork && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-app-header w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-4 h-[50px] border-b border-app-line flex-shrink-0">
              <div>
                <div className="text-sm font-semibold text-app-text">{selectedNetwork.ssid}</div>
                <div className="text-xs text-app-text-dim">{t('wifi.enter_pw')}</div>
              </div>
              <button
                onClick={() => setSelectedNetwork(null)}
                className="p-1.5 hover:bg-app-hover rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-app-text-sub" />
              </button>
            </div>

            <div className="px-4 py-3 flex-shrink-0">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="w-full px-3 py-2.5 text-sm bg-app-panel border border-app-border rounded-lg text-app-text focus:outline-none focus:ring-2 focus:ring-app-action"
                  placeholder={t('wifi.enter_pw_placeholder')}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-app-hover rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-app-text-sub" />
                  ) : (
                    <Eye className="w-4 h-4 text-app-text-sub" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 px-2 pb-2 flex flex-col justify-end">
              <div className="space-y-1">
                {keyboardLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-0.5 justify-center">
                    {row.map((key) => (
                      <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        className="w-[30px] h-[40px] bg-app-hover/80 dark:bg-white/10 hover:bg-app-hover dark:hover:bg-white/20 active:bg-app-border dark:active:bg-white/25 rounded text-sm font-medium text-app-text transition-colors flex items-center justify-center touch-manipulation border border-transparent dark:border-white/5"
                      >
                        {isUpperCase && !showSpecialChars ? key.toUpperCase() : key}
                      </button>
                    ))}
                  </div>
                ))}

                <div className="flex gap-0.5 justify-center">
                  <button
                    onClick={() => setShowSpecialChars(!showSpecialChars)}
                    className={`w-[42px] h-[40px] ${
                      showSpecialChars
                        ? 'bg-app-action text-white'
                        : 'bg-app-hover/80 dark:bg-white/15 text-app-text border border-transparent dark:border-white/5'
                    } hover:bg-app-action-hover rounded text-xs font-semibold transition-colors flex items-center justify-center touch-manipulation`}
                  >
                    123
                  </button>
                  {!showSpecialChars && (
                    <button
                      onClick={() => setIsUpperCase(!isUpperCase)}
                      className={`w-[42px] h-[40px] ${
                        isUpperCase
                          ? 'bg-app-action text-white'
                          : 'bg-app-hover/80 dark:bg-white/15 text-app-text border border-transparent dark:border-white/5'
                      } hover:bg-app-action-hover rounded text-xs font-semibold transition-colors flex items-center justify-center touch-manipulation`}
                    >
                      ⇧
                    </button>
                  )}
                  <button
                    onClick={() => handleKeyPress('space')}
                    className="flex-1 h-[40px] bg-app-hover/80 dark:bg-white/10 hover:bg-app-hover dark:hover:bg-white/20 active:bg-app-border dark:active:bg-white/25 rounded text-xs font-medium text-app-text transition-colors touch-manipulation border border-transparent dark:border-white/5"
                  >
                    {t('wifi.space')}
                  </button>
                  <button
                    onClick={() => handleKeyPress('backspace')}
                    className="w-[48px] h-[40px] bg-app-hover/80 dark:bg-white/15 hover:bg-app-border dark:hover:bg-white/20 rounded transition-colors flex items-center justify-center touch-manipulation border border-transparent dark:border-white/5"
                  >
                    <Delete className="w-4 h-4 text-app-text" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-app-line flex-shrink-0">
              <button
                onClick={() => handleConnect(selectedNetwork)}
                disabled={connecting || password.length === 0}
                className="w-full py-3 bg-app-action hover:bg-app-action-hover disabled:bg-app-border disabled:text-app-text-hint text-white text-sm font-semibold rounded-xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('wifi.connecting')}
                  </>
                ) : (
                  t('wifi.connect')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}