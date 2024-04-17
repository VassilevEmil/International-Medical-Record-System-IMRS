import multer from "multer";
import express, { Request, Response } from "express";
import { createMedicalRecord, generateId } from "../factories/medicalRecordsFactory";
import { Encrypt } from "../services/encrypt";
import { uploadFilesToIpfs, uploadMedicalRecordToIpfs } from "../storage/ipfs";
import {
  getAllMedicalHistoriesByPatientId,
  getFile,
  getMedicalRecordById,
  getTenMedicalRecordByPatientId,
  getTenMostRecentMedicalHistoriesById,
  uploadMedicalRecordToDb,
} from "../mongo/controllers/medicalRecordController";
import { FileInfo } from "../models/fileInfo";
import axios from "axios";
import { Readable } from "form-data";

const router = express.Router();
const encrypt = new Encrypt();

const storage = multer.memoryStorage(); // Keeps files in memory
const upload = multer({ storage: storage });

// Post a new Medical Record
router.post(
  "/",
  upload.array("fileInput"),
  async (req: Request, res: Response) => {
    try {
      const {
        institutionId,
        patientId,
        title,
        textInput,
        typeOfRecord,
        doctorId,
        doctorFirstName,
        doctorLastName,
        language,
      } = req.body;

      const filesIncoming = req.files as Express.Multer.File[] | undefined;

      //File info that gets assigned to medicalHistory without the hashes
      let files: FileInfo[] = [];

      //Check if files arrived with payload
      //if so, upload them to ipfs
      if (filesIncoming !== undefined) {
        filesIncoming.forEach((file) => {
          const fileInfo: FileInfo = {
            id: generateId(),
            mimetype: file.mimetype,
            name: file.originalname,
          };

          files.push(fileInfo);
        });

        //File uploading to IPFS
        const fileHashes = await uploadFilesToIpfs(filesIncoming);

        files.forEach( (file, index) => {
          file.fileHash = fileHashes[index];
          console.log("file hash: ", file.fileHash);
          console.log("file index hash: ", fileHashes[index]);
        })
      }

      const medicalRecord = await createMedicalRecord(
        institutionId,
        patientId,
        title,
        textInput,
        typeOfRecord,
        doctorId,
        doctorFirstName,
        doctorLastName,
        language,
        files
      );

      const encryptedMedicalRecord = await encrypt.encrypt(medicalRecord);

      //!! Flow will be different, first upload to our system and then let it go to IPFS?

      //Medical record uploading to IPFS
      const ipfsmedicalRecordHash = await uploadMedicalRecordToIpfs(encryptedMedicalRecord);

      await uploadMedicalRecordToDb(medicalRecord, ipfsmedicalRecordHash, files);

      res.status(201).send("Medical Record added");
    } catch (error) {
      console.error("Failed to add Medical Record:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
router.get('/:medicalRecordId', async (req, res) => {
  try {
    const { medicalRecordId } = req.params;
    const medicalRecord = await getMedicalRecordById(medicalRecordId);
    if (medicalRecord) {
      res.json(medicalRecord);
    } else {
      res.status(404).send('Medical record not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get("/getTenMedicalRecords/:patientId", async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    if (typeof patientId !== 'string') {
      return res.status(400).send("patientId is required and must be a string.");
    }

    const medicalRecords = await getTenMedicalRecordByPatientId(patientId);
    if (medicalRecords) {
      res.status(200).json(medicalRecords);
    } else {
      res.status(404).send("No medical records found.");
    }
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).send("Internal Server Error");
  }
});

// This route gets a file using its medical record ID and file ID.

router.get("/getFile/:medicalRecordId/:fileId", async (req: Request, res: Response) => {
  try {

    // Extract passed parameters from the request.
    const { medicalRecordId, fileId } = req.params;

    // Check if both IDs are provided and are strings. If not, send a 400 error.
    if (!medicalRecordId || typeof medicalRecordId !== 'string' || !fileId || typeof fileId !== 'string') {
      return res.status(400).send("Both medicalRecordId and fileId are required and must be strings.");
    }

    // Get file information from the database  using the IDs.
    const fileInfo = await getFile(medicalRecordId, fileId);

    // MISSING CODE:
    // later on, Here should be the decryption logic, since getting file will result into encrypted hash 
    // It should be connected to mongo CSFLE and use aes-256 as provided in security analysis

    // Set the Content-Type header based on the file MIME type
    // This tells the client what type of file it's receiving.
    res.setHeader('Content-Type', fileInfo.mimetype);

    // Fetch the file as a stream from IPFS
    // Pass the actual IPFS access hash 
    const ipfsStream = await fetchIpfsFile(fileInfo.fileHash);

    // Pipe the IPFS file stream directly to a response (streaming data directly to the client)
    // Pipe does not store entire file in server memory
    // Especially good for large files or constant file acess
    ipfsStream.pipe(res);

  } catch (error) {
    console.error("Error getting file: ", error);
    res.status(500).send("Could not get the file");
  }
});

// Get file from ipfs
export async function fetchIpfsFile(ipfsHash: string): Promise<Readable> {
  const gatewayUrl = ipfsHash.replace('ipfs://', 'https://ipfs.io/ipfs/');
  // Fetch file using Axios and return response as a stream
  // When we get the file, just return the data part.
  return axios.get(gatewayUrl, { responseType: 'stream' }).then(response => response.data); 
}

// Get all Medical Histories + pagination
router.get("/allMedicalHistories", async (req: Request, res: Response) => {
  const { patientId, page, limit } = req.query;

  console.log(" patientID: ", patientId);

  if (!patientId || typeof patientId !== "string") {
    return res.status(400).send("Patient ID is required and must be a string.");
  }

  const pageNumber = typeof page === "string" ? parseInt(page, 10) : undefined;
  const limitNumber =
    typeof limit === "string" ? parseInt(limit, 10) : undefined;

  try {
    const medicalHistories = await getAllMedicalHistoriesByPatientId(
      patientId,
      pageNumber,
      limitNumber
    );
    console.log("Medical histories: ", medicalHistories);

    if (medicalHistories && medicalHistories.length > 0) {
      res.status(200).json(medicalHistories);
    } else {
      res.status(404).send("No medical histories found for this patient.");
    }
  } catch (error) {
    console.error("Failed to retrieve medical histories:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get 10 Medical Histories
router.get("/tenMedicalHistories", async (req: Request, res: Response) => {
  const { patientId } = req.query;

  if (!patientId || typeof patientId !== "string") {
    return res.status(400).send("Patient ID is required and must be a string.");
  }

  try {
    const medicalHistories = await getTenMostRecentMedicalHistoriesById(
      patientId
    );
    if (medicalHistories && medicalHistories.length > 0) {
      res.status(200).json(medicalHistories);
    } else {
      res.status(404).send("No medical histories found for this patient.");
    }
  } catch (error) {
    console.error("Failed to retrieve medical histories:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
