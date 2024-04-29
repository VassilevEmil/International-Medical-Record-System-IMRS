import { TypeOfRecord } from "../enums";
import { FileInfo } from "./fileInfo";
import { Institution } from "./institution";

export interface MedicalRecordReference {
    id: string;
    patientId: string;
    institution: Institution;
    typeOfRecord: TypeOfRecord;
    medicalRecordHash: string;
    fileHash?: FileInfo[];
    timeStamp: Date;
}