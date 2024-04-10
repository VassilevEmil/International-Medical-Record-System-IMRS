import mongoose from "mongoose";
import assert from "assert"; // Import assert from Node.js
import { MedicalRecord } from "../models/medicalRecord";
import MedicalRecordModel from "../mongo/models/medicalRecord";
import axios from "axios";
import { pinJSONToIPFS, uploadMedicalRecord } from "../storage/ipfs";

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

    // Assert that foundMedicalRecord is not null
    assert.strictEqual(foundMedicalRecord !== null, true);
    // Additional assertions as needed
  });
});

// Mock environment variables
process.env.PINATA_API_KEY = "24964e16bf1d30252910";
process.env.PINATA_SECRET_API_KEY =
  "9a30035ba0f9add5b0c970fa4c86f16fee0d4fe578b11eb97e1ae6446809e183";

// Mock axios post method
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("pinJSONToIPFS", () => {
  it("should successfully pin JSON to IPFS", async () => {
    // Mock response data
    const responseData = { IpfsHash: "test_ipfs_hash" };
    mockedAxios.post.mockResolvedValueOnce({ data: responseData });

    // Call the function
    const result = await pinJSONToIPFS({ key: "value" });

    // Assert that result is deep equal to responseData
    assert.deepStrictEqual(result, responseData);
    // Assert that mockedAxios.post was called once
    assert.strictEqual(mockedAxios.post.mock.calls.length, 1);
  });

  it("should throw an error if pinning fails", async () => {
    // Mock error response
    const error = new Error("Failed to pin JSON");
    mockedAxios.post.mockRejectedValueOnce(error);

    // Assertions
    await expect(pinJSONToIPFS({ key: "value" })).rejects.toThrowError(error);
  });
});
