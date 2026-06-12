import type { ProtocolStep } from '@/shared/models/ProtocolStep';

type IsolationNavStep = Pick<ProtocolStep, 'protocolId' | 'stepOrder'>;

/** Isolation-room guidance applies only on specific protocol steps. */
export function isIsolationNavigationStep(
  step: IsolationNavStep | null | undefined,
): boolean {
  if (!step) return false;

  const protocolId = step.protocolId.trim();
  const stepOrder = Math.trunc(step.stepOrder);

  return (
    (protocolId === 'PET_CT' && stepOrder === 4) ||
    (protocolId === 'PSMA_DIAGNOSIS' && stepOrder === 4)
  );
}
