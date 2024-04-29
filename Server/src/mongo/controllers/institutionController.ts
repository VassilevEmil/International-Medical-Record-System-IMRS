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
    let institution: Institution | null;
    try {
        institution = await InstitutionModel.findOne({ institutionId: institutionId }).exec();
    } catch (error) {
        console.error("Error during the database query:", error);
        throw new Error(`Failed to retrieve institution with ID: ${institutionId}. Please try again later.`);
    }

    if (!institution) {
        console.error(`No institution found with ID: ${institutionId}`);
        throw new Error(`No institution found with ID: ${institutionId}`);
    }

    console.log("Institution found:", institutionId);
    return institution;
}