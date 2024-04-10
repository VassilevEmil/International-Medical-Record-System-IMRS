import mongoose, { Document, Schema, Model } from "mongoose";

export interface MedicalRecordModelInterface extends Document {
  doctorFirstName: string;
  doctorLastName: string;
  sendingInstitution: string;
  diagnosisName: string;
  contentText: string;
  contentImage: string;
  language: string;
  patientId: string;
}

export const MedicalRecordSchema: Schema = new mongoose.Schema({
  doctorFirstName: {
    type: String,
    required: false,
  },
  doctorLastName: {
    type: String,
    required: false,
  },
  sendingInstitution: {
    type: String,
    required: false,
  },
  diagnosisName: {
    type: String,
    required: false,
  },
  contentText: {
    type: String,
    required: false,
  },
  contentImage: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  patientId: {
    type: String,
    required: false,
  },
});

export const MedicalRecordModel: Model<MedicalRecordModelInterface> =
  mongoose.model<MedicalRecordModelInterface>(
    "MedicalRecord",
    MedicalRecordSchema
  );

export default MedicalRecordModel;
