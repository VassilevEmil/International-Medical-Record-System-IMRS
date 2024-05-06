// import request from "supertest";

// import app from "../app";
// import * as medicalRecordController from "../mongo/controllers/medicalRecordController";
// import { Country, Language, TypeOfRecord } from "../enums";
// import { Institution } from "../models/institution";

// import { getMedicalRecordById } from "../mongo/controllers/medicalRecordController";

// import mongoose from "mongoose";

// import MedicalRecordReferenceModel from "../mongo/models/medicalRecordReference";
// import { FileInfo } from "../models/fileInfo";

// afterAll(async () => {
//   await mongoose.disconnect();
// });

// // getRecordById  but in order to get it firstly i need to create it

// describe("add record and fetch it by id", () => {
//   describe("get document route", () => {
//     describe("given the document has been added", () => {
//       it("should return a 201 if successfully adds a record", async () => {
//         jest.mock("../mongo/controllers/medicalRecordController", () => ({
//           ...jest.requireActual("../mongo/controllers/medicalRecordController"),
//           getMedicalRecordById: jest.fn(async (medicalRecordId: string) => {
//             if (medicalRecordId === "123") {
//               return {
//                 id: "123",
//                 patientId: "123",
//                 institution: {
//                   id: "123",
//                   name: "hospital name",
//                 },
//                 typeOfRecord: TypeOfRecord.Bloodwork,
//                 medicalRecordHash: "ipfs://hash123",
//                 fileHash: [],
//                 timeStamp: new Date(),
//               };
//             } else {
//               throw new Error(
//                 `Medical Record Reference not found with ID: ${medicalRecordId}`
//               );
//             }
//           }),
//         }));

//         const fileHash: FileInfo[] = [
//           {
//             id: "1",
//             name: "file1.jpg",
//             mimetype: "image/jpeg",
//             fileHash: "hash1",
//           },
//           {
//             id: "2",
//             name: "file2.jpg",
//             mimetype: "image/jpeg",
//             fileHash: "hash2",
//           },
//         ];

//         const medicalRecord = {
//           id: "123",
//           patientId: "123",
//           institution: {
//             id: "123",
//             name: "hospital name",
//             institutionId: "123",
//             country: Country.Bulgaria,
//             address: "random",
//           } as Institution,
//           typeOfRecord: TypeOfRecord.Bloodwork,
//           medicalRecordHash: "4df3g53c3",
//           fileHash: fileHash,
//           timeStamp: new Date(),
//         };

//         jest.mock("../storage/ipfs", () => ({
//           ...jest.requireActual("../storage/ipfs"),
//           getMedicalRecordFromIpfs: jest.fn(async (ipfsUrl: string) => {
//             const ipfsHash = ipfsUrl.replace("ipfs://", "");

//             console.log("haaaaaaaaaaaashh: ", ipfsHash);

//             if (ipfsHash === "hash123") {
//               return {
//                 id: "123",
//                 patientId: "123",
//                 institution: {
//                   id: "123",
//                   name: "hospital name",
//                 },
//                 typeOfRecord: TypeOfRecord.Bloodwork,
//                 medicalRecordHash: "ipfs://hash123",
//                 fileHash: [],
//                 timeStamp: new Date(),
//               };
//             } else {
//               throw new Error("Medical record not found in IPFS");
//             }
//           }),
//         }));

//         await MedicalRecordReferenceModel.create(medicalRecord);

//         const response = await request(app).get("/medicalRecords/123");
//         expect(response.status).toBe(200);

//         expect(response.body).toEqual(medicalRecord);
//       }, 10000); // adding this because it was failing, timeout..
//     });
//   });
// });
