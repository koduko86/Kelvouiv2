import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useController } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Delete, Check, Lock } from 'lucide-react';

type Step = 'current' | 'new' | 'confirm';

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const PIN_LENGTH = 4;
const STEPS: Step[] = ['current', 'new', 'confirm'];

export function ChangePassword() {
  const [step, setStep] = useState<Step>('current');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { settings, updateSettings } = useController();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCurrentInput = () => {
    switch (step) {
      case 'current': return currentPassword;
      case 'new': return newPassword;
      case 'confirm': return confirmPassword;
    }
  };

  const setCurrentInput = (value: string) => {
    switch (step) {
      case 'current': setCurrentPassword(value); break;
      case 'new': setNewPassword(value); break;
      case 'confirm': setConfirmPassword(value); break;
    }
  };

  const handleNumberClick = (num: string) => {
    const current = getCurrentInput();
    if (current.length < PIN_LENGTH) {
      setCurrentInput(current + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    const current = getCurrentInput();
    setCurrentInput(current.slice(0, -1));
    setError(false);
  };

  const handleConfirm = () => {
    if (step === 'current') {
      if (getCurrentInput() === settings.password) {
        setStep('new');
        setError(false);
      } else {
        setError(true);
        setCurrentPassword('');
        setTimeout(() => setError(false), 500);
      }
    } else if (step === 'new') {
      if (getCurrentInput().length === PIN_LENGTH) {
        setStep('confirm');
        setError(false);
      }
    } else if (step === 'confirm') {
      if (confirmPassword === newPassword) {
        updateSettings({ password: newPassword });
        setSuccess(true);
        setTimeout(() => navigate('/password'), 1500);
      } else {
        setError(true);
        setConfirmPassword('');
        setTimeout(() => setError(false), 500);
      }
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'current': return t('pw.current');
      case 'new': return t('pw.new');
      case 'confirm': return t('pw.confirm_new');
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'current': return t('pw.default');
      case 'new': return t('pw.new');
      case 'confirm': return t('pw.confirm_new');
    }
  };

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button
          onClick={() => navigate('/password')}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">{t('pw.change')}</h1>
      </div>

      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full bg-app-success/15 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-app-success" />
          </div>
          <h2 className="text-base font-semibold text-app-text mb-2">{t('pw.success')}</h2>
          <p className="text-app-text-dim text-center">
            {t('pw.default')}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-5 min-h-0">
          {/* Title */}
          <div className="mb-4 text-center" style={{ marginTop: '-10px' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-app-text-hint" />
              <h2 className="text-sm font-semibold text-app-text">{getTitle()}</h2>
            </div>
            <p className="text-xs text-app-text-dim">{getSubtitle()}</p>
          </div>

          {/* Password Display */}
          <div className="mb-4">
            <div className="flex gap-2.5 justify-center">
              {[...Array(PIN_LENGTH)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                    error
                      ? 'border-app-danger bg-app-danger/10'
                      : i < getCurrentInput().length
                        ? step === 'new'
                          ? 'border-app-success bg-app-success/10'
                          : 'border-app-action bg-app-action/10'
                        : 'border-app-border bg-app-input-bg'
                  }`}
                >
                  {i < getCurrentInput().length && !error && (
                    <div className={`w-2.5 h-2.5 rounded-full ${step === 'new' ? 'bg-app-success' : 'bg-app-action'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-2 text-xs text-app-danger">
              {step === 'current' ? t('pw.wrong_current') : t('pw.mismatch')}
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
                disabled={getCurrentInput().length !== PIN_LENGTH}
                className={`h-12 rounded-xl font-semibold transition-all active:scale-95 text-sm ${
                  getCurrentInput().length === PIN_LENGTH
                    ? 'bg-app-action text-white hover:bg-app-action-hover'
                    : 'bg-app-hover text-app-text-hint cursor-not-allowed'
                }`}
              >
                {step === 'confirm' ? t('pw.save') : t('btn.next')}
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s
                    ? 'w-12 bg-app-action'
                    : STEPS.indexOf(step) > i
                      ? 'w-8 bg-app-action/60'
                      : 'w-8 bg-app-border'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}