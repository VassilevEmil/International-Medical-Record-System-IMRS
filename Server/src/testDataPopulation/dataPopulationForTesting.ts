import 'dotenv/config';
import { Country, Language, TypeOfRecord } from "../enums";
import { Institution } from "../models/institution";
import { MedicalRecord } from "../models/medicalRecord";
import { Patient } from "../models/patient";
import { addTLSCertificate } from "../mongo/controllers/tlsCertificatesController";
import { addInstitution } from "../mongo/controllers/institutionController";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI as string, {}).then(async () => {
    console.log('Successfully connected to MongoDB.');
    try {
        await dataPopulationForTesting();
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    }
}).catch(err => console.error('MongoDB connection error:', err));

async function dataPopulationForTesting(){
    // Institution
    const institution: Institution = {
            id: "100",
            institutionId: "21542",
            name: "Horsens Hospital",
            country: Country.Denmark,
            address: "Horsens, Sundvej 30",
    };
    await addInstitution(institution);

    // TLS certificates
    await addTLSCertificate(process.env.TEST_FINGERPRINT_TLS as string, institution);

    // Patients
    const patient1: Patient = {
        id: "100",
        email: "testPatient1@gmail.com",
        password: "testPasswordForPatient1",
        firstName: "Johnny",
        lastName: "Bravo",
        address: "CartooNetwork st. 300",
        dateOfBirth: new Date(2000, 1, 1),
        age: 24,
        phoneNumber: "+45 55 55 55 55"
    }
    const patient2: Patient = {
        id: "101",
        email: "testPatient2@gmail.com",
        password: "testPasswordForPatient2",
        firstName: "Tony",
        lastName: "Stark",
        address: "That big building in that city, 500",
        dateOfBirth: new Date(1999, 1, 1),
        age: 25,
        phoneNumber: "+45 55 55 55 56"
    }
    const patient3: Patient = {
        id: "103",
        email: "testPatient3@gmail.com",
        password: "testPasswordForPatient3",
        firstName: "Ronald",
        lastName: "McDonald",
        address: "McDonalds, fastfood st. 31",
        dateOfBirth: new Date(1994, 1, 1),
        age: 30,
        phoneNumber: "+45 55 55 55 57"
    }
    //!! Add patients to db when we have that

    // Medical Records
    const medicalRecord: MedicalRecord = {
        id: "100",
        patientId: "100",
        doctorId: "100",
        doctorFirstName: "Md. Ronnie",
        doctorLastName: "Coleman",
        institution: institution,
        timeStamp: new Date(),
        language: Language.Danish,
        title: "Sepsis",
        text: ["My man got sepsis, unlucky. xoxo", "Also he's insane"],
        files: undefined,
        typeOfRecord: TypeOfRecord.Diagnosis,
      };
}

dataPopulationForTesting();