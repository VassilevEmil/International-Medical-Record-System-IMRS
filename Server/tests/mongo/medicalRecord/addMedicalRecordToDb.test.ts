import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { addMedicalRecordToDb } from '../../../src/mongo/controllers/medicalRecordController';
import { Country, Language, TypeOfRecord } from '../../../src/enums';
import { Institution } from '../../../src/models/institution';
import { MedicalRecord } from '../../../src/models/medicalRecord';
import { FileInfo } from '../../../src/models/fileInfo';
import MedicalRecordReferenceModel, { MedicalRecordReferenceModelInterface } from '../../../src/mongo/models/medicalRecordReference';

describe('addMedicalRecordToDb', () => {
  let mongod: MongoMemoryServer;
  let institution: Institution;
  let fileInfo1: FileInfo;
  let fileInfo2: FileInfo;
  let medicalRecordData: MedicalRecord;
  let medicalRecordHash: string;

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

    test('Successfully adds medicalRecord', async () => {
      await addMedicalRecordToDb(medicalRecordData, medicalRecordHash, [fileInfo1, fileInfo2]);
  
      const savedMedicalRecord: MedicalRecordReferenceModelInterface | null = await MedicalRecordReferenceModel.findOne({ id: medicalRecordData.id });
  
      if (savedMedicalRecord) {
        expect(savedMedicalRecord.id).toBe(medicalRecordData.id);
        expect(savedMedicalRecord.patientId).toBe(medicalRecordData.patientId);
        expect(savedMedicalRecord.institution).toMatchObject(medicalRecordData.institution);
        expect(savedMedicalRecord.typeOfRecord).toBe(medicalRecordData.typeOfRecord);
        expect(savedMedicalRecord.medicalRecordHash).toEqual(medicalRecordHash);
        expect(savedMedicalRecord.fileHash).toMatchObject([fileInfo1, fileInfo2]);
        expect(savedMedicalRecord.timeStamp.getDate()).toBe(medicalRecordData.timeStamp.getDate());
      }
    });

  describe('Error handling for missing required fields', () => {
    test.each([
      [{...medicalRecordData, id: ''}, 'id missing'],
      [{...medicalRecordData, patientId: ''}, 'patientId missing'],
      [{...medicalRecordData, medicalRecordHash: ''}, 'medicalRecordHash missing'],
    ])('throws an error when %s is empty', async (invalidData, description) => {
      await expect(addMedicalRecordToDb(invalidData, medicalRecordHash, [fileInfo1, fileInfo2]))
        .rejects
        .toThrow(new Error("Failed to upload medical record to database"));
    });

    test('Error handling missing medicalRecordHash', async () => {
      await expect(addMedicalRecordToDb(medicalRecordData, '', [fileInfo1, fileInfo2])).rejects.toThrow("Medical record hash not provided");
    });
  });

  //Helper functions:
  function initializeObjects() {
    institution = {
      id: 'testId1234',
      institutionId: 'testInstitutionId1234',
      name: 'Test Institution Name',
      country: Country.Denmark,
      address: 'Test Institution Address'
    };

    fileInfo1 = {
      id: "fileInfoTestId123",
      name: "fileInfoTestName",
      mimetype: ".jpg",
      fileHash: "fileInfoTestHash123",
    }

    fileInfo2 = {
      id: "fileInfoTestId1234",
      name: "fileInfoTestName2",
      mimetype: ".jpg",
      fileHash: "fileInfoTestHash1234",
    }

    medicalRecordData = {
      id: "medicalRecordTestId123",
      patientId: "patientIdTest123",
      doctorId: "doctorIdTest123",
      doctorFirstName: "fakeDoctorNameForTesting",
      doctorLastName: "fakeDoctorLastNameForTesting",
      institution: institution,
      timeStamp: new Date(),
      language: Language.Danish,
      title: "medicalRecordTitleForTesting123",
      text: [
        "medicalRecordParagraph1Test medicalRecordParagraph1Test",
        "medicalRecordParagraph2Test "
      ],
      files: [],
      typeOfRecord: TypeOfRecord.Bloodwork
    };

    medicalRecordHash = "medicalRecordHash123";
  }
});


