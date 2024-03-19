import { MedicalRecord } from "../models/medicalRecord";

export function createMedicalRecord(
  doctorFirstName: string,
  doctorLastName: string,
  sendingInstitution: string,
  diagnosisName: string,
  contentText: string,
  contentImage: string | undefined, //Not required
  language: "EN" | "DK",
  patientId: string
): MedicalRecord {
  const medicalRecord: MedicalRecord = {
    id: generateId(),
    doctorFirstName: doctorFirstName,
    doctorLastName: doctorLastName,
    sendingInstitution: sendingInstitution,
    dateCreated: new Date(),
    diagnosisName: diagnosisName,
    contentText: contentText,
    contentImage: contentImage,
    language: language,
    patientId: patientId
  };

  return medicalRecord;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15); // Random ass id
}
