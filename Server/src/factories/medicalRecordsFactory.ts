import { error } from "console";
import { Country, Language, TypeOfRecord } from "../enums";
import { Institution } from "../models/institution";
import { MedicalRecord } from "../models/medicalRecord";
import {
  addInstitution,
  getInstitutionById,
} from "../mongo/controllers/institutionController";

export async function createMedicalRecord(
  institutionId: string,
  patientId: string,
  title: string,
  textInput: string[],
  typeOfRecord: TypeOfRecord,
  doctorId: string,
  doctorFirstName: string,
  doctorLastName: string,
  language: Language,
  fileInput?: Express.Multer.File[]
): Promise<MedicalRecord> {
  const institution = await getInstitution(institutionId);

  const medicalRecord: MedicalRecord = {
    id: generateId(),
    patientId: patientId,
    doctorId: doctorId,
    doctorFirstName: doctorFirstName,
    doctorLastName: doctorLastName,
    institution: institution,
    timeStamp: new Date(),
    language: language,
    title: title,
    text: textInput,
    files: fileInput || undefined,
    typeOfRecord: typeOfRecord,
  };

  return medicalRecord;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15); // Random ass id
}

async function getInstitution(institutionId: string): Promise<Institution> {
  try {
    const institution = await getInstitutionById(institutionId);

    return institution;
  } catch (error) {
    throw `Institution not found with id: ${institutionId} `;
  }
}
