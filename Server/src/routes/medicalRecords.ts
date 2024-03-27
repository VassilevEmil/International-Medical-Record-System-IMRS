import multer from "multer";
import express, { Request, Response } from "express";
import { createMedicalRecord } from "../factories/medicalRecordsFactory";
import { Encrypt } from "../services/encrypt";
import { uploadMedicalRecord } from "../storage/ipfs";
import {
  getAllMedicalHistoriesByPatientId,
  getTenMostRecentMedicalHistoriesById,
  uploadMedicalHistory,
} from "../mongo/controllers/medicalHistoryController";
import { addInstitution } from "../mongo/controllers/institutionController";
import { Institution } from "../models/institution";
import { Country } from "../enums";

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
        fileInput,
        typeOfRecord,
        doctorId,
        doctorFirstName,
        doctorLastName,
        language,
      } = req.body;
      console.log(" these are the files", req.files); // This should log the file information
      console.log("Fuke Unasdj ", fileInput);
      console.log("request body: ", req.body);
      const files = req.files as Express.Multer.File[] | undefined;

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

      const ipfsResultPaths = await uploadMedicalRecord(encryptedMedicalRecord);
      console.log(
        "ipfsResults ",
        ipfsResultPaths.imageCID,
        ipfsResultPaths.textCID
      );

      const diagnosisList: string[] = [
        ipfsResultPaths.textCID,
        ipfsResultPaths.imageCID,
      ];

      uploadMedicalHistory(patientId, diagnosisList);

      res.status(201).send("Medical Record added");
    } catch (error) {
      console.error("Failed to add Medical Record:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

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
