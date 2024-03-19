import { Document, Model, model, Schema } from "mongoose";

// Define patient model type
export interface MedicalRecordModelInterface extends Document {
  doctorFirstName: string;
  doctorLastName: string;
  sendingInstitution: string;
  diagnosisName: string;
  contentText: string;
  contentImage: string;
  language: string;
  patientId: string;
  symptoms: string;
}

const MedicalRecordSchema: Schema<MedicalRecordModelInterface> = new Schema({
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
  symptoms: {
    type: String,
    required: false,
  },
});

const MedicalRecordModel: Model<MedicalRecordModelInterface> =
  model<MedicalRecordModelInterface>("MedicalRecord", MedicalRecordSchema);

export default MedicalRecordModel;
