import { Language, TypeOfRecord } from "../enums"
import { FileInfo } from "./fileInfo"
import { Institution } from "./institution"

export interface MedicalRecord {
  id: string,
  patientId: string,
  doctorId: string,
  doctorFirstName: string,
  doctorLastName: string,
  institution: Institution,
  timeStamp: Date,
  language: Language,
  title: string,
  text: string[],
  files?: FileInfo[],
  typeOfRecord: TypeOfRecord
}
export interface MedicalRecordsResponse {
  medicalRecords: MedicalRecord[];
  total: number;
}
