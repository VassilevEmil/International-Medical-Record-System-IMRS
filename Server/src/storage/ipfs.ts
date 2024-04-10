import axios from "axios";
import { MedicalRecord } from "../models/medicalRecord";
import { FileInfo } from "../models/fileInfo";


export async function pinJSONToIPFS(json: any) {
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

export async function uploadMedicalRecordToIpfs(medicalRecord: MedicalRecord): Promise<string> {
  const fileHashes: (string | undefined)[] = medicalRecord.files?.map(file => file.fileHash) || [];

  medicalRecord.files?.forEach(file => {
    file.fileHash = undefined;
  });

  const textResult = await pinJSONToIPFS(medicalRecord);

  // Restore the original fileHash values
  medicalRecord.files?.forEach((file, index) => {
    file.fileHash = fileHashes[index];
  });

  return `ipfs://${textResult.IpfsHash}`;
}

export async function uploadFilesToIpfs(filesIncoming: Express.Multer.File[]): Promise<string[]> {
  try {
    const files: string[] = [];

    for (const file of filesIncoming) {
      const textResult = await pinJSONToIPFS(file);
      files.push(`ipfs://${textResult.IpfsHash}`);
      console.log(`File data uploaded: ipfs://${textResult.IpfsHash}`);
    }

    return files;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}