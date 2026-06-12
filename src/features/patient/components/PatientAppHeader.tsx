import { usePatientTranslations } from '@/features/patient/hooks/usePatientTranslations';
import { usePatientState } from '@/features/patient/state';
import { useAccessibility } from '@/features/patient/state/AccessibilityContext';
import { AccessibilityPanel } from '@/features/patient/components/AccessibilityPanel';
import '@/features/patient/components/patient-app-header.css';

export function PatientAppHeader() {
  const { t } = usePatientTranslations();
  const { language } = usePatientState();
  const { isPanelOpen, togglePanel } = useAccessibility();
  const isRtl = language === 'he';

  return (
    <header
      className="patient-app-header"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={language}
    >
      <div className="patient-app-header__inner">
        <div className="patient-app-header__control">
          <button
            id="patient-accessibility-trigger"
            type="button"
            className="patient-app-header__button"
            aria-expanded={isPanelOpen}
            aria-haspopup="dialog"
            aria-controls="patient-accessibility-panel"
            onClick={togglePanel}
          >
            <span className="patient-app-header__icon" aria-hidden="true">
              Aa
            </span>
            <span className="patient-app-header__label">
              {t('accessibilityLabel')}
            </span>
          </button>
          <AccessibilityPanel t={t} />
        </div>
      </div>
    </header>
  );
}
