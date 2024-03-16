require('dotenv').config()
import express, { Application } from 'express';
import medicalRecordRoutes from './routes/medicalRecords';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/medicalRecords', medicalRecordRoutes);

export default app;
