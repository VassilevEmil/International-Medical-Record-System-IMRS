import { TypoeOfTreament } from "../enums";

interface TreatmentPlan {
    id: string,
    patientId: string,
    name: string,
    type: TypoeOfTreament,
    startTreatmentDate: Date,
    endTreatmentDate: Date,
    isActive: Boolean,
    timeStamp: Date,
}

export interface TreatmentMedicament extends TreatmentPlan {
    dosage: string,
    duration: Date, // ? Probably date should be fine
    timesToTake: string,
    comment: string,
}

export interface TreatmentOther extends TreatmentPlan {
    somethingElse: string,
    comment: string,
}