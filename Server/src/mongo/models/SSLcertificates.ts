import mongoose, { Document, Schema, Model } from 'mongoose';
import { InstitutionInterface, InstitutionSchema } from './institution';

export interface SSLcertificatesInterface extends Document {
    fingerPrintSHA256: string,
    institution: InstitutionInterface
}

export const SSLcertificatesSchema: Schema = new mongoose.Schema({
    fingerPrintSHA256: {
        type: String,
        required: true
    },
    institution: {
        type: InstitutionSchema,
        required: true
    }
});

const SSLcertificatesModel: Model<SSLcertificatesInterface> = mongoose.model<SSLcertificatesInterface>('SSLcertificates', SSLcertificatesSchema);

export default SSLcertificatesModel;
