import express, { Request, Response } from "express";
import { addTreatmentPlanToDb, getTreatmentPlanById } from "../mongo/controllers/treatmentPlanController";

const router = express.Router();

router.post(
    "/",
    async (req: Request, res: Response) => {
        try {
            const { treatmentPlan } = req.body;

            if (!treatmentPlan) {
                return res.status(400).send("No treatment plan provided");
            }

            await addTreatmentPlanToDb(treatmentPlan);

            res.status(201).send("Treatment plan added successfully");
        } catch (error) {
            console.error("Failed to add treatment plan:", error);
            res.status(500).send("Failed to add treatment plan");
        }
    }
);

router.get(
    "/getTreatmentPlanById",
    async (req: Request, res: Response) => {
        try {
            const { 
                treatmentPlanId,
                TypoeOfTreament,
             } = req.body;

            if (!treatmentPlanId) {
                return res.status(400).send("No treatment plan id provided");
            }

            const treatmentPlan = await getTreatmentPlanById(TypoeOfTreament, treatmentPlanId);

            res.json(treatmentPlan);
        } catch (error) {
            console.error("Failed to add treatment plan:", error);
            res.status(500).send("Failed to add treatment plan");
        }
    }
);

export default router;
