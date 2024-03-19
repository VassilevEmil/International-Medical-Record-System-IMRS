require("dotenv").config();
import express, { Application } from "express";
import medicalRecordRoutes from "./routes/medicalRecords";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use("/medicalRecords", medicalRecordRoutes);
// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

export default app;
