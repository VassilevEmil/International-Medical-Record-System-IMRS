import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import MedicalRecordReferenceModel, { MedicalRecordReferenceModelInterface } from "../../../src/mongo/models/medicalRecordReference";
import { Country, Language, TypeOfRecord } from "../../../src/enums";
import { Institution } from "../../../src/models/institution";
import { FileInfo } from "../../../src/models/fileInfo";
import { MedicalRecordReference } from "../../../src/models/medicalRecordReference";
import { getMedicalRecordById } from "../../../src/mongo/controllers/medicalRecordController";
import { MedicalRecord } from "../../../src/models/medicalRecord";
import * as ipfsModule from "../../../src/storage/ipfs";

jest.mock("../../../src/storage/ipfs");

describe('getMedicalRecordById', () => {
    let mongod: MongoMemoryServer;
    let medicalRecordReference: MedicalRecordReference;
    let medicalRecordReferenceModel: MedicalRecordReferenceModelInterface;
    let mockMedicalRecord: MedicalRecord;

    beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
  
      initializeObjects();
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
      await mongod.stop();
    });

    test('Successfully gets medicalRecord by ID', async () => {
        (ipfsModule.getMedicalRecordFromIpfs as jest.Mock).mockResolvedValue(mockMedicalRecord);

        const result = await getMedicalRecordById(medicalRecordReference.id);

        expect(result).toEqual(mockMedicalRecord);
        expect(ipfsModule.getMedicalRecordFromIpfs).toHaveBeenCalledWith(medicalRecordReference.medicalRecordHash);
    })

    describe('Unsusscessful', () => {
        test('Wrong medicalRecordId', async () => {
            (ipfsModule.getMedicalRecordFromIpfs as jest.Mock).mockResolvedValue(mockMedicalRecord);

            await expect(getMedicalRecordById("wrongId")).rejects.toThrow(`Error fetching medical record with ID: wrongId`);
        });

        test('Ipfs does not find the medicalRecord', async () => {
            (ipfsModule.getMedicalRecordFromIpfs as jest.Mock).mockRejectedValue(new Error());

            await expect(getMedicalRecordById(medicalRecordReference.id)).rejects.toThrow(`Error fetching medical record with ID: ${medicalRecordReference.id}`);

            expect(ipfsModule.getMedicalRecordFromIpfs).toHaveBeenCalledWith(medicalRecordReference.medicalRecordHash);
        })
    })

    // Helper functions
    function initializeObjects(){
        const institution: Institution = {
            id: 'testId1234',
            institutionId: 'testInstitutionId1234',
            name: 'Test Institution Name',
            country: Country.Denmark,
            address: 'Test Institution Address'
          };
    
        const fileInfo1: FileInfo = {
            id: "fileInfo1TestId123",
            name: "fileInfo1TestName",
            mimetype: "fileInfoTestMimeType",
            fileHash: "fileInfoTestHash123",
        };

        const fileInfo2: FileInfo = {
            id: "fileInfo2TestId123",
            name: "fileInfo2TestName",
            mimetype: "fileInfoTestMimeType",
            fileHash: "fileInfoTestHash123",
        };
    
        medicalRecordReference = {
            id: "medicalRecordTestId123",
            patientId: "medicalRecordTestPatiendId123",
            institution: institution,
            typeOfRecord: TypeOfRecord.Bloodwork,
            medicalRecordHash: "medicalRecordTestRecordHash123",
            fileHash: [fileInfo1, fileInfo2],
            timeStamp: new Date(),
        };

        medicalRecordReferenceModel = new MedicalRecordReferenceModel({
            ...medicalRecordReference
        });

        medicalRecordReferenceModel.save();

        // Mocked medicalRecord that IPFS "returns" inside getMedicalRecordById
        mockMedicalRecord = {
            id: medicalRecordReference.id,
            patientId: medicalRecordReference.patientId,
            doctorId: "mockedMedicalRecordDoctorId",
            doctorFirstName: "mockedMedicalRecordDoctorFirstName",
            doctorLastName: "mockedMedicalRecordDoctorLastName",
            institution: medicalRecordReference.institution,
            timeStamp: medicalRecordReference.timeStamp,
            language: Language.English,
            title: "mockedMedicalRecordTitle",
            text: ["mockedMedicalRecordText1", "mockedMedicalRecordText2", "mockedMedicalRecordText3"],
            files: medicalRecordReference.fileHash,
            typeOfRecord: medicalRecordReference.typeOfRecord
        };
    }
});