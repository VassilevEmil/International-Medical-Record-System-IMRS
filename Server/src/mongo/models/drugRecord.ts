import mongoose, { Schema, model, Document } from "mongoose";
import { DurationType } from "../../enums";

interface DrugRecord extends Document {
  id: string;
  patientId: string;
  nameOfDrug: string;
  startTreatmentDate: Date;
  durationType: DurationType;
  duration: number;
  isActive: boolean;
  timeStamp: Date;
  comment: string;
  prescribedBy: string; // doctor's signature or any other relevant info
}

const DrugRecordSchema: Schema<DrugRecord> = new Schema({
  id: { type: String, required: true },
  patientId: { type: String, required: true },
  nameOfDrug: { type: String, required: true },

  startTreatmentDate: { type: Date, required: true },
  durationType: {
    type: String,
    enum: Object.values(DurationType),
    required: true,
  },
  duration: { type: Number, required: false },
  isActive: { type: Boolean, required: true },
  timeStamp: { type: Date, required: true },
  comment: { type: String, required: true },
  prescribedBy: { type: String, required: true },
});

const DrugRecordModel = model<DrugRecord>("DrugRecord", DrugRecordSchema);

export { DrugRecordModel, DrugRecord };
