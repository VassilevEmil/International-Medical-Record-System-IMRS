import axios from "axios";
import { generateId } from "../../factories/medicalRecordsFactory";
import { FileInfo } from "../../models/fileInfo";
import { MedicalRecord } from "../../models/medicalRecord";
import MedicalHistoryModel, { MedicalRecordModel } from "../models/medicalRecord";

export async function uploadMedicalRecordToDb(medicalRecord: MedicalRecord, medicalRecordHash: string, fileHash?: FileInfo[]) {
  try {
    const newMedicalRecord = new MedicalRecordModel({
      id: generateId(),
      patientId: medicalRecord.patientId,
      institution: medicalRecord.institution,
      typeOfRecord: medicalRecord.typeOfRecord,
      medicalRecordHash: medicalRecordHash,
      fileHash: fileHash,
      timeStamp: medicalRecord.timeStamp
    });

    await newMedicalRecord.save();
    console.log("Uploaded medical record to database");
  } catch (error) {
    console.error("Failed to upload medical record to database", error);
  }
}

export async function getFile(medicalRecordId: string, fileId: string): Promise<Express.Multer.File> {
  try {
    const medicalRecord = await MedicalRecordModel.findOne({ id: medicalRecordId }).exec();

    if (!medicalRecord) {
      throw new Error(`Medical record with ID ${medicalRecordId} not found`);
    }

    const fileInfo = medicalRecord.fileHash?.find(file => file.id === fileId);
    if (!fileInfo || !fileInfo.fileHash) {
      throw new Error(`Image with ID ${fileId} not found in medical record`);
    }

    const fileData: Express.Multer.File = await fetchIpfsRecordAsJson(fileInfo.fileHash);

    return fileData;
  } catch (error) {
    console.error(`Failed to get file with ID: ${fileId} from medical record ID: ${medicalRecordId}`);
    throw error;
  }
}

export async function getTenMedicalRecordByPatientId(patientId: string): Promise<MedicalRecord[]> {
  try {
    const medicalRecords = await MedicalRecordModel.find({ patientId })
      .sort({ timeStamp: -1 })
      .limit(10)
      .select('medicalRecordHash')
      .exec();

      const fetchedRecords: MedicalRecord[] = await Promise.all(
      medicalRecords.map(async (record) => {
        const recordJson: MedicalRecord = await fetchIpfsRecordAsJson(record.medicalRecordHash);

        return recordJson; 
      })
    );

    return fetchedRecords;
  } catch (error) {
    console.error(`Failed to get medical records by patientId: ${patientId}`, error);
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
  const ipfsHash = ipfsUrl.replace('ipfs://', '');
  const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

  try {
    const response = await axios.get(gatewayUrl);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch from IPFS:", error);
    throw error;
  }
}
