import mongoose, { Document, Schema, Model } from 'mongoose';
import { Country } from '../../enums';

export interface InstitutionInterface extends Document {
    id: string,
    institutionId: string,
    name: string,
    country: Country,
    address: string
}

export const InstitutionSchema: Schema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    institutionId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    country: {
        type: Country,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const InstitutionModel: Model<InstitutionInterface> = mongoose.model<InstitutionInterface>('Institution', InstitutionSchema);

export default InstitutionModel;
