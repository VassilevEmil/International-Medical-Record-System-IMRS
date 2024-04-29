import mongoose from "mongoose";
import { DurationType } from "../../enums";
import { DrugRecord, DrugRecordModel } from "../models/drugRecord";

export async function addDrugRecordToDb(drugRecord: DrugRecord): Promise<void> {
  try {
    const newMedicalPlan = new DrugRecordModel({
      id: drugRecord.id,
      patientId: drugRecord.patientId,
      nameOfDrug: drugRecord.nameOfDrug,
      startTreatmentDate: drugRecord.startTreatmentDate,
      durationType: drugRecord.durationType,
      duration: drugRecord.duration,
      isActive: drugRecord.isActive,
      timeStamp: drugRecord.timeStamp,
      comment: drugRecord.comment,
      prescribedBy: drugRecord.prescribedBy,
    });

    await newMedicalPlan.save();
    console.log("Uploaded drug record to database");
  } catch (error) {
    console.error("Failed to upload drug record to database", error);
  }
}

/**
 * Retrieves all treatment plans associated with a specific patient ID from the database.
 *
 * It queries the database using the provided patient ID and retrieves all treatment plans
 * associated with that patient.
 *
 * If the patient ID is missing or invalid, it logs an error and throws an error.
 * If no treatment plans are found for the provided patient ID, it logs an error and throws an error.
 *
 * @param {string} patientId - The ID of the patient for whom treatment plans are being retrieved.
 * @returns {Promise<Array<TreatmentPlan>>} - A promise that resolves with an array of treatment plans associated with the patient.
 * @throws {Error} - If the patient ID is missing, invalid, or if no treatment plans are found.
 */

export async function getAllDrugRecords(
  patientId: string
): Promise<Array<DrugRecord>> {
  try {
    if (!patientId) {
      console.error("No Patient ID: ");
      throw new Error();
    }

    const drugRecords = await DrugRecordModel.find({
      patientId: patientId,
    }).exec();

    console.log("records: ", drugRecords);

    if (!drugRecords) {
      console.error("No drug records for this user");
      throw new Error();
    }

    return drugRecords;
  } catch (error) {
    console.error("Error drug records by custom ID:", error);
    throw new Error("Error finding drug records by id");
  }
}
