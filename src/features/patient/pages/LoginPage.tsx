import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import { validatePatientLogin } from '@/features/patient/services/authService';
import { usePatientState } from '@/features/patient/state';
import { LANGUAGES, type Language } from '@/features/patient/types/language';
import { ROUTES } from '@/shared/constants/routes';
import { loadDatabase } from '@/shared/services/data';
import '@/features/patient/pages/login.css';

type LoginErrorKey = 'loginErrorInvalid' | 'loginErrorDatabase';

export function LoginPage() {
  const { t, language } = usePatientTranslations();
  const { setLanguage, login, isAuthenticated } = usePatientState();
  const navigate = useNavigate();

  const [idNumber, setIdNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorKey, setErrorKey] = useState<LoginErrorKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [loadStatus, setLoadStatus] = useState<
    'loading' | 'success' | 'failed'
  >('loading');
  const [loadedPatientCount, setLoadedPatientCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loadDatabase().then(({ loaded, patients, warnings }) => {
      if (cancelled) return;

      if (loaded) {
        console.log(
          '[Nuclear Medicine Guide] Loaded patients from Excel:',
          patients,
        );
        setLoadedPatientCount(patients.length);
        setLoadStatus('success');
        setIsDatabaseReady(true);
      } else {
        console.warn(
          '[Nuclear Medicine Guide] Failed to load Excel database:',
          warnings,
        );
        setLoadStatus('failed');
        setIsDatabaseReady(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.patient.welcome} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorKey(null);
    setIsSubmitting(true);

    try {
      const result = await validatePatientLogin(idNumber, verificationCode);

      if (result.success) {
        login(result.session);
        navigate(ROUTES.patient.welcome, { replace: true });
      } else {
        setErrorKey(
          result.error === 'database_unavailable'
            ? 'loginErrorDatabase'
            : 'loginErrorInvalid',
        );
      }
    } catch {
      setErrorKey('loginErrorDatabase');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRtl = language === 'he';
  const isDisabled = isSubmitting || !isDatabaseReady;

  return (
    <div
      className="login-page"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <header className="login-header">
        <h1 className="login-title">{t('appTitle')}</h1>
        <p className="login-subtitle">{t('loginSubtitle')}</p>
        {loadStatus === 'success' && (
          <p className="login-status login-status--success" role="status">
            {t('loginPatientsLoaded', { count: String(loadedPatientCount) })}
          </p>
        )}
        {loadStatus === 'failed' && (
          <p className="login-status login-status--error" role="status">
            {t('loginPatientsLoadFailed')}
          </p>
        )}
      </header>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="login-field">
          <label className="login-label" htmlFor="language">
            {t('languageLabel')}
          </label>
          <select
            id="language"
            className="login-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang === 'he' ? t('languageHebrew') : t('languageEnglish')}
              </option>
            ))}
          </select>
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="idNumber">
            {t('idNumberLabel')}
          </label>
          <input
            id="idNumber"
            className="login-input"
            type="text"
            inputMode="numeric"
            autoComplete="username"
            placeholder={t('idNumberPlaceholder')}
            value={idNumber}
            onChange={(e) => {
              setIdNumber(e.target.value);
              setErrorKey(null);
            }}
            required
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="verificationCode">
            {t('verificationCodeLabel')}
          </label>
          <input
            id="verificationCode"
            className="login-input"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder={t('verificationCodePlaceholder')}
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setErrorKey(null);
            }}
            required
          />
        </div>

        {errorKey && (
          <p className="login-error" role="alert">
            {t(errorKey)}
          </p>
        )}

        <button
          type="submit"
          className="login-button"
          disabled={isDisabled}
        >
          {isSubmitting ? t('loginLoading') : t('loginButton')}
        </button>
      </form>
    </div>
  );
}
