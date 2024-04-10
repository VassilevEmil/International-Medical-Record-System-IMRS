import multer from "multer";
import express, { Request, Response } from "express";
import { createMedicalRecord, generateId } from "../factories/medicalRecordsFactory";
import { Encrypt } from "../services/encrypt";
import { uploadFilesToIpfs, uploadMedicalRecordToIpfs } from "../storage/ipfs";
import {
  getAllMedicalHistoriesByPatientId,
  getFile,
  getTenMedicalRecordByPatientId,
  getTenMostRecentMedicalHistoriesById,
  uploadMedicalRecordToDb,
} from "../mongo/controllers/medicalRecordController";
import { FileInfo } from "../models/fileInfo";

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

router.get("/getTenMedicalRecords", async (req: Request, res: Response) => {
  try {
    const { patientId } = req.body;

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

router.get("/getFile", async (req: Request, res: Response) => {
  try {
    const { medicalRecordId, fileId } = req.body;

    if (typeof medicalRecordId !== 'string' || typeof fileId !== 'string') {
      return res.status(400).send("Both medicalRecordId and fileId are required and must be strings.");
    }

    const fileData = await getFile(medicalRecordId, fileId);

    res.type(fileData.mimetype)
    res.send(fileData.buffer);
  } catch (error) {
    res.status(500).send("Could not get the file");
  }
});



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
