import { error } from "console";
import { Institution } from "../../models/institution";
import InstitutionModel from "../models/institution";

export async function addInstitution(institutionData: Institution): Promise<void> {
    try {
        const institution = new InstitutionModel(institutionData);
        await institution.save();
        console.log("Institution added successfully.");
    } catch (error) {
        console.error("Error adding the institution:", error);
        throw error;
    }
}

export async function getInstitutionById(institutionId: string): Promise<Institution> {
    try {
        const institution = await InstitutionModel.findOne({ institutionId: institutionId });
        if (!institution) {
            throw error;
        }
        console.log("Institution found:", institution);

        return institution;
    } catch (error) {
        console.error("Error finding the institution:", error);
        throw error;
    }
}