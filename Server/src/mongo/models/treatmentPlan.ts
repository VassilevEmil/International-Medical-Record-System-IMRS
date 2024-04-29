import mongoose, { Document, Schema, Model } from "mongoose";
import { TypoeOfTreament } from "../../enums";

interface TreatmentPlan extends Document {
    id: string,
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

const TreatmentMedicamentSchema: Schema<TreatmentMedicament> = new Schema({
    patientId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(TypoeOfTreament), required: true },
    startTreatmentDate: { type: Date, required: true },
    endTreatmentDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
    timeStamp: { type: Date, required: true },
    dosage: { type: String, required: true },
    duration: { type: Date, required: true },
    timesToTake: { type: String, required: true },
    comment: { type: String, required: true }
});

const TreatmentOtherSchema: Schema<TreatmentOther> = new Schema({
    patientId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(TypoeOfTreament), required: true },
    startTreatmentDate: { type: Date, required: true },
    endTreatmentDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
    timeStamp: { type: Date, required: true },
    somethingElse: { type: String, required: true },
    comment: { type: String, required: true }
});

export const TreatmentMedicamentModel: Model<TreatmentMedicament> = mongoose.model<TreatmentMedicament>('TreatmentMedicament', TreatmentMedicamentSchema);
export const TreatmentOtherModel: Model<TreatmentOther> = mongoose.model<TreatmentOther>('TreatmentOther', TreatmentOtherSchema);
