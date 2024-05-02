import "dotenv/config";
import express, { Application } from "express";
import {
  connectToProductionDatabase,
  connectToTestDatabase,
} from "./config/database";
import { setupHttpsServer } from "./config/httpsServer";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import medicalRecordRoutes from "./routes/medicalRecords";
import drugRecordRoutes from "./routes/drugRecords";
import cors from "cors"; // Import the cors middleware
import { apiKeyMiddleware } from "./middlewares/apiKeyMiddleware";

const app: Application = express();

// Connect to MongoDB
if (process.env.NODE_ENV === "test") {
  console.log("Connected to Test DBS");
  connectToTestDatabase();
} else {
  console.log("Connected to Prod DBS");
  connectToProductionDatabase();
}

// Middlewares
app.use(express.json());
app.use(cors());
app.use(apiKeyMiddleware);

// Routes
app.use("/medicalRecords", medicalRecordRoutes);
app.use("/drugRecords", drugRecordRoutes);

// Route using TLS/mTLS
//app.use('/medicalRecords', validateClientCertificate, medicalRecordRoutes);

// Setup HTTPS Server
setupHttpsServer(app);
export default app;
