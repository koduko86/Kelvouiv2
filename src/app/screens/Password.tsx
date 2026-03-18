import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useController } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Delete, KeyRound } from 'lucide-react';

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const PIN_LENGTH = 4;

interface PinPadProps {
  /** The correct password to match against */
  correctPassword: string;
  /** Called when password is correctly entered */
  onSuccess: () => void;
  /** Called when back button is pressed */
  onBack: () => void;
  /** Header title */
  title: string;
  /** Show "Default: 1234" hint */
  showDefault?: boolean;
  /** Show "Change Password" button */
  showChangePassword?: boolean;
}

export function PinPad({
  correctPassword,
  onSuccess,
  onBack,
  title,
  showDefault = false,
  showChangePassword = false,
}: PinPadProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (password.length < PIN_LENGTH) {
      setPassword(password + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPassword(password.slice(0, -1));
    setError(false);
  };

  const handleConfirm = () => {
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">{title}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 min-h-0">
        {/* Password Display */}
        <div className="mb-4" style={{ marginTop: '-10px' }}>
          <div className="flex gap-2.5 justify-center">
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  error
                    ? 'border-app-danger bg-app-danger/10'
                    : i < password.length
                      ? 'border-app-action bg-app-action/10'
                      : 'border-app-border bg-app-input-bg'
                }`}
              >
                {i < password.length && !error && (
                  <div className="w-2.5 h-2.5 rounded-full bg-app-action" />
                )}
              </div>
            ))}
          </div>

          {showDefault && (
            <div className="mt-2 text-center text-xs text-app-text-dim">
              {t('pw.default')}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-2 text-xs text-app-danger">
            {t('pw.wrong')}
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="w-full max-w-[260px]">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {NUMPAD.map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-12 rounded-xl bg-app-control text-app-text font-medium hover:bg-app-hover transition-colors active:scale-95 font-display"
              >
                <span className="text-base">{num}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDelete}
              className="h-12 rounded-xl bg-app-control text-app-text-sub hover:bg-app-hover transition-colors flex items-center justify-center active:scale-95"
            >
              <Delete className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-12 rounded-xl bg-app-control text-app-text font-medium hover:bg-app-hover transition-colors active:scale-95 font-display"
            >
              <span className="text-base">0</span>
            </button>
            <button
              onClick={handleConfirm}
              className="h-12 rounded-xl bg-app-action text-white font-semibold hover:bg-app-action-hover transition-all active:scale-95 text-sm"
            >
              {t('dialog.confirm')}
            </button>
          </div>
        </div>

        {showChangePassword && (
          <button
            onClick={() => navigate('/change-password')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-app-control hover:bg-app-hover transition-colors flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-app-text-sub" />
            <span className="text-sm font-medium text-app-text">{t('pw.change')}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Settings password gate — shows default hint + change password button */
export function Password() {
  const { settings } = useController();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PinPad
      correctPassword={settings.password}
      onSuccess={() => navigate('/settings')}
      onBack={() => navigate('/home')}
      title={t('pw.enter')}
      showDefault
      showChangePassword
    />
  );
}
