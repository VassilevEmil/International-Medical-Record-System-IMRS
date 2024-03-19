import pinataSDK from "@pinata/sdk";
import fs from "fs";
import { MedicalRecord } from "../models/medicalRecord";
import MedicalRecordModel from "../mongo/MedicalRecordModel/MedicalRecordModel";

const pinata = new pinataSDK(process.env.API_KEY, process.env.API_SECRET);

export async function uploadMedicalRecord(medicalRecord: MedicalRecord) {
  try {
    const recordWithoutImage = { ...medicalRecord, contentImage: undefined };
    const recordJson = JSON.stringify(recordWithoutImage);

    const textResult = await pinata.pinJSONToIPFS(recordWithoutImage);
    console.log(`Text data uploaded: ${textResult.IpfsHash}`);

    let imagePath = null;
    console.log("Content IMAGE ", medicalRecord.contentImage);
    if (medicalRecord.contentImage) {
      const readableStreamForImage = fs.createReadStream(
        medicalRecord.contentImage
      );
      const imageResult = await pinata.pinFileToIPFS({
        file: readableStreamForImage,
      });
      imagePath = imageResult.IpfsHash;
      console.log(`Image uploaded: ${imagePath}`);
    }

    // Save the medical record to MongoDB
    const newMedicalRecord = new MedicalRecordModel({
      ...medicalRecord,
      // textCID: textResult.IpfsHash,
      // imageCID: imagePath,
    });
    await newMedicalRecord.save();

    return { textCID: textResult.IpfsHash, imageCID: imagePath };
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}
