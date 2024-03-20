import 'dotenv/config'; // Updated to use ES module import
import express, { Application } from 'express';
import mongoose from 'mongoose';
import medicalRecordRoutes from './routes/medicalRecords';

const app: Application = express();

// MongoDB Connection
const mongoDBUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/IMRS';
mongoose.connect(mongoDBUri, {}).then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Routes
app.use('/medicalRecords', medicalRecordRoutes);

export default app;
