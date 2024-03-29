import 'dotenv/config';
import express, { Application } from 'express';
import { connectToDatabase } from './config/database';
import { setupHttpsServer } from './config/httpsServer';
import { corsMiddleware } from './middlewares/corsMiddleware';
import medicalRecordRoutes from './routes/medicalRecords';

const app: Application = express();

// Connect to MongoDB
connectToDatabase();

// Middlewares
app.use(express.json());
app.use(corsMiddleware);


// Routes
app.use('/medicalRecords', medicalRecordRoutes);

// Route using SSL/mTLS
//app.use('/medicalRecords', validateClientCertificate, medicalRecordRoutes);

// Setup HTTPS Server
setupHttpsServer(app);
