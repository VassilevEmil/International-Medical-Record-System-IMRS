import { Institution } from "../../models/institution";
import TLScertificatesModel from "../models/tlsCertificates";

export async function addTLSCertificate(fingerPrintSHA256: string, institution: Institution) {
    const tlsCertificate = new TLScertificatesModel({
      fingerPrintSHA256: fingerPrintSHA256,
      institution: institution
    });
  
    try {
      const result = await tlsCertificate.save();
    } catch (error) {
      console.error('Error creating TLS certificate:', error);
    }
  }
  
  export async function isFingerprintValid(fingerPrintSHA256: string): Promise<string | null> {
    try {
        const certificate = await TLScertificatesModel.findOne({ fingerPrintSHA256: fingerPrintSHA256 })
                               .populate('institution')
                               .exec();

        if (certificate && certificate.institution) {
            return certificate.institution.name;
        }

        return null;
    } catch (error) {
        console.error('Error checking TLS certificate:', error);
        throw error;
    }
}