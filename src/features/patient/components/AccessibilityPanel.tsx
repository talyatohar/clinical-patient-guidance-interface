import { useEffect, useRef } from 'react';
import type { TranslationKey } from '@/features/patient/i18n/translations';
import { useAccessibility } from '@/features/patient/state/AccessibilityContext';
import {
  CONTRAST_MODES,
  TEXT_SIZES,
  type ContrastMode,
  type TextSize,
} from '@/features/patient/types/accessibility';
import '@/features/patient/components/accessibility-panel.css';

type AccessibilityPanelProps = {
  t: (key: TranslationKey, params?: Record<string, string>) => string;
};

const TEXT_SIZE_LABEL_KEYS: Record<TextSize, TranslationKey> = {
  normal: 'textSizeNormal',
  large: 'textSizeLarge',
  'extra-large': 'textSizeExtraLarge',
};

const CONTRAST_MODE_LABEL_KEYS: Record<ContrastMode, TranslationKey> = {
  standard: 'contrastModeStandard',
  high: 'contrastModeHigh',
};

export function AccessibilityPanel({ t }: AccessibilityPanelProps) {
  const {
    textSize,
    setTextSize,
    contrastMode,
    setContrastMode,
    isPanelOpen,
    closePanel,
  } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPanelOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePanel();
      }
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (panelRef.current && target && !panelRef.current.contains(target)) {
        const trigger = document.getElementById('patient-accessibility-trigger');
        if (trigger?.contains(target)) return;
        closePanel();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isPanelOpen, closePanel]);

  if (!isPanelOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      id="patient-accessibility-panel"
      role="dialog"
      aria-label={t('accessibilityPanelTitle')}
      className="accessibility-panel"
    >
      <fieldset className="accessibility-panel__fieldset">
        <legend className="accessibility-panel__legend">
          {t('textSizeLabel')}
        </legend>
        <div className="accessibility-panel__options">
          {TEXT_SIZES.map((size) => {
            const inputId = `text-size-${size}`;

            return (
              <label key={size} className="accessibility-panel__option">
                <input
                  id={inputId}
                  type="radio"
                  name="patient-text-size"
                  className="accessibility-panel__radio"
                  value={size}
                  checked={textSize === size}
                  onChange={() => setTextSize(size)}
                />
                <span className="accessibility-panel__option-label">
                  {t(TEXT_SIZE_LABEL_KEYS[size])}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="accessibility-panel__fieldset accessibility-panel__fieldset--contrast">
        <legend className="accessibility-panel__legend">
          {t('contrastModeLabel')}
        </legend>
        <div className="accessibility-panel__options">
          {CONTRAST_MODES.map((mode) => {
            const inputId = `contrast-mode-${mode}`;

            return (
              <label key={mode} className="accessibility-panel__option">
                <input
                  id={inputId}
                  type="radio"
                  name="patient-contrast-mode"
                  className="accessibility-panel__radio"
                  value={mode}
                  checked={contrastMode === mode}
                  onChange={() => setContrastMode(mode)}
                />
                <span className="accessibility-panel__option-label">
                  {t(CONTRAST_MODE_LABEL_KEYS[mode])}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
