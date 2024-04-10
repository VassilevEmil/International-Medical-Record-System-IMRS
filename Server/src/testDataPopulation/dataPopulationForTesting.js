"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const enums_1 = require("../src/enums");
const TLScertificatesController_1 = require("../src/mongo/controllers/TLScertificatesController");
const institutionController_1 = require("../src/mongo/controllers/institutionController");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoDBUri = process.env.MONGODB_URI;
mongoose_1.default.connect(mongoDBUri, {}).then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));
function dataPopulationForTesting() {
    return __awaiter(this, void 0, void 0, function* () {
        // Institution
        const institution = {
            id: "100",
            institutionId: "21542",
            name: "Horsens Hospital",
            country: enums_1.Country.Denmark,
            address: "Horsens, Sundvej 30",
        };
        yield (0, institutionController_1.addInstitution)(institution);
        // TLS certificates
        yield (0, TLScertificatesController_1.addTLSCertificate)(process.env.TEST_FINGERPRINT_TLS, institution);
        // Patients
        const patient1 = {
            id: "100",
            email: "testPatient1@gmail.com",
            password: "testPasswordForPatient1",
            firstName: "Johnny",
            lastName: "Bravo",
            address: "CartooNetwork st. 300",
            dateOfBirth: new Date(2000, 1, 1),
            age: 24,
            phoneNumber: "+45 55 55 55 55"
        };
        const patient2 = {
            id: "101",
            email: "testPatient2@gmail.com",
            password: "testPasswordForPatient2",
            firstName: "Tony",
            lastName: "Stark",
            address: "That big building in that city, 500",
            dateOfBirth: new Date(1999, 1, 1),
            age: 25,
            phoneNumber: "+45 55 55 55 56"
        };
        const patient3 = {
            id: "103",
            email: "testPatient3@gmail.com",
            password: "testPasswordForPatient3",
            firstName: "Ronald",
            lastName: "McDonald",
            address: "McDonalds, fastfood st. 31",
            dateOfBirth: new Date(1994, 1, 1),
            age: 30,
            phoneNumber: "+45 55 55 55 57"
        };
        //!! Add patients to db when we have that
        // Medical Records
        const medicalRecord = {
            id: "100",
            patientId: "100",
            doctorId: "100",
            doctorFirstName: "Md. Ronnie",
            doctorLastName: "Coleman",
            institution: institution,
            timeStamp: new Date(),
            language: enums_1.Language.Danish,
            title: "Sepsis",
            text: ["My man got sepsis, unlucky. xoxo", "Also he's insane"],
            files: undefined,
            typeOfRecord: enums_1.TypeOfRecord.Diagnosis,
        };
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    });
}
dataPopulationForTesting();
