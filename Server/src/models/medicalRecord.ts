import { Language, TypeOfRecord } from "../enums"
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
  files?: FormData[] ,
  typeOfRecord: TypeOfRecord
}
