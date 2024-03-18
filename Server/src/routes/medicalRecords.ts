import express, { Request, Response } from "express";
import { createMedicalRecord } from "../factories/medicalRecordsFactory";
import { Encrypt } from "../services/encrypt";
import { uploadMedicalRecord } from "../storage/ipfs";

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
      symptoms,
    } = req.body;

    const medicalRecord = await createMedicalRecord(
      patientId,
      doctorFirstName,
      doctorLastName,
      sendingInstitution,
      diagnosisName,
      contentText,
      contentImage,
      language,
      symptoms
    );

    console.log("MEDICAL RECORD -----", medicalRecord);
    const encryptedMedicalRecord = await encrypt.encrypt(medicalRecord);

    const ipfsResultPaths = await uploadMedicalRecord(encryptedMedicalRecord);

    //!! Send to dbs the ipfsResultPaths, somehow link with user
    //?? Is this a good flow? I think so :D

    res.status(201).send("Diagnosis added");
  } catch (error) {
    console.error("Failed to add medical record:", error);
    res.status(500).send("Internal Server Error");
  }
});

//  Get all Medical Records
// router.get('/medicalRecord', (req: Request, res: Response) => {
//   const { patientId } = req.body;
//   res.status(200).send('Retrieved all diagnoses');
// });

export default router;
