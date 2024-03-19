import { MedicalRecord } from "../models/medicalRecord";

export class Encrypt {
    constructor(){};

    encrypt(medicalRecord: MedicalRecord): MedicalRecord{
        // Pretend encryption is happening lol
        // -.-
        console.log("Medical record encrypted :)", medicalRecord.id)

        return medicalRecord;
    }
}