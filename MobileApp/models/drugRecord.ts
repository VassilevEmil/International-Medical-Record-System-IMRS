import { DurationType } from "../enums";

interface DrugRecord extends Document {
  id: string;
  patientId: string;
  nameOfDrug: string;
  startTreatmentDate: string;
  durationType: DurationType;
  duration: number;
  isActive: boolean;
  timeStamp: Date;
  comment: string;
  prescribedBy: string;
}

export interface DrugRecordResponse {
  drugRecords: DrugRecord[];
  nameOfDrug: string;
  total: number;
}
