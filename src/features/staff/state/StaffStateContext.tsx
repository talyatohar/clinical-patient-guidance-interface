import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Extend as staff screens are added
export type StaffState = Record<string, never>;

type StaffStateContextValue = {
  state: StaffState;
  setState: React.Dispatch<React.SetStateAction<StaffState>>;
};

const StaffStateContext = createContext<StaffStateContextValue | null>(null);

const initialState: StaffState = {};

type StaffStateProviderProps = {
  children: ReactNode;
};

export function StaffStateProvider({ children }: StaffStateProviderProps) {
  const [state, setState] = useState<StaffState>(initialState);

  const value = useMemo(
    () => ({ state, setState }),
    [state],
  );

  return (
    <StaffStateContext.Provider value={value}>
      {children}
    </StaffStateContext.Provider>
  );
}

export function useStaffState() {
  const context = useContext(StaffStateContext);
  if (!context) {
    throw new Error('useStaffState must be used within StaffStateProvider');
  }
  return context;
}
