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
import { ipFilterMiddleware } from "./middlewares/ipFilterMiddleware";

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
app.use(ipFilterMiddleware);

// Routes
app.use("/medicalRecords", medicalRecordRoutes);

// Route using TLS/mTLS
//app.use('/medicalRecords', validateClientCertificate, medicalRecordRoutes);

// Setup HTTPS Server
setupHttpsServer(app);
export default app;
