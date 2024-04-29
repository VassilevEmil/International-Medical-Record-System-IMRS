import mongoose, { Schema, model, Document } from "mongoose";
import { TypoeOfTreament } from "../../enums";

interface TreatmentPlan extends Document {
  id: string;
  patientId: string;
  name: string;
  type: TypoeOfTreament;
  startTreatmentDate: Date;
  endTreatmentDate: Date;
  isActive: boolean;
  timeStamp: Date;
}

interface TreatmentMedicament extends TreatmentPlan {
  dosage: string;
  duration: Date;
  timesToTake: string;
  comment: string;
}

interface TreatmentOther extends TreatmentPlan {
  somethingElse: string;
  comment: string;
}

const TreatmentPlanSchema: Schema<TreatmentPlan> = new Schema(
  {
    id: { type: String, required: true },
    patientId: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(TypoeOfTreament),
      required: true,
    },
    startTreatmentDate: { type: Date, required: true },
    endTreatmentDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
    timeStamp: { type: Date, required: true },
  },
  { discriminatorKey: "type" }
);

const TreatmentPlanModel = model<TreatmentPlan>(
  "TreatmentPlan",
  TreatmentPlanSchema
);

const TreatmentMedicamentModel =
  TreatmentPlanModel.discriminator<TreatmentMedicament>(
    TypoeOfTreament.Medicament,
    new Schema({
      dosage: { type: String, required: true },
      duration: { type: Date, required: true },
      timesToTake: { type: String, required: true },
      comment: { type: String, required: true },
    })
  );

const TreatmentOtherModel = TreatmentPlanModel.discriminator<TreatmentOther>(
  TypoeOfTreament.Other,
  new Schema({
    somethingElse: { type: String, required: true },
    comment: { type: String, required: true },
  })
);

export {
  TreatmentPlanModel,
  TreatmentMedicamentModel,
  TreatmentOtherModel,
  TreatmentPlan,
};
