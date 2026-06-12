import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  CONTRAST_MODE_STORAGE_KEY,
  CONTRAST_MODES,
  DEFAULT_CONTRAST_MODE,
  DEFAULT_TEXT_SIZE,
  TEXT_SIZE_STORAGE_KEY,
  TEXT_SIZES,
  type ContrastMode,
  type TextSize,
} from '@/features/patient/types/accessibility';

type AccessibilityContextValue = {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

function isTextSize(value: string | null): value is TextSize {
  return TEXT_SIZES.includes(value as TextSize);
}

function isContrastMode(value: string | null): value is ContrastMode {
  return CONTRAST_MODES.includes(value as ContrastMode);
}

function readStoredTextSize(): TextSize {
  try {
    const stored = localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
    if (isTextSize(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage errors in private browsing or restricted environments.
  }

  return DEFAULT_TEXT_SIZE;
}

function readStoredContrastMode(): ContrastMode {
  try {
    const stored = localStorage.getItem(CONTRAST_MODE_STORAGE_KEY);
    if (isContrastMode(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage errors in private browsing or restricted environments.
  }

  return DEFAULT_CONTRAST_MODE;
}

function persistTextSize(size: TextSize): void {
  try {
    localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size);
  } catch {
    // Ignore storage errors.
  }
}

function persistContrastMode(mode: ContrastMode): void {
  try {
    localStorage.setItem(CONTRAST_MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors.
  }
}

type AccessibilityProviderProps = {
  children: ReactNode;
};

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [textSize, setTextSizeState] = useState<TextSize>(readStoredTextSize);
  const [contrastMode, setContrastModeState] = useState<ContrastMode>(
    readStoredContrastMode,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size);
    persistTextSize(size);
  }, []);

  const setContrastMode = useCallback((mode: ContrastMode) => {
    setContrastModeState(mode);
    persistContrastMode(mode);
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(
    () => setIsPanelOpen((open) => !open),
    [],
  );

  useLayoutEffect(() => {
    document.documentElement.dataset.textSize = textSize;
    document.documentElement.dataset.contrastMode = contrastMode;

    return () => {
      delete document.documentElement.dataset.textSize;
      delete document.documentElement.dataset.contrastMode;
    };
  }, [textSize, contrastMode]);

  const value = useMemo(
    () => ({
      textSize,
      setTextSize,
      contrastMode,
      setContrastMode,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
    }),
    [
      textSize,
      setTextSize,
      contrastMode,
      setContrastMode,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibility must be used within AccessibilityProvider',
    );
  }
  return context;
}
