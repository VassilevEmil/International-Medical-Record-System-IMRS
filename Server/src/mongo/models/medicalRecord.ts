import mongoose, { Document, Schema, Model } from "mongoose";
import { Institution } from "../../models/institution";
import { InstitutionSchema } from "./institution";
import { TypeOfRecord } from "../../enums";
import { FileInfo } from "../../models/fileInfo";
import { FileInfoSchema } from "./fileInfo";

export interface MedicalRecordModelInterface extends Document {
  id: string;
  patientId: string;
  institution: Institution;
  typeOfRecord: TypeOfRecord;
  medicalRecordHash: string;
  fileHash?: FileInfo[];
  timeStamp: Date;
}

export const MedicalRecordSchema: Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  institution: {
    type: InstitutionSchema,
    required: true,
  },
  typeOfRecord: {
    type: String,
    enum: Object.values(TypeOfRecord),
    required: false,
  },
  medicalRecordHash: {
    type: String,
    required: true,
  },
  fileHash: [{
    type: FileInfoSchema,
    required: false,
  }],
  timeStamp: {
    type: Date,
    required: true,
  },
});

export const MedicalRecordModel: Model<MedicalRecordModelInterface> =
  mongoose.model<MedicalRecordModelInterface>(
    "MedicalRecord",
    MedicalRecordSchema
  );

export default MedicalRecordModel;
