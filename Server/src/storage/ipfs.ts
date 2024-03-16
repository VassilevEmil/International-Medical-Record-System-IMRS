import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import { MedicalRecord } from "../models/medicalRecord";

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

export async function uploadMedicalRecord(medicalRecord: MedicalRecord) {
    try {
        const recordWithoutImage = { ...medicalRecord, contentImage: undefined };
        const recordJson = JSON.stringify(recordWithoutImage);

        const textResult = await pinata.pinJSONToIPFS(recordWithoutImage);
        console.log(`Text data uploaded: ${textResult.IpfsHash}`);

        let imagePath = null;
        console.log("Content IMAGE ", medicalRecord.contentImage);
        if (medicalRecord.contentImage) {
            const readableStreamForImage = fs.createReadStream(medicalRecord.contentImage);
            const imageResult = await pinata.pinFileToIPFS({file: readableStreamForImage});
            imagePath = imageResult.IpfsHash;
            console.log(`Image uploaded: ${imagePath}`);
        }

        return { textCID: textResult.IpfsHash, imageCID: imagePath };
    } catch (error) {
        console.error('Error uploading to Pinata:', error);
        throw error;
    }
}
