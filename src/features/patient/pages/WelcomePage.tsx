import { Navigate, useNavigate } from 'react-router-dom';
import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import { usePatientState } from '@/features/patient/state';
import { shouldShowPreparationChecklist } from '@/features/patient/services/preparationService';
import { isJourneyComplete } from '@/features/patient/services/protocolService';
import { displayValue } from '@/features/patient/utils/displayValue';
import { ROUTES } from '@/shared/constants/routes';
import '@/features/patient/pages/welcome.css';

export function WelcomePage() {
  const { t, language } = usePatientTranslations();
  const { session, isAuthenticated } = usePatientState();
  const navigate = useNavigate();

  if (!isAuthenticated || !session) {
    return <Navigate to={ROUTES.patient.login} replace />;
  }

  const { patient, protocolSteps, currentStepIndex } = session;

  const firstName = displayValue(patient.firstName);
  const examType = displayValue(patient.examType);
  const appointmentTime = displayValue(patient.appointmentTime);

  const isRtl = language === 'he';

  function handleStartJourney() {
    if (
      protocolSteps.length === 0 ||
      isJourneyComplete(currentStepIndex, protocolSteps.length)
    ) {
      navigate(ROUTES.patient.completion, { replace: true });
      return;
    }

    const destination = shouldShowPreparationChecklist(patient.protocolId)
      ? ROUTES.patient.preparation
      : ROUTES.patient.step;
    navigate(destination);
  }

  return (
    <div
      className="welcome-page"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <header className="welcome-header">
        <h1 className="welcome-title">{t('welcomeTitle')}</h1>
        {firstName && (
          <p className="welcome-greeting">
            {t('welcomeGreeting', { name: firstName })}
          </p>
        )}
      </header>

      <div className="welcome-card">
        <dl className="welcome-details">
          <div className="welcome-detail">
            <dt>{t('welcomeFirstNameLabel')}</dt>
            <dd>{firstName ?? t('valueUnavailable')}</dd>
          </div>
          <div className="welcome-detail">
            <dt>{t('welcomeExamLabel')}</dt>
            <dd>{examType ?? t('valueUnavailable')}</dd>
          </div>
          <div className="welcome-detail">
            <dt>{t('welcomeAppointmentLabel')}</dt>
            <dd>{appointmentTime ?? t('valueUnavailable')}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="welcome-journey-button"
          onClick={handleStartJourney}
        >
          {t('startJourneyButton')}
        </button>
      </div>
    </div>
  );
}
