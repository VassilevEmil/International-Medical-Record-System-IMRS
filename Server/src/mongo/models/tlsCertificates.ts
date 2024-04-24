import mongoose, { Document, Schema, Model } from 'mongoose';
import { InstitutionInterface, InstitutionSchema } from './institution';

export interface TLScertificatesInterface extends Document {
    fingerPrintSHA256: string,
    institution: InstitutionInterface
}

export const TLScertificatesSchema: Schema = new mongoose.Schema({
    fingerPrintSHA256: {
        type: String,
        required: true
    },
    institution: {
        type: InstitutionSchema,
        required: true
    }
});

const TLScertificatesModel: Model<TLScertificatesInterface> = mongoose.model<TLScertificatesInterface>('TLScertificates', TLScertificatesSchema);

export default TLScertificatesModel;