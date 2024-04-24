import "dotenv/config";
import express, { Application } from "express";
import {
  connectToProductionDatabase,
  connectToTestDatabase,
} from "./config/database";
import { setupHttpsServer } from "./config/httpsServer";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import medicalRecordRoutes from "./routes/medicalRecords";
import cors from "cors"; // Import the cors middleware

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

// Routes
app.use("/medicalRecords", medicalRecordRoutes);

// Route using TLS/mTLS
//app.use('/medicalRecords', validateClientCertificate, medicalRecordRoutes);

// Setup HTTPS Server
setupHttpsServer(app);
export default app;
