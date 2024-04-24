import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import InstitutionModel from '../../../src/mongo/models/institution';
import { addInstitution } from '../../../src/mongo/controllers/institutionController';
import { Institution } from '../../../src/models/institution';
import { Country } from '../../../src/enums';

describe('addInstitution', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test('successfully adds an institution and verify by retrieval', async () => {
    const institutionData: Institution = {
      id: 'testId123',
      institutionId: 'testInstitutionId123',
      name: 'Test Institution Name',
      country: Country.Denmark,
      address: 'Test Institution Address'
    };
    
    await addInstitution(institutionData);

    const savedInstitution = await InstitutionModel.findOne({ institutionId: 'testInstitutionId123' });
    
    if(savedInstitution){
        expect(savedInstitution.id).toBe(institutionData.id);
        expect(savedInstitution.institutionId).toBe(institutionData.institutionId);
        expect(savedInstitution.name).toBe(institutionData.name);
        expect(savedInstitution.country).toBe(institutionData.country);
        expect(savedInstitution.address).toBe(institutionData.address);
      }
  });

  describe('Error throws for empty variables', () => {
    test('id empty', async () => {
      const invalidInstitutionData = {
        id: '',
        institutionId: 'testInstitutionId123',
        name: 'Valid Institution Name',
        country: Country.Denmark,
        address: 'Test Institution Address'
      };

      await expect(addInstitution(invalidInstitutionData)).rejects.toThrow();
    });

    test('institutionId empty', async () => {
      const invalidInstitutionData = {
        id: 'testId123',
        institutionId: '',
        name: 'Valid Institution Name',
        country: Country.Denmark,
        address: 'Test Institution Address'
      };

      await expect(addInstitution(invalidInstitutionData)).rejects.toThrow();
    });

    test('name empty', async () => {
      const invalidInstitutionData = {
        id: 'testId123',
        institutionId: 'testInstitutionId123',
        name: '',
        country: Country.Denmark,
        address: 'Test Institution Address'
      };

      await expect(addInstitution(invalidInstitutionData)).rejects.toThrow();
    });

    test('address empty', async () => {
      const invalidInstitutionData = {
        id: 'testId123',
        institutionId: 'testInstitutionId123',
        name: 'Valid Institution Name',
        country: Country.Denmark,
        address: ''
      };

      await expect(addInstitution(invalidInstitutionData)).rejects.toThrow();
    });
  })
});
