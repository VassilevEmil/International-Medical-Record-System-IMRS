export interface PatientData {
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  address?: string;
  dateOfBirth?: Date;
  age?: number;
  phoneNumber?: string;
}