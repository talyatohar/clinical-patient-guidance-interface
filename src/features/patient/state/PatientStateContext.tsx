import type { Language } from '@/features/patient/types/language';
import type { PatientSession } from '@/features/patient/types/session';
import { isJourneyComplete } from '@/features/patient/services/protocolService';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type PatientState = {
  language: Language;
  session: PatientSession | null;
};

type PatientStateContextValue = {
  language: Language;
  session: PatientSession | null;
  currentPatient: PatientSession['patient'] | null;
  setLanguage: (language: Language) => void;
  login: (session: PatientSession) => void;
  logout: () => void;
  advanceStep: () => boolean;
  isAuthenticated: boolean;
};

const PatientStateContext = createContext<PatientStateContextValue | null>(null);

const initialState: PatientState = {
  language: 'he',
  session: null,
};

type PatientStateProviderProps = {
  children: ReactNode;
};

export function PatientStateProvider({ children }: PatientStateProviderProps) {
  const [state, setState] = useState<PatientState>(initialState);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const login = useCallback((session: PatientSession) => {
    setState((prev) => ({ ...prev, session }));
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, session: null }));
  }, []);

  /** Advances to the next step. Returns true if the journey is now complete. */
  const advanceStep = useCallback((): boolean => {
    let journeyComplete = false;

    setState((prev) => {
      if (!prev.session) return prev;

      const nextIndex = prev.session.currentStepIndex + 1;
      const totalSteps = prev.session.protocolSteps.length;

      if (isJourneyComplete(nextIndex, totalSteps)) {
        journeyComplete = true;
        return {
          ...prev,
          session: {
            ...prev.session,
            currentStepIndex: totalSteps,
          },
        };
      }

      return {
        ...prev,
        session: {
          ...prev.session,
          currentStepIndex: nextIndex,
        },
      };
    });

    return journeyComplete;
  }, []);

  const value = useMemo(
    () => ({
      language: state.language,
      session: state.session,
      currentPatient: state.session?.patient ?? null,
      setLanguage,
      login,
      logout,
      advanceStep,
      isAuthenticated: state.session !== null,
    }),
    [state.language, state.session, setLanguage, login, logout, advanceStep],
  );

  return (
    <PatientStateContext.Provider value={value}>
      {children}
    </PatientStateContext.Provider>
  );
}

export function usePatientState() {
  const context = useContext(PatientStateContext);
  if (!context) {
    throw new Error('usePatientState must be used within PatientStateProvider');
  }
  return context;
}
