import axios from 'axios';
import fs from 'fs';
import MedicalRecordModel from "../mongo/models/medicalRecord";
import { MedicalRecord } from "../models/medicalRecord";

async function pinJSONToIPFS(json: any) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  try {
    const response = await axios.post(url, json, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw error;
  }
}

export async function uploadMedicalRecord(medicalRecord: MedicalRecord) {
  try {
    const recordWithoutImage = { ...medicalRecord, contentImage: undefined };
    
    const textResult = await pinJSONToIPFS(recordWithoutImage);
    console.log(`Text data uploaded: ipfs://${textResult.IpfsHash}`);

    // Assuming imagePath logic is implemented here

    // Save the medical record to MongoDB
    try {
      const newMedicalRecord = new MedicalRecordModel({
        ...medicalRecord,
        textCID: `ipfs://${textResult.IpfsHash}`,
        // imageCID should be added here after implementing image upload
      });
      await newMedicalRecord.save();
      console.log("Uploaded to database");
    } catch (error) {
      console.error("Failed to upload to database:", error);
      throw error;
    }

    return { textCID: `ipfs://${textResult.IpfsHash}`, imageCID: "ipfs://<fake_image_path>" };
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}
