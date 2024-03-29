import { Institution } from "../../models/institution";
import SSLcertificatesModel from "../models/SSLcertificates";

export async function addSSLCertificate(fingerPrintSHA256: string, institution: Institution) {
    const sslCertificate = new SSLcertificatesModel({
      fingerPrintSHA256: fingerPrintSHA256,
      institution: institution
    });
  
    try {
      const result = await sslCertificate.save();
      console.log(result);
    } catch (error) {
      console.error('Error creating SSL certificate:', error);
    }
  }
  
  export async function isFingerprintValid(fingerPrintSHA256: string): Promise<string | null> {
    try {
        const certificate = await SSLcertificatesModel.findOne({ fingerPrintSHA256: fingerPrintSHA256 })
                               .populate('institution')
                               .exec();

        if (certificate && certificate.institution) {
            return certificate.institution.name;
        }

        return null;
    } catch (error) {
        console.error('Error checking SSL certificate:', error);
        throw error;
    }
}