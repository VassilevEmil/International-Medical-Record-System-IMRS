import "dotenv/config";
import express, { Application } from "express";
import {
  connectToProductionDatabase,
  connectToTestDatabase,
} from "./config/database";
import { setupHttpsServer } from "./config/httpsServer";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import medicalRecordRoutes from "./routes/medicalRecords";
import treatmentPlanRoutes from "./routes/treatmentPlan";
import cors from "cors"; // Import the cors middleware

const app: Application = express();

// Connect to MongoDB
if (process.env.NODE_ENV === "test") {
  connectToTestDatabase();
} else {
  connectToProductionDatabase();
}

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/medicalRecords", medicalRecordRoutes);
app.use("/treatmentPlans", treatmentPlanRoutes);

// Route using TLS/mTLS
//app.use('/medicalRecords', validateClientCertificate, medicalRecordRoutes);

// Setup HTTPS Server
setupHttpsServer(app);
export default app;
