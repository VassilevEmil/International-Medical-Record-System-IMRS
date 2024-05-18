import { DurationType } from "../../enums";
import { MedicalRecord } from "./medicalRecord";

export interface extendedDrugRecord extends MedicalRecord {
  id: string;
  medicalRecordId: MedicalRecord;
  patientId: string;
  nameOfDrug: string;
  startTreatmentDate: Date;
  durationType: DurationType;
  duration: number;
  isActive: boolean;
  timeStamp: Date;
  comment: string;
  prescribedBy: string;
}

export interface extendedDrugRecordResponse {
  drugRecords: extendedDrugRecord[];
  total: number;
}
