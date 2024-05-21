import { Language, TypeOfRecord } from "../../enums";
import { FileInfo } from "./fileInfo";
import { InstitutionForDisplay } from "./institution";

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  institution: InstitutionForDisplay;
  timeStamp: Date;
  language: Language;
  title: string;
  text: string[];
  files?: FileInfo[];
  typeOfRecord: TypeOfRecord;
}
export interface MedicalRecordsResponse {
  medicalRecords: MedicalRecord[];
  total: number;
}
