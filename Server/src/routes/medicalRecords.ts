import express, { Request, Response } from "express";
import { createMedicalRecord } from "../factories/medicalRecordsFactory";
import { Encrypt } from "../services/encrypt";
import { uploadMedicalRecord } from "../storage/ipfs";
import { getAllMedicalHistoriesByPatientId, getTenMostRecentMedicalHistoriesById, uploadMedicalHistory } from "../mongo/controllers/medicalHistoryController";

const router = express.Router();
const encrypt = new Encrypt();

// Post a new Medical Record
router.post("/medicalRecord", async (req: Request, res: Response) => {
  try {
    const {
      doctorFirstName,
      doctorLastName,
      sendingInstitution,
      diagnosisName,
      contentText,
      contentImage,
      language,
      patientId,
    } = req.body;

    const medicalRecord = await createMedicalRecord(
      doctorFirstName,
      doctorLastName,
      sendingInstitution,
      diagnosisName,
      contentText,
      contentImage,
      language,
      patientId
    );

    console.log("MEDICAL RECORD -----", medicalRecord);
    const encryptedMedicalRecord = await encrypt.encrypt(medicalRecord);

    const ipfsResultPaths = await uploadMedicalRecord(encryptedMedicalRecord);
      console.log("ipfsResults ", ipfsResultPaths.imageCID, ipfsResultPaths.textCID);

    const diagnosisList: string[] = [ipfsResultPaths.textCID, ipfsResultPaths.imageCID];

    uploadMedicalHistory(patientId, diagnosisList)

    res.status(201).send("Diagnosis added");
  } catch (error) {
    console.error("Failed to add medical record:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all Medical Histories
router.get('/allMedicalHistories', async (req: Request, res: Response) => {
  const { patientId } = req.query;

  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).send('Patient ID is required and must be a string.');
  }

  try {
    const medicalHistories = await getAllMedicalHistoriesByPatientId(patientId);
    if (medicalHistories && medicalHistories.length > 0) {
      res.status(200).json(medicalHistories);
    } else {
      res.status(404).send('No medical histories found for this patient.');
    }
  } catch (error) {
    console.error("Failed to retrieve medical histories:", error);
    res.status(500).send('Internal Server Error');
  }
});

// Get 10 Medical Histories
router.get('/tenMedicalHistories', async (req: Request, res: Response) => {
  const { patientId } = req.query;

  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).send('Patient ID is required and must be a string.');
  }

  try {
    const medicalHistories = await getTenMostRecentMedicalHistoriesById(patientId);
    if (medicalHistories && medicalHistories.length > 0) {
      res.status(200).json(medicalHistories);
    } else {
      res.status(404).send('No medical histories found for this patient.');
    }
  } catch (error) {
    console.error("Failed to retrieve medical histories:", error);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
