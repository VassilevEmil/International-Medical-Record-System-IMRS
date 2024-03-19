import mongoose, { Schema } from "mongoose";

// Define patient schema
const MedicalRecordSchema = new Schema({
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

export default mongoose.model("MedicalRecord", MedicalRecordSchema);
