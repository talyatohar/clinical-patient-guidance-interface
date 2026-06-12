import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CompletionStarRating } from '@/features/patient/components/CompletionStarRating';
import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import { isJourneyComplete } from '@/features/patient/services/protocolService';
import { usePatientState } from '@/features/patient/state';
import { formatCompletionTime } from '@/features/patient/utils/formatCompletionTime';
import { displayValue } from '@/features/patient/utils/displayValue';
import { formatVisitDuration } from '@/features/patient/utils/formatDuration';
import { ROUTES } from '@/shared/constants/routes';
import '@/features/patient/pages/completion.css';

export function CompletionPage() {
  const { t, language } = usePatientTranslations();
  const { session, isAuthenticated } = usePatientState();
  const [completionTime] = useState(() => new Date());
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  if (!isAuthenticated || !session) {
    return <Navigate to={ROUTES.patient.login} replace />;
  }

  const { patient, protocolSteps, currentStepIndex } = session;

  if (!isJourneyComplete(currentStepIndex, protocolSteps.length)) {
    return <Navigate to={ROUTES.patient.step} replace />;
  }

  const examType = displayValue(patient.examType) ?? t('valueUnavailable');
  const appointmentTime =
    displayValue(patient.appointmentTime) ?? t('valueUnavailable');
  const totalMinutes = protocolSteps.reduce(
    (total, step) => total + Math.max(0, step.estimatedMinutes),
    0,
  );
  const totalDuration = formatVisitDuration(language, totalMinutes);
  const completedAt = formatCompletionTime(language, completionTime);

  const isRtl = language === 'he';

  return (
    <div
      className="completion-page"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <header className="completion-hero">
        <h1 className="completion-title">{t('completionTitle')}</h1>
        <p className="completion-message">{t('completionMessage')}</p>
      </header>

      <section className="completion-card" aria-labelledby="completion-summary-heading">
        <h2 id="completion-summary-heading" className="completion-card__title">
          {t('completionVisitSummaryTitle')}
        </h2>
        <dl className="completion-summary">
          <div className="completion-summary__row">
            <dt>{t('welcomeExamLabel')}</dt>
            <dd>{examType}</dd>
          </div>
          <div className="completion-summary__row">
            <dt>{t('welcomeAppointmentLabel')}</dt>
            <dd>{appointmentTime}</dd>
          </div>
          <div className="completion-summary__row">
            <dt>{t('completionTotalDurationLabel')}</dt>
            <dd>{totalDuration}</dd>
          </div>
          <div className="completion-summary__row">
            <dt>{t('completionTimeLabel')}</dt>
            <dd>{completedAt}</dd>
          </div>
        </dl>
      </section>

      <p className="completion-results">{t('completionResultsInfo')}</p>

      <section className="completion-card completion-feedback" aria-labelledby="completion-feedback-heading">
        <h2 id="completion-feedback-heading" className="completion-feedback__title">
          {t('completionFeedbackTitle')}
        </h2>

        <CompletionStarRating
          value={rating}
          onChange={setRating}
          ariaLabel={t('completionRatingAriaLabel')}
          starLabel={(star) => t('completionStarLabel', { count: String(star) })}
        />

        <label className="completion-feedback__comment-label" htmlFor="completion-comment">
          {t('completionCommentLabel')}
          <textarea
            id="completion-comment"
            className="completion-feedback__comment"
            value={comment}
            placeholder={t('completionCommentPlaceholder')}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
          />
        </label>
      </section>
    </div>
  );
}
