import express, { Request, Response } from "express";
import {
  addTreatmentPlanToDb,
  getTreatmentPlanById,
  getAllTreatmentPlans,
} from "../mongo/controllers/treatmentPlanController";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
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
});

router.get(
  "/getAllTreatmentPlans/:patientId",
  async (req: Request, res: Response) => {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new Error("Patient ID is missing");
      }
      const treatmentPlans = await getAllTreatmentPlans(patientId);
      res.json(treatmentPlans);
    } catch (error) {
      console.error("Failed to fetch treatment plans:", error);
      res.status(500).send("Failed to fetch treatment plans");
    }
  }
);

router.get("/:treatmentPlanId", async (req: Request, res: Response) => {
  try {
    const { treatmentPlanId } = req.params;

    if (!treatmentPlanId) {
      return res.status(400).send("No treatment plan id provided");
    }

    const treatmentPlan = await getTreatmentPlanById(treatmentPlanId);

    res.json(treatmentPlan);
  } catch (error) {
    console.error("Failed to add treatment plan:", error);
    res.status(500).send("Failed to add treatment plan");
  }
});

// router.get("/getTreatmentPlans/:patientId", async (req, res) => {
//     const patientId = req.params.patientId;
//     const defaultPage = 1;
//     const defaultLimit = 10;

//     const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : defaultPage;
//     const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : defaultLimit;

//     try {
//         if (!patientId) {
//             return res.status(400).send("Patient ID is required");
//         }

//         const treatmentPlans = getTreatmentPlansFromDb(patientId, page, limit);

//         res.status(200).json({
//             totalPages: Math.ceil(totalCount / limit),
//             currentPage: page,
//             limit,
//             data: treatmentPlans
//         });
//     } catch (error) {
//         console.error("Error fetching treatment plans:", error);
//         res.status(500).send("Failed to fetch treatment plans");
//     }
// });

export default router;
