import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { IsolationNavigationCue } from '@/features/patient/components/IsolationNavigationCue';
import { WaitingContentCard } from '@/features/patient/components/WaitingContentCard';
import { ProtocolStepTracker } from '@/features/patient/components/ProtocolStepTracker';
import { HelpRequestModal } from '@/features/patient/components/HelpRequestModal';
import { StepEducationSheet } from '@/features/patient/components/StepEducationSheet';
import { UpcomingStepsSection } from '@/features/patient/components/UpcomingStepsSection';
import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import { usePatientJourney } from '@/features/patient/hooks/usePatientJourney';
import { usePatientState } from '@/features/patient/state';
import { formatVisitDuration } from '@/features/patient/utils/formatDuration';
import { isWaitingStep } from '@/features/patient/utils/waitingStep';
import { ROUTES } from '@/shared/constants/routes';
import '@/features/patient/pages/current-step.css';

export function CurrentStepPage() {
  const { t, language } = usePatientTranslations();
  const { isAuthenticated, advanceStep } = usePatientState();
  const journey = usePatientJourney();
  const navigate = useNavigate();
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    setIsEducationOpen(false);
    setIsHelpOpen(false);
  }, [journey?.currentStepIndex]);

  if (!isAuthenticated || !journey) {
    return <Navigate to={ROUTES.patient.login} replace />;
  }

  if (journey.isComplete) {
    return <Navigate to={ROUTES.patient.completion} replace />;
  }

  if (!journey.hasSteps) {
    return <Navigate to={ROUTES.patient.welcome} replace />;
  }

  const isRtl = language === 'he';
  const remainingText = formatVisitDuration(language, journey.remainingMinutes);

  function handleCompleteStep() {
    const complete = advanceStep();
    if (complete) {
      navigate(ROUTES.patient.completion, { replace: true });
    }
  }

  return (
    <div
      className="current-step-page"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <div className="current-step-dashboard">
        <section
          className="current-step-primary-card current-step-dashboard__primary"
          aria-labelledby="current-step-heading"
        >
          <p className="current-step-label">{t('stepTitle')}</p>
          <h1 id="current-step-heading" className="current-step-title">
            {journey.stepTitle}
          </h1>
          <p className="current-step-progress-text">
            {t('stepProgress', {
              current: String(journey.stepNumber),
              total: String(journey.totalSteps),
            })}
          </p>

          {journey.currentStep && (
            <IsolationNavigationCue step={journey.currentStep} t={t} />
          )}

          {journey.currentStep && isWaitingStep(journey.currentStep) && (
            <WaitingContentCard
              protocolId={journey.currentStep.protocolId}
              stepOrder={journey.currentStep.stepOrder}
              language={language}
              t={t}
            />
          )}

          <div
            className="current-step-primary-card__remaining"
            aria-labelledby="remaining-time-heading"
          >
            <h2
              id="remaining-time-heading"
              className="current-step-primary-card__remaining-label"
            >
              {t('remainingTimeTitle')}
            </h2>
            <p className="current-step-primary-card__remaining-value">
              {remainingText}
            </p>
          </div>

          <button
            type="button"
            className="current-step-button current-step-button--primary"
            onClick={handleCompleteStep}
          >
            {t('completeStepButton')}
          </button>
        </section>

        <aside
          className="current-step-dashboard__timeline-panel"
          aria-labelledby="progress-tracker-heading"
        >
          <section className="current-step-card current-step-card--timeline">
            <h2 id="progress-tracker-heading" className="current-step-card__title">
              {t('progressTrackerTitle')}
            </h2>
            <div className="current-step-card__timeline-scroll">
              <ProtocolStepTracker
                steps={journey.protocolSteps}
                currentStepIndex={journey.currentStepIndex}
                language={language}
                unknownStepLabel={t('unknownStepTitle')}
              />
            </div>
          </section>
        </aside>

        {journey.currentStep && (
          <button
            type="button"
            className="current-step-info-button current-step-dashboard__education-btn"
            aria-expanded={isEducationOpen}
            aria-haspopup="dialog"
            onClick={() => setIsEducationOpen(true)}
          >
            {t('openStepInfoButton')}
          </button>
        )}

        <button
          type="button"
          className="current-step-help-button current-step-dashboard__help-btn"
          aria-expanded={isHelpOpen}
          aria-haspopup="dialog"
          onClick={() => setIsHelpOpen(true)}
        >
          {t('needHelpButton')}
        </button>

        <div className="current-step-dashboard__upcoming">
          <UpcomingStepsSection
            steps={journey.upcomingSteps}
            language={language}
            title={t('nextStepsTitle')}
            emptyLabel={t('nextStepsEmpty')}
            unknownStepLabel={t('unknownStepTitle')}
            minutesLabel={t('stepDurationEstimate')}
          />
        </div>
      </div>

      {journey.currentStep && (
        <StepEducationSheet
          isOpen={isEducationOpen}
          onClose={() => setIsEducationOpen(false)}
          protocolId={journey.currentStep.protocolId}
          stepOrder={journey.currentStep.stepOrder}
          language={language}
          t={t}
        />
      )}

      <HelpRequestModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        t={t}
      />
    </div>
  );
}
