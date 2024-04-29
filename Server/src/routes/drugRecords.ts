import express, { Request, Response } from "express";
import {
  getAllDrugRecords,
  addDrugRecordToDb,
} from "../mongo/controllers/drugRecordController";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { drugRecord } = req.body;

    if (!drugRecord) {
      return res.status(400).send("No drug record provided");
    }

    await addDrugRecordToDb(drugRecord);

    res.status(201).send("Drug record added successfully");
  } catch (error) {
    console.error("Failed to add drug record:", error);
    res.status(500).send("Failed to add drug record");
  }
});

router.get(
  "/getAllDrugRecords/:patientId",
  async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new Error("Patient ID is missing");
      }
      const drugRecords = await getAllDrugRecords(patientId);
      res.json(drugRecords);
    } catch (error) {
      console.error("Failed to fetch drug records:", error);
      res.status(500).send("Failed to fetch drug records");
    }
  }
);

export default router;
