import mongoose, { Document, Schema, Model } from 'mongoose';

export interface MedicalHistoryInterface extends Document {
    patientId: string,
    diagnosisList: string[],
    dateCreated: Date,
}

export const MedicalHistorySchema: Schema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
    },
    diagnosisList: {
        type: [String],
        require: true,
    },
    dateCreated: {
        type: Date,
        require: true,
    }
});

const MedicalHistoryModel: Model<MedicalHistoryInterface> = mongoose.model<MedicalHistoryInterface>('MedicalHistory', MedicalHistorySchema);

export default MedicalHistoryModel;
