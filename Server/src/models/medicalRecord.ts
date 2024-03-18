import { Patient } from "./patient";

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorFirstName: string;
  doctorLastName: string;
  sendingInstitution: string;
  dateCreated: Date;
  diagnosisName: string;
  contentText: string;
  contentImage?: string; //Assuming we encrypt using AES, expect to receive binary
  language: "EN" | "DK";
  symptoms: string;
  isEncrypted: boolean;
}
