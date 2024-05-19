import { TypeOfRecord } from "../enums";
import { FileInfo } from "./fileInfo";
import { InstitutionForDisplay } from "./institution";

export interface MedicalRecordReference {
  id: string;
  patientId: string;
  institution: InstitutionForDisplay;
  typeOfRecord: TypeOfRecord;
  medicalRecordHash: string;
  fileHash?: FileInfo[];
  timeStamp: Date;
}