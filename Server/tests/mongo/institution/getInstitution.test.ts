import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { getInstitutionById } from "../../../src/mongo/controllers/institutionController";
import { Institution } from '../../../src/models/institution';
import { Country } from "../../../src/enums";
import InstitutionModel from "../../../src/mongo/models/institution";

describe('getInstitution', () => {
    let mongod: MongoMemoryServer;
    let institutionData: Institution;

    beforeAll(async () => {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);

      institutionData = {
        id: 'getInstitutionTestId',
        institutionId: 'getInstitutionTestInstitutionId',
        name: 'Test Institution Name',
        country: Country.Denmark,
        address: 'Test Institution Address'
      };

        const institution = new InstitutionModel(institutionData);
        await institution.save();
    });
  
    afterAll(async () => {
      await mongoose.disconnect();
      await mongod.stop();
    });

    test('successfully gets institution', async () => {
        const savedInstitution = await getInstitutionById(institutionData.institutionId);

        if(savedInstitution){
            expect(savedInstitution.id).toBe(institutionData.id);
            expect(savedInstitution.institutionId).toBe(institutionData.institutionId);
            expect(savedInstitution.name).toBe(institutionData.name);
            expect(savedInstitution.country).toBe(institutionData.country);
            expect(savedInstitution.address).toBe(institutionData.address);
        }
    });

    test('wrong id', async () => {
        await expect(getInstitutionById("wrongId")).rejects.toThrow("No institution found with ID: wrongId");
    })

    test('catch block fires on database errors', async () => {
        const spyFindOne = jest.spyOn(InstitutionModel, 'findOne').mockImplementation(() => {
            throw new Error("Database is down");
        });

        await expect(getInstitutionById("wrongId")).rejects.toThrow("Failed to retrieve institution with ID: wrongId. Please try again later.");

        spyFindOne.mockRestore();
    });
})
