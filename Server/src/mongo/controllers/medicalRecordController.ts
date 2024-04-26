import { FileInfo } from "../../models/fileInfo";
import { MedicalRecord } from "../../models/medicalRecord";
import MedicalHistoryModel, {
  MedicalRecordReferenceModel,
} from "../models/medicalRecordReference";
import { getMedicalRecordFromIpfs } from "../../storage/ipfs";
import { MedicalRecordReference } from "../../models/medicalRecordReference";

export async function addMedicalRecordToDb(
  medicalRecord: MedicalRecord,
  medicalRecordHash: string,
  fileHash?: FileInfo[]
) {
  try {
    const newMedicalRecord = new MedicalRecordReferenceModel({
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

export async function getFileInfo(
  medicalRecordId: string,
  fileId: string
): Promise<any> {
  try {
    const medicalRecordReference = await getMedicalRecordReferenceById(medicalRecordId);

    if (!medicalRecordReference) {
      throw new Error(`Medical record with ID ${medicalRecordId} not found`);
    }

    const fileInfo = medicalRecordReference.fileHash?.find((file) => file.id === fileId);

    if (!fileInfo || !fileInfo.fileHash) {
      throw new Error(`Image with ID ${fileId} not found in medical record`);
    }

    return fileInfo;
  } catch (error) {
    console.error(
      `Failed to get file with ID: ${fileId} from medical record ID: ${medicalRecordId}`
    );
    throw error;
  }
}

export async function getMedicalRecordById(medicalRecordId: string): Promise<MedicalRecord>{
  try {
    // find record in mongo database, if there is one (fetch neccessary data, such as record hash)
    const medicalRecordReference = await getMedicalRecordReferenceById(medicalRecordId);

    if (!medicalRecordReference) {
      throw Error();
    }

    const medicalRecord: MedicalRecord = await getMedicalRecordFromIpfs(
      medicalRecordReference.medicalRecordHash
    );

    return medicalRecord;
  } catch (error) {
    console.error(
      `Error fetching medical record with ID: ${medicalRecordId}`,
      error
    );
    throw error;
  }
}

// !! Change / remove after pagination
export async function getTenMedicalRecordByPatientId(
  patientId: string
): Promise<MedicalRecord[]> {
  try {
    const medicalRecords = await MedicalRecordReferenceModel.find({ patientId })
      .sort({ timeStamp: -1 })
      .limit(10)
      .select("medicalRecordHash")
      .exec();

    const fetchedRecords: MedicalRecord[] = await Promise.all(
      medicalRecords.map(async (record) => {
        const recordJson: MedicalRecord = await getMedicalRecordFromIpfs(
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

// !! Change / remove after pagination
export async function getAllMedicalHistoriesByPatientId(
  patientId: string,
  page = 1,
  limit = 5
) {
  try {
    const medicalRecords = await MedicalHistoryModel.aggregate([
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
    // return { total: medicalRecords.length, data: medicalRecords };

    if (medicalRecords.length === 0) {
      console.log(`No medical history found for patientId: ${patientId}`);
      return null;
    }

    console.log(`Found medical history for patientId: ${patientId}`);
    return medicalRecords;
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

 async function getMedicalRecordReferenceById(medicalRecordId: string): Promise<MedicalRecordReference> {
  try {
    const medicalRecordReference: MedicalRecordReference | null = await MedicalRecordReferenceModel.findOne({
      id: medicalRecordId,
    }).exec();

    if(!medicalRecordReference){
      throw Error();
    }

    return medicalRecordReference;
  }
  catch(error){
    throw new Error(`Medical Record Reference not found with ID: ${medicalRecordId}`);
  }
}