import axios from "axios";
import { FileInfo } from "../../models/fileInfo";
import { MedicalRecord } from "../../models/medicalRecord";
import MedicalHistoryModel, {
  MedicalRecordModel,
} from "../models/medicalRecord";

export async function uploadMedicalRecordToDb(
  medicalRecord: MedicalRecord,
  medicalRecordHash: string,
  fileHash?: FileInfo[]
) {
  if(!medicalRecordHash){
    throw Error("Medical record hash not provided");
  }

  try {
    const newMedicalRecord = new MedicalRecordModel({
      id: medicalRecord.id,
      patientId: medicalRecord.patientId,
      institution: medicalRecord.institution,
      typeOfRecord: medicalRecord.typeOfRecord,
      medicalRecordHash: medicalRecordHash,
      fileHash: fileHash,
      timeStamp: medicalRecord.timeStamp,
    });

    await newMedicalRecord.save();
    console.log("Uploaded medical record to database");
  } catch (error) {
    console.error("Failed to upload medical record to database", error);
    throw new Error("Failed to upload medical record to database");
  }
}

/**
 * Retrieves file information from a medical record by its ID and file's ID.
 * It searches for a medical record in the MongoDB (our) database using the provided medicalRecordId.
 * If the medical record is found, then it looks for specific file within that record by the fileId.
 *
 * The file information includes details like the file hash, which is necessary for retrieving the actual file,
 * that is stored in a decentralized file storage - IPFS (in our case).
 *
 * @param {string} medicalRecordId - The unique ID of medical record.
 * @param {string} fileId - The unique ID of the file that is associated with specific medical record.
 * @returns {Promise<any>} -  A promise that resolves with a data object containing information and
 * data from the file, such as its hash.
 */

// MARTY: PROMISE ANY IS BYPASS, IT WAS added solely for simulation purposes and quick checks.
// SHOULD BE REMOVED LATER ON and should be passed a specific promise that results in a specific interface

export async function getFile(
  medicalRecordId: string,
  fileId: string
): Promise<any> {
  try {
    // Try to find medical record in the database by med. record. ID
    const medicalRecord = await MedicalRecordModel.findOne({
      id: medicalRecordId,
    }).exec();

    // Check if medical record was found.
    if (!medicalRecord) {
      throw new Error(`Medical record with ID ${medicalRecordId} not found`);
    }

    // try to find the specific file's info within the medical record by file ID
    const fileInfo = medicalRecord.fileHash?.find((file) => file.id === fileId);

    // Check if the file info (including hash) was found
    if (!fileInfo || !fileInfo.fileHash) {
      throw new Error(`Image with ID ${fileId} not found in medical record`);
    }

    // Return fileInfo
    return fileInfo;
  } catch (error) {
    console.error(
      `Failed to get file with ID: ${fileId} from medical record ID: ${medicalRecordId}`
    );
    throw error;
  }
}

// export async function getTenMedicalRecordByPatientId(
//   patientId: string
// ): Promise<MedicalRecord[]> {

export async function getMedicalRecordById(medicalRecordId: string) {
  try {
    // find record in mongo database, if there is one (fetch neccessary data, such as record hash)
    const medicalRecord = await MedicalRecordModel.findOne({
      id: medicalRecordId,
    }).exec();
    if (!medicalRecord) {
      return undefined;
    }
    // fetch record from ipfs using the previously fetched data/reference
    const recordJson: MedicalRecord = await fetchIpfsRecordAsJson(
      medicalRecord.medicalRecordHash
    );
    // return record data from the IPFS in json
    return recordJson;
  } catch (error) {
    console.error(
      `Error fetching medical record with ID: ${medicalRecordId}`,
      error
    );
    throw error;
  }
}

export async function getTenMedicalRecordByPatientId(
  patientId: string
): Promise<MedicalRecord[]> {
  try {
    const medicalRecords = await MedicalRecordModel.find({ patientId })
      .sort({ timeStamp: -1 })
      .limit(10)
      .select("medicalRecordHash")
      .exec();

    const fetchedRecords: MedicalRecord[] = await Promise.all(
      medicalRecords.map(async (record) => {
        const recordJson: MedicalRecord = await fetchIpfsRecordAsJson(
          record.medicalRecordHash
        );

        return recordJson;
      })
    );

    return fetchedRecords;
  } catch (error) {
    console.error(
      `Failed to get medical records by patientId: ${patientId}`,
      error
    );
    throw error;
  }
}

export async function getAllMedicalHistoriesByPatientId(
  patientId: string,
  page = 1,
  limit = 5
) {
  try {
    // const medicalHistories = await MedicalHistoryModel.find({
    //   patientId: patientId,
    // })
    //   .sort({ dateCreated: -1 }) // Sort by createdAt in descending order (newest first)
    //   .exec();

    const medicalHistories = await MedicalHistoryModel.aggregate([
      {
        $match: { patientId: patientId },
      },
      {
        $sort: { createdAt: -1 }, // Sort by createdAt in descending order
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);
    // return { total: medicalHistories.length, data: medicalHistories };

    console.log("log from COntroller: ", medicalHistories);

    if (medicalHistories.length === 0) {
      console.log(`No medical history found for patientId: ${patientId}`);
      return null;
    }

    console.log(`Found medical history for patientId: ${patientId}`);
    return medicalHistories;
  } catch (error) {
    console.error(
      `Error fetching medical history for patientId: ${patientId}`,
      error
    );
    throw error;
  }
}

export async function getTenMostRecentMedicalHistoriesById(patientId: string) {
  try {
    const recentMedicalHistories = await MedicalHistoryModel.find({
      patientId: patientId,
    })
      .sort({ dateCreated: -1 })
      .limit(10) // Limit to the 10 most recent documents
      .exec();

    if (recentMedicalHistories.length === 0) {
      console.log(`No medical history found for patientId: ${patientId}`);
      return null;
    }

    console.log(`Found recent medical history for patientId: ${patientId}`);
    return recentMedicalHistories;
  } catch (error) {
    console.error(
      `Error fetching recent medical history for patientId: ${patientId}`,
      error
    );
    throw error;
  }
}

async function fetchIpfsRecordAsJson(ipfsUrl: string): Promise<any> {
  const ipfsHash = ipfsUrl.replace("ipfs://", "");
  const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

  try {
    const response = await axios.get(gatewayUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch from IPFS:", error);
    throw error;
  }
}
