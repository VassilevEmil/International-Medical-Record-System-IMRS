import axios from "axios";
import fs from "fs";
import MedicalRecordModel from "../mongo/models/medicalRecord";
import { MedicalRecord } from "../models/medicalRecord";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import { Readable } from "stream";
import { log } from "console";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/database";

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

      console.log(
        "the full upload to DB:  ////",
        "file name: ",
        uploadStream.filename,
        "//// content type: ",
        uploadStream.chunkSizeBytes
      );
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

// for testing purposes, need to implement this elsewhere i guess
export async function fetchFileFromMongoDB(fileId: string) {
  await connectToDatabase();
  const bucket = new GridFSBucket(mongoose.connection.db);

  try {
    const fileObjectId = new ObjectId(fileId);
    const downloadStream = bucket.openDownloadStream(fileObjectId);

    const chunks: any[] = [];
    downloadStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      // At this point, 'buffer' contains the entire file content
      // You can handle this buffer according to your application's needs
      // For example, you can serve it to the client-side application
      // Or you can save it to the server's filesystem

      // If serving to the client-side, you can send the buffer in the response
      // res.send(buffer);

      // If saving to the server's filesystem, you can write the buffer to a file
      // fs.writeFileSync('path/to/save/file.pdf', buffer);
    });

    downloadStream.on("error", (error) => {
      console.error("Failed to fetch file from MongoDB:", error);
    });
  } catch (error) {
    console.error("Failed to fetch file from MongoDB:", error);
  }
}

// Example usage:
const fileId = "660d1513c52c1fe7a24351c3"; // Replace with the actual file ID
fetchFileFromMongoDB(fileId)
  .then((imageDataUrl) => {
    // for displaying the photo in the app

    console.log("Successfully fetched photo from MongoDB:", imageDataUrl);
  })
  .catch((error) => {
    console.error("Failed to fetch photo from MongoDB:", error);
  });
