import axios from "axios";
import fs from "fs";
import MedicalRecordModel from "../mongo/models/medicalRecord";
import { MedicalRecord } from "../models/medicalRecord";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import { Readable } from "stream";

async function pinJSONToIPFS(json: any) {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  try {
    const response = await axios.post(url, json, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    throw error;
  }
}

export async function uploadMedicalRecord(medicalRecord: MedicalRecord) {
  try {
    const recordWithoutImage = { ...medicalRecord, contentImage: undefined };

    const textResult = await pinJSONToIPFS(recordWithoutImage);
    console.log(`Text data uploaded: ipfs://${textResult.IpfsHash}`);

    // Assuming imagePath logic is implemented here

    let imageCID = "";
    if (medicalRecord.files && medicalRecord.files.length > 0) {
      const file = medicalRecord.files[0]; // Assuming only one file is uploaded
      const bucket = new GridFSBucket(mongoose.connection.db);
      const uploadStream = bucket.openUploadStream(file.originalname);
      const fileStream = Readable.from(file.buffer);
      await fileStream.pipe(uploadStream);

      imageCID = `mongodb://${uploadStream.id}`;
      console.log(`Image uploaded to MongoDB: ${imageCID}`);
    }

    // Save the medical record to MongoDB
    const newMedicalRecord = new MedicalRecordModel({
      ...medicalRecord,
      textCID: `ipfs://${textResult.IpfsHash}`,
      imageCID: imageCID,
    });
    await newMedicalRecord.save();
    console.log("Uploaded to database");

    return { textCID: `ipfs://${textResult.IpfsHash}`, imageCID: imageCID };
  } catch (error) {
    console.error("Error uploading medical record:", error);
    throw error;
  }
}
