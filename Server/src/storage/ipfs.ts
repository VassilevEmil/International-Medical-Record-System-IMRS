import pinataSDK from "@pinata/sdk";
import fs from "fs";
import { MedicalRecord } from "../models/medicalRecord";
import mongoose from "mongoose";
import { MedicalRecordSchema } from "../mongo/MedicalRecordSchema/MedicalRecordSchema";

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

const MedicalRecordModel = mongoose.model("MedicalRecord", MedicalRecordSchema);

//  key = "b455b488582980fd72b1"
// secret = 32a4fad27c665880402a5e1715e5f07a288fcf399b3faf372b11243293cf5d1c

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
      textCID: textResult.IpfsHash,
      imageCID: imagePath,
    });
    await newMedicalRecord.save();

    return { textCID: textResult.IpfsHash, imageCID: imagePath };
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}
