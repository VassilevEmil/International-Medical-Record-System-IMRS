import { FileInfo } from "../../models/fileInfo";
import { MedicalRecord, MedicalRecordsResponse } from "../../models/medicalRecord";
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
  if(!medicalRecordHash){
    throw Error("Medical record hash not provided");
  }

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
 * @returns {Promise<FileInfo>} -  A promise that resolves with a data object containing information and
 * data from the file, such as its hash.
 */

// MARTY: PROMISE ANY IS BYPASS, IT WAS added solely for simulation purposes and quick checks.
// SHOULD BE REMOVED LATER ON and should be passed a specific promise that results in a specific interface
export async function getFileInfoFromDb(
  medicalRecordId: string,
  fileId: string
): Promise<FileInfo> {
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
    console.error(`Failed to get file with ID: ${fileId} from medical record ID: ${medicalRecordId}`);
    throw new Error(`Failed to get file with ID: ${fileId} from medical record ID: ${medicalRecordId}`);
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
    console.error(`Error fetching medical record with ID: ${medicalRecordId}`,error);
    throw new Error(`Error fetching medical record with ID: ${medicalRecordId}`);
  }
}

export async function getMedicalRecordsByPatientId(
  patientId: string,
  page: number,
  limit: number,
  filters?: any // This parameter can be extended later to handle various filters
): Promise<MedicalRecordsResponse> {
  try {

    const query = { patientId, ...filters };
    const total = await MedicalRecordReferenceModel.countDocuments(query);

    const medicalRecordReferences = await MedicalRecordReferenceModel.find(query)
      .sort({ timeStamp: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select("medicalRecordHash")
      .exec();

    const medicalRecords: MedicalRecord[] = await Promise.all(
      medicalRecordReferences.map(async (reference) => {
        return getMedicalRecordFromIpfs(reference.medicalRecordHash);
      })
    );

    return { medicalRecords, total };

  } catch (error) {
    console.error(
      `Failed to get medical records by patientId: ${patientId}`,
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