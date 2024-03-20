import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import medicalRecordRoutes from './routes/medicalRecords';

const app: Application = express();

// MongoDB Connection
const mongoDBUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/IMRS';
mongoose.connect(mongoDBUri, {}).then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Enhanced Manual CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allowed headers
    
    // Handle pre-flight requests for CORS
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routes
app.use('/medicalRecords', medicalRecordRoutes);

export default app;
