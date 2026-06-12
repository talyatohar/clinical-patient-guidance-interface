/** Patient record from the Patients sheet */
export interface Patient {
  idNumber: string;
  verificationCode: string;
  firstName: string;
  lastName: string;
  examType: string;
  /** Local time in HH:mm format */
  appointmentTime: string;
  protocolId: string;
  currentStepIndex: number;
  status: string;
  notes: string | null;
}
