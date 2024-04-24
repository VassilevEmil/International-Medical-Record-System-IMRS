import { Institution } from "../../models/institution";
import InstitutionModel from "../models/institution";
import { Country } from "../../enums";

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
        let institution: Institution | null = await InstitutionModel.findOne({ institutionId: institutionId });
        if (!institution) {
            institution = {
                id: "123",
                institutionId: institutionId,
                name: "Test Hospital",
                country: Country.Denmark,
                address: "WhateverTown 101",
              };

            try {
                // Attempt to add the institution
                await addInstitution(institution);
                console.log("Institution not found but created", institution);
            } catch (error) {
                console.error("Error adding the institution:", error);
                // Log the error and continue without throwing it
            }
            
            return institution;
        }

        return institution; 
    } catch (error) {
        console.error("Error finding the institution:", error);
        throw error;
    }
}