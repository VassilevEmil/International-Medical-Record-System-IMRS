import request from "supertest";
import { generateId } from "../factories/medicalRecordsFactory";
import app from "../app";
import { Language, TypeOfRecord } from "../enums";
import { MedicalRecord } from "../models/medicalRecord";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest = require("supertest");

// test for adding a record successfully

describe("add record", () => {
  describe("get the document route", () => {
    describe("given document has been added ", () => {
      it("should return a 201 if successfully adds a record", async () => {
        expect(true).toBe(true); // this here is to ensure we gonna get this test when we run npm test, not sure????
        const requestBody = {
          institutionId: "123",
          patientId: "456",
          title: "Test Medical Record",
          textInput: "test medical record.",
          typeOfRecord: TypeOfRecord.Bloodwork,
          doctorId: "789",
          doctorFirstName: "John",
          doctorLastName: "Doe",
          language: Language.English,
        };

        const response = await request(app)
          .post("/medicalRecords")
          .send(requestBody);
        expect(response.status).toBe(201);
      });
    });
  });
});

// test for unsuccessfull  additions of records

describe("add record", () => {
  describe("get the document route", () => {
    describe("given the document is not  provided", () => {
      it("should return a 401 status", async () => {
        // will write it later
      });
    });
  });
});
