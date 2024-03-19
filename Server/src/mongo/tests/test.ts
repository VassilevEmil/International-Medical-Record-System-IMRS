import mongoose from "mongoose";
import { expect } from "chai";
import MedicalRecordModel from "../../mongo/MedicalRecordSchema/MedicalRecordSchema";
import { MedicalRecord } from "../../models/medicalRecord";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/", {});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Medical Record Model", () => {
  it("should be able to save a medical record", async () => {
    const medicalRecordData = {
      patientId: "123",
      patientName: "John Doe",
      doctorId: "456",
      symptoms: "Fever, cough",
      diagnose: "Common cold",
      issuedBy: "Dr. Smith",
    };

    const medicalRecord = new MedicalRecordModel(medicalRecordData);
    await medicalRecord.save();

    const foundMedicalRecord = await MedicalRecordModel.findOne({
      /* search criteria */
    });

    // expect(foundMedicalRecord).toBeTruthy();
    // Additional assertions as needed
  });
});
