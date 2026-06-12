import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PatientStateProvider } from '@/features/patient/state';
import { StaffStateProvider } from '@/features/staff/state';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <PatientStateProvider>
        <StaffStateProvider>{children}</StaffStateProvider>
      </PatientStateProvider>
    </BrowserRouter>
  );
}
