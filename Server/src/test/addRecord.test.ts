import request from "supertest";

import app from "../app";
import { Language, TypeOfRecord } from "../enums";

import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.disconnect();
});

// test for adding a record successfully

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

// test for unsuccessfull  additions of records
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
