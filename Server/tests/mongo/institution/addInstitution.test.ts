import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import InstitutionModel from '../../../src/mongo/models/institution';
import { addInstitution } from '../../../src/mongo/controllers/institutionController';
import { Institution } from '../../../src/models/institution';
import { Country } from '../../../src/enums';

describe('addInstitution', () => {
  let mongod: MongoMemoryServer;
  let institutionData: Institution;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    institutionData = {
      id: 'testId123',
      institutionId: 'testInstitutionId123',
      name: 'Test Institution Name',
      country: Country.Denmark,
      address: 'Test Institution Address'
    };
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test('successfully adds an institution and verify by retrieval', async () => {
    await addInstitution(institutionData);
    const savedInstitution = await InstitutionModel.findOne({ institutionId: 'testInstitutionId123' });
    
    expect(savedInstitution).toMatchObject({
      id: institutionData.id,
      institutionId: institutionData.institutionId,
      name: institutionData.name,
      country: institutionData.country,
      address: institutionData.address
    });
  });

  describe('Error throws for empty variables', () => {
    test.each([
      [{...institutionData, id: ''}, 'id missing'],
      [{...institutionData, institutionId: ''}, 'institutionId missing'],
      [{...institutionData, name: ''}, 'name missing'],
      [{...institutionData, address: ''}, 'address missing'],
    ])('throws an error when %s is empty', async (invalidData) => {
      await expect(addInstitution(invalidData))
        .rejects
        .toThrow();
    });
  });
});
