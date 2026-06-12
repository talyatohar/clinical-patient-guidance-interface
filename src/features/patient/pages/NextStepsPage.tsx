import { Navigate, useNavigate } from 'react-router-dom';
import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import { usePatientJourney } from '@/features/patient/hooks/usePatientJourney';
import { usePatientState } from '@/features/patient/state';
import { getUpcomingSteps } from '@/features/patient/services/protocolService';
import { getProtocolStepDisplayTitle } from '@/features/patient/utils/protocolStepTitle';
import { ROUTES } from '@/shared/constants/routes';
import '@/features/patient/pages/next-steps.css';

export function NextStepsPage() {
  const { t, language } = usePatientTranslations();
  const { session, isAuthenticated } = usePatientState();
  const journey = usePatientJourney();
  const navigate = useNavigate();

  if (!isAuthenticated || !session || !journey) {
    return <Navigate to={ROUTES.patient.login} replace />;
  }

  if (journey.isComplete) {
    return <Navigate to={ROUTES.patient.completion} replace />;
  }

  const upcoming = getUpcomingSteps(
    session.protocolSteps,
    session.currentStepIndex,
  );

  const isRtl = language === 'he';

  return (
    <div
      className="next-steps-page"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <header className="next-steps-header">
        <h1 className="next-steps-title">{t('nextStepsTitle')}</h1>
      </header>

      {upcoming.length === 0 ? (
        <p className="next-steps-empty">{t('nextStepsEmpty')}</p>
      ) : (
        <ol className="next-steps-list">
          {upcoming.map((step) => (
            <li key={`${step.protocolId}-${step.stepOrder}`}>
              {t('nextStepItem', {
                order: String(step.stepOrder),
                title: getProtocolStepDisplayTitle(
                  step,
                  language,
                  t('unknownStepTitle'),
                ),
              })}
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        className="next-steps-back-button"
        onClick={() => navigate(ROUTES.patient.step)}
      >
        {t('backToCurrentStep')}
      </button>
    </div>
  );
}
