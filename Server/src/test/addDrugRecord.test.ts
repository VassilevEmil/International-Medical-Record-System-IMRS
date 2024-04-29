import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { id } from "ethers/lib/utils";
import { DurationType } from "../enums";

afterAll(async () => {
  await mongoose.disconnect();
});

describe("add drug record", () => {
  describe("get document route", () => {
    describe("given the drug has been added", () => {
      it("Should return 201 if successfully adds a record", async () => {
        const requestBody = {
          id: "1",
          patientId: "123",
          nameOfDrug: "Aspirin",
          startTreatmentDate: "2024-04-18T08:00:00Z",
          durationType: DurationType.Days,
          duration: 7,
          isActive: true,
          timeStamp: "2024-04-18T08:00:00Z",
          comment: "Take one tablet daily",
          prescribedBy: "Dr. Smith",
        };

        const response = await request(app)
          .post("/drugRecords")
          .field("id", requestBody.id)
          .field("patientId", requestBody.patientId)
          .field("nameOfDrug", requestBody.nameOfDrug)
          .field("startTreatmentDate", requestBody.startTreatmentDate)
          .field("durationType", requestBody.durationType)
          .field("duration", requestBody.duration)
          .field("isActive", requestBody.isActive)
          .field("timeStamp", requestBody.timeStamp)
          .field("comment", requestBody.comment)
          .field("prescribedBy", requestBody.prescribedBy);

        expect(response.status).toBe(201);
      }, 10000); // might timeout based on previous exp
    });
  });
});
