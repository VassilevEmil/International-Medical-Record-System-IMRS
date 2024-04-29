import request from "supertest";

import app from "../app";
import * as medicalRecordController from "../mongo/controllers/medicalRecordController";
import { Language, TypeOfRecord } from "../enums";
import { Institution } from "../models/institution";

import mongoose from "mongoose";
import { id } from "ethers/lib/utils";
import InstitutionModel from "../mongo/models/institution";

afterAll(async () => {
  await mongoose.disconnect();
});

// this one doesnt pass, need to work on it more.  i will commit anyway for now so you guys can fetch

describe("get record by id", () => {
  describe("get document rounte", () => {
    describe("given the document exist in  database", () => {
      it("should return a valid response with status 201", async () => {
        const medicalRecord = {
          id: "12",
          patientId: "456",
          doctorId: "789",
          doctorFirstName: "John",
          doctorLastName: "Doe",
          institution: { id: "123", name: "hospital name" } as Institution,
          timeStamp: new Date(),
          language: Language.English,
          title: "Test Medical Record",
          text: ["dssds"],
          typeOfRecord: TypeOfRecord.Bloodwork,
        };

        // want to see whats here
        console.log(medicalRecordController, "medicalrecordcontroller");

        jest.mock("../mongo/controllers/medicalRecordController", () => ({
          ...jest.requireActual("../mongo/controllers/medicalRecordController"),
          getMedicalRecordById: jest.fn(),
        }));
        const mockedGetMedicalRecordById =
          medicalRecordController.getMedicalRecordById as jest.MockedFunction<
            typeof medicalRecordController.getMedicalRecordById
          >;

        mockedGetMedicalRecordById.mockResolvedValue(medicalRecord);

        const response = await request(app).get(
          `/medicalRecords/${medicalRecord.id}`
        );

        // Assert the response status code
        expect(response.status).toBe(200);

        // Assert the response body
        expect(response.body).toEqual(medicalRecord);
      });
    });
  });
});
