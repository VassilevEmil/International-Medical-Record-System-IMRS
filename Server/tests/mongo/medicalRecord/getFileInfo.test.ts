import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { MedicalRecordReferenceModel, MedicalRecordReferenceModelInterface } from "../../../src/mongo/models/medicalRecordReference";
import { Institution } from "../../../src/models/institution";
import { Country, TypeOfRecord } from "../../../src/enums";
import { FileInfo } from "../../../src/models/fileInfo";
import { getFileInfoFromDb } from "../../../src/mongo/controllers/medicalRecordController";
import { MedicalRecordReference } from "../../../src/models/medicalRecordReference";

describe('getFileInfoFromDb', () => {
    let mongod: MongoMemoryServer;
    let medicalRecordReference: MedicalRecordReference;
    let fileInfoCorrect: FileInfo;
    let fileInfoFake1: FileInfo;
    let fileInfoFake2: FileInfo;
    let medicalRecordReferenceModel: MedicalRecordReferenceModelInterface;

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

      afterEach(async () => {
        await MedicalRecordReferenceModel.deleteMany({});
      });

    describe('Successfully gets fileInfo', () => {
        test('gets fileInfo from an array that contains 1 fileInfo obj', async () => {
            medicalRecordReference.fileHash?.push(fileInfoCorrect);

            medicalRecordReferenceModel = new MedicalRecordReferenceModel({
                ...medicalRecordReference
            });

            await medicalRecordReferenceModel.save();
            
            await findCorrectFileInfo();
        });

        test('gets fileInfo from an array that contains 2 fileInfo objcts and is the 2nd object', async () => {
            medicalRecordReference.fileHash?.push(fileInfoFake1);
            medicalRecordReference.fileHash?.push(fileInfoCorrect);


            medicalRecordReferenceModel = new MedicalRecordReferenceModel({
                ...medicalRecordReference
            });

            await medicalRecordReferenceModel.save();
            
            await findCorrectFileInfo();
        });

        test('gets fileInfo from an array that contains 3 fileInfo objcts and is the 3rd object', async () => {
            medicalRecordReference.fileHash?.push(fileInfoFake1);
            medicalRecordReference.fileHash?.push(fileInfoFake2);
            medicalRecordReference.fileHash?.push(fileInfoCorrect);


            medicalRecordReferenceModel = new MedicalRecordReferenceModel({
                ...medicalRecordReference
            });

            await medicalRecordReferenceModel.save();
            
            await findCorrectFileInfo();
        });

        test('gets fileInfo from an array that contains 3 fileInfo objcts and is the 2nd object', async () => {
            medicalRecordReference.fileHash?.push(fileInfoFake1);
            medicalRecordReference.fileHash?.push(fileInfoCorrect);
            medicalRecordReference.fileHash?.push(fileInfoFake2);

            medicalRecordReferenceModel = new MedicalRecordReferenceModel({
                ...medicalRecordReference
            });

            await medicalRecordReferenceModel.save();
            
            await findCorrectFileInfo();
        });
    });

    describe('Unsuccessful', () => {
        test('MedicalRecord not found', async () => {
            //No init for medicalRecordReferenceModel, supposed to not exist

           await expect(getFileInfoFromDb(medicalRecordReference.id, fileInfoCorrect.id)).rejects.toThrow(`Failed to get file with ID: ${fileInfoCorrect.id} from medical record ID: ${medicalRecordReference.id}`);
        });

        test('FileInfo not found in MedicalRecord, empty array', async () => {
            // medicalRecordReference is initialized with an empty array
            medicalRecordReferenceModel = new MedicalRecordReferenceModel({
                ...medicalRecordReference
            });

            await expect(getFileInfoFromDb(medicalRecordReference.id, fileInfoCorrect.id)).rejects.toThrow(`Failed to get file with ID: ${fileInfoCorrect.id} from medical record ID: ${medicalRecordReference.id}`);
        });

        test('FileInfo not found in MedicalRecord, populated array', async () => {
            // medicalRecordReference is initialized with an empty array
            medicalRecordReference.fileHash?.push(fileInfoFake1);
            medicalRecordReference.fileHash?.push(fileInfoFake2);

            medicalRecordReferenceModel = new MedicalRecordReferenceModel({
                ...medicalRecordReference
            });

            await expect(getFileInfoFromDb(medicalRecordReference.id, fileInfoCorrect.id)).rejects.toThrow(`Failed to get file with ID: ${fileInfoCorrect.id} from medical record ID: ${medicalRecordReference.id}`);
        });
    })

    //Helper Functions:
    async function findCorrectFileInfo() {
        const newFileInfo: FileInfo = await getFileInfoFromDb(medicalRecordReference.id, fileInfoCorrect.id);

        if(newFileInfo){
            expect(newFileInfo.id).toBe(fileInfoCorrect.id);
            expect(newFileInfo.fileHash).toBe(fileInfoCorrect.fileHash);
            expect(newFileInfo.mimetype).toBe(fileInfoCorrect.mimetype);
            expect(newFileInfo.name).toBe(fileInfoCorrect.name);
        }
    }

    function initializeObjects() {
        const institution: Institution = {
            id: 'testId1234',
            institutionId: 'testInstitutionId1234',
            name: 'Test Institution Name',
            country: Country.Denmark,
            address: 'Test Institution Address'
          };
    
        fileInfoCorrect = {
            id: "fileInfoTestId123",
            name: "fileInfoTestName",
            mimetype: "fileInfoTestMimeType",
            fileHash: "fileInfoTestHash123",
        };

        fileInfoFake1 = {
            id: "fileInfo1TestId123",
            name: "fileInfo1TestName",
            mimetype: "fileInfo1TestMimeType",
            fileHash: "fileInfo1TestHash123",
        };

        fileInfoFake2 = {
            id: "fileInfo2TestId123",
            name: "fileInfo2TestName",
            mimetype: "fileInfo2TestMimeType",
            fileHash: "fileInfo2TestHash123",
        };
    
        medicalRecordReference = {
            id: "medicalRecordTestId123",
            patientId: "medicalRecordTestPatiendId123",
            institution: institution,
            typeOfRecord: TypeOfRecord.Bloodwork,
            medicalRecordHash: "medicalRecordTestRecordHash123",
            fileHash: [],
            timeStamp: new Date(),
        };
    }
});

