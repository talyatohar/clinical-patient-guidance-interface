import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import {
  getChecklistItemDisplayText,
  getPreparationChecklistForProtocol,
} from '@/features/patient/services/preparationService';
import { isJourneyComplete } from '@/features/patient/services/protocolService';
import { usePatientState } from '@/features/patient/state';
import { ROUTES } from '@/shared/constants/routes';
import '@/features/patient/pages/preparation-checklist.css';

function itemKey(protocolId: string, parseOrder: number): string {
  return `${protocolId}-${parseOrder}`;
}

export function PreparationChecklistPage() {
  const { t, language } = usePatientTranslations();
  const { session, isAuthenticated } = usePatientState();
  const navigate = useNavigate();
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(() => new Set());

  const checklistItems = useMemo(() => {
    if (!session) return [];
    return getPreparationChecklistForProtocol(session.patient.protocolId);
  }, [session]);

  if (!isAuthenticated || !session) {
    return <Navigate to={ROUTES.patient.login} replace />;
  }

  const { protocolSteps, currentStepIndex } = session;

  if (
    protocolSteps.length === 0 ||
    isJourneyComplete(currentStepIndex, protocolSteps.length)
  ) {
    return <Navigate to={ROUTES.patient.completion} replace />;
  }

  if (checklistItems.length === 0) {
    return <Navigate to={ROUTES.patient.step} replace />;
  }

  const isRtl = language === 'he';

  function toggleItem(key: string) {
    setCheckedKeys((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleContinue() {
    navigate(ROUTES.patient.step);
  }

  return (
    <div
      className="preparation-page"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <header className="preparation-header">
        <h1 className="preparation-title">{t('preparationChecklistTitle')}</h1>
        <p className="preparation-intro">{t('preparationChecklistIntro')}</p>
      </header>

      <p className="preparation-warning" role="note">
        {t('preparationChecklistWarning')}
      </p>

      <section
        className="preparation-card"
        aria-label={t('preparationChecklistTitle')}
      >
        <ul className="preparation-list">
          {checklistItems.map((item) => {
            const key = itemKey(item.protocolId, item.parseOrder);
            const inputId = `preparation-item-${key}`;
            return (
              <li key={key}>
                <label htmlFor={inputId} className="preparation-item">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checkedKeys.has(key)}
                    onChange={() => toggleItem(key)}
                  />
                  <span className="preparation-item-text">
                    {getChecklistItemDisplayText(item, language)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        type="button"
        className="preparation-continue-button"
        onClick={handleContinue}
      >
        {t('continueToJourneyButton')}
      </button>
    </div>
  );
}
