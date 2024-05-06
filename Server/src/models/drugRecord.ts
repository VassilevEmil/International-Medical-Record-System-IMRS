import { DurationType } from "../enums";

interface DrugRecord extends Document {
  id: string;
  patientId: string;
  nameOfDrug: string;
  startTreatmentDate: Date;
  durationType: DurationType;
  duration: number;
  isActive: boolean;
  timeStamp: Date;
  comment: string;
  prescribedBy: string; // doctor's signature or any other relevant info
}

export interface MedicalRecordsResponse {
  medicalRecords: DrugRecord[];
  total: number;
}
