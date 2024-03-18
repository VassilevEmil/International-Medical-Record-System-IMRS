import mongoose, { Schema, Model } from "mongoose";

// Define patient schema
const MedicalRecordSchema = new Schema({
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  diagnose: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

// Define patient model type

// Export patient model
module.exports = mongoose.model("Medical records", MedicalRecordSchema);
export { MedicalRecordSchema };
