/** Protocol step record from the ProtocolSteps sheet */
export interface ProtocolStep {
  protocolId: string;
  stepOrder: number;
  stepTitleEn: string;
  stepTitleHe: string;
  stepType: string;
  estimatedMinutes: number;
}
