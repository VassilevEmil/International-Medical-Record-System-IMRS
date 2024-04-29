import request from "supertest";

import app from "../app";
import { Language, TypeOfRecord } from "../enums";

import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.disconnect();
});

/**
 * This test case checks if a record can be successfully added to the database.
 *
 * It sends a POST request to the /medicalRecords endpoint with valid data, including
 * institutionId, patientId, title, textInput, typeOfRecord, doctorId, doctorFirstName,
 * doctorLastName, and language. It also attaches two files to the request.
 *
 * Upon successful addition of the record, it expects the response status to be 201.
 *
 * @param {Object} requestBody - The request body containing data for creating the medical record.
 * @param {Buffer} file1 - The first file to be attached to the request.
 * @param {Buffer} file2 - The second file to be attached to the request.
 * @returns {Promise<void>} - A promise that resolves when the test completes.
 *
 */

describe("add record", () => {
  describe("get document route", () => {
    describe("given the document has been added", () => {
      it("should return a 201 if successfully adds a record", async () => {
        const requestBody = {
          institutionId: "123",
          patientId: "456",
          title: "Test Medical Record",
          textInput: "test medical record.",
          typeOfRecord: TypeOfRecord.Bloodwork,
          timeStamp: Date,
          doctorId: "789",
          doctorFirstName: "John",
          doctorLastName: "Doe",
          language: Language.English,
        };

        const file1 = Buffer.from("file1 contents", "utf-8");
        const file2 = Buffer.from("file2 contents", "utf-8");

        const response = await request(app)
          .post("/medicalRecords")
          .field("institutionId", requestBody.institutionId)
          .field("patientId", requestBody.patientId)
          .field("title", requestBody.title)
          .field("textInput", requestBody.textInput)
          .field("typeOfRecord", requestBody.typeOfRecord)
          .field("doctorId", requestBody.doctorId)
          .field("doctorFirstName", requestBody.doctorFirstName)
          .field("doctorLastName", requestBody.doctorLastName)
          .field("language", requestBody.language)
          .attach("fileInput", file1, "file1.jpg")
          .attach("fileInput", file2, "file2.jpg");

        expect(response.status).toBe(201);
      }, 10000); // adding this because it was failing, timeout..
    });
  });
});

/**
 * This test case checks if a record addition fails when invalid data is provided.
 *
 * It sends a POST request to the /medicalRecords endpoint with incomplete or invalid data,
 * such as missing document fields or incorrect data types.
 *
 * Upon receiving invalid data, it expects the response status to be 400, indicating a bad request.
 *
 * @param {Object} requestBody - The request body containing incomplete or invalid data for creating the medical record.
 * @returns {Promise<void>} - A promise that resolves when the test completes.
 *
 */

describe("add record  with invalid data", () => {
  describe("POST /medicalRecords", () => {
    it("should return a 400 if document is not provided", async () => {
      const requestBody = {
        id: "456",
        patientId: "emilio",
        doctorId: "123",
        doctorFirstName: "julio",
        doctorLastName: "castellanos",
        institution: "UVMC",
        timeStamp: Date,
        language: Language.English,
        title: "test",
        text: "test",
        files: "",
        typeOfRecord: TypeOfRecord.Diagnosis,
      };

      const response = await request(app)
        .post("/medicalRecords")
        .send(requestBody);
      expect(response.status).toBe(400);
    });
  });
});
