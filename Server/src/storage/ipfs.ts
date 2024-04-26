import axios from "axios";
import { MedicalRecord } from "../models/medicalRecord";
import FormData, { Readable } from 'form-data'; 

// Get file from ipfs
export async function getFileFromIpfs(ipfsHash: string): Promise<Readable> {
  const gatewayUrl = ipfsHash.replace('ipfs://', 'https://ipfs.io/ipfs/');
  // Fetch file using Axios and return response as a stream
  // When we get the file, just return the data part.
  return axios.get(gatewayUrl, { responseType: 'stream' }).then(response => response.data); 
}

// Get Medical Record from ipfs
export async function getMedicalRecordFromIpfs(ipfsUrl: string): Promise<MedicalRecord> {
  const ipfsHash = ipfsUrl.replace("ipfs://", "");
  const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

  try {
    const response = await axios.get(gatewayUrl);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch from IPFS:", error);
    throw error;
  }
}

export async function addMedicalRecordToIpfs(medicalRecord: MedicalRecord): Promise<string> {
  const fileHashes: (string | undefined)[] = medicalRecord.files?.map(file => file.fileHash) || [];

  medicalRecord.files?.forEach(file => {
    file.fileHash = undefined;
  });

  const textResult = await pinDataToIpfsAsJson(medicalRecord);

  // Restore the original fileHash values
  medicalRecord.files?.forEach((file, index) => {
    file.fileHash = fileHashes[index];
  });

  return `ipfs://${textResult.IpfsHash}`;
}

/**
 * This function uploads multiple files to IPFS. 
 * 
 * It takes an array of files processed by Multer and iterates over it,
 * uploading each file to IPFS using the `pinFileToIpfs` function above. 
 * After a file is successfully uploaded, its IPFS hash is stored in an array. 
 * 
 * The function returns an array of strings, with each string being the IPFS URL of an
 * uploaded file. 
 *
 * This function relies on the `pinFileToIpfs` function to handle the actual upload process,
 *
 * @param {Express.Multer.File[]} filesIncoming - An array of file objects processed by Multer, representing the files to be uploaded.
 * @returns {Promise<string[]>} - A promise that resolves with an array of strings, representing the IPFS URLs of the uploaded files.
 *
 */
export async function addFilesToIpfs(filesIncoming: Express.Multer.File[]): Promise<string[]> {
  const files: string[] = [];
  for (const file of filesIncoming) {
    const textResult = await pinFileToIpfs(file);
    files.push(`ipfs://${textResult.IpfsHash}`);
  }
  return files;
}

/* This function uploads a single file to the IPFS using Pinata cloud service.
 * It's designed to work within an Express application where file uploads are handled by Multer middleware.
*/
async function pinFileToIpfs(file: Express.Multer.File): Promise<any> {
  // url - base pinata endpoint for "saving" file within their network
  const url = "https://api.pinata.cloud/pinning/pinFileToIpfs";

  const formData = new FormData();
  // Add the file to the form data. 'file.buffer' is the file content,
  // and 'file.originalname' is the file name.
  formData.append("file", file.buffer, file.originalname);

  try {
    // Make the POST request to Pinata with the file.
    // Attach the necessary headers, such as Pinata API keys.
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });
    // If successful, return the data from the response. 
    // LATER ON SHOULD BE CHANGED TO RESPONSE.OK (200)
    return response.data;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
}

  async function pinDataToIpfsAsJson(data: any) {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    try {
      const response = await axios.post(url, data, {
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