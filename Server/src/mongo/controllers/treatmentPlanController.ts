import mongoose from "mongoose";
import { TypoeOfTreament } from "../../enums";
import {
  TreatmentMedicament,
  TreatmentOther,
} from "../../models/treatmentPlan";
import {
  TreatmentMedicamentModel,
  TreatmentOtherModel,
  TreatmentPlanModel,
} from "../models/treatmentPlan";
import { TreatmentPlan } from "../models/treatmentPlan";
import { error } from "console";

export async function addTreatmentPlanToDb(
  treatmentPlan: TreatmentMedicament | TreatmentOther
): Promise<void> {
  switch (treatmentPlan.type) {
    case TypoeOfTreament.Medicament:
      await handleMedicamentTreatmentStoringToDb(
        treatmentPlan as TreatmentMedicament
      );
      break;
    case TypoeOfTreament.Other:
      await handleOtherTreatmentStoringToDb(treatmentPlan as TreatmentOther);
      break;
    default:
      throw new Error("Unknown treatment plan type");
  }
}

export async function updateTreatmentPlanIsActiveInDb(
  treatmentPlan: TreatmentMedicament | TreatmentOther
) {
  switch (treatmentPlan.type) {
    case TypoeOfTreament.Medicament:
      await handleMedicamentTreatmentUpdatingIsActiveInDb(
        treatmentPlan as TreatmentMedicament
      );
      break;
    case TypoeOfTreament.Other:
      await handleOtherTreatmentUpdatingIsActiveInDb(
        treatmentPlan as TreatmentOther
      );
      break;
    default:
      throw new Error("Unknown treatment plan type");
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

export async function getAllTreatmentPlans(
  patientId: string
): Promise<Array<TreatmentPlan>> {
  try {
    if (!patientId) {
      console.error("No Patient ID: ");
      throw new Error();
    }

    const treatmentPlan = await TreatmentPlanModel.find({
      patientId: patientId,
    }).exec();

    console.log("plaaaaaaaaaaans: ", treatmentPlan);

    if (!treatmentPlan) {
      console.error("No treatment plan for this user");
      throw new Error();
    }

    return treatmentPlan;
  } catch (error) {
    console.error("Error fetching treatment plan by custom ID:", error);
    throw new Error("Error finding treatment plan by id");
  }
}

// eee putaaa

export async function getTreatmentPlanById(
  treatmentPlanId: string
): Promise<(TreatmentMedicament | TreatmentOther) | null> {
  try {
    if (!treatmentPlanId) {
      console.error("Invalid or empty ID provided");
      throw new Error();
    }

    const treatmentPlan = (await TreatmentPlanModel.findOne({
      id: treatmentPlanId,
    }).exec()) as (TreatmentMedicament | TreatmentOther) | null;

    if (!treatmentPlan) {
      console.error("No treatment plan found with the given ID");
      throw new Error();
    }

    return treatmentPlan;
  } catch (error) {
    console.error("Error fetching treatment plan by custom ID:", error);
    throw new Error("Error finding treatment plan by id");
  }
}

// export async function getTreatmentPlansFromDb(patientId: string, page: number, limit: number) {
//     const skip = (page - 1) * limit;
//     const treatmentPlans = await TreatmentPlanModel.find({ patientId })
//         .skip(skip)
//         .limit(limit)
//         .exec();

//     const totalCount = await TreatmentPlanModel.countDocuments({ patientId });
// }

async function handleMedicamentTreatmentUpdatingIsActiveInDb(
  treatmentPlan: TreatmentMedicament
): Promise<void> {
  try {
    const updatedTreatment = await TreatmentMedicamentModel.findByIdAndUpdate(
      treatmentPlan.id,
      { isActive: treatmentPlan.isActive },
      { new: true }
    );
    if (!updatedTreatment) {
      throw new Error();
    }
  } catch (error) {
    console.error(
      "Error updating treatmentPlan 'Medicament' isActive status",
      error
    );
    throw new Error(
      "Error updating treatmentPlan 'Medicament' isActive status"
    );
  }
}

async function handleOtherTreatmentUpdatingIsActiveInDb(
  treatmentPlan: TreatmentOther
): Promise<void> {
  try {
    const updatedTreatment = await TreatmentOtherModel.findByIdAndUpdate(
      treatmentPlan.id,
      { isActive: treatmentPlan.isActive },
      { new: true }
    );
    if (!updatedTreatment) {
      throw new Error();
    }
  } catch (error) {
    console.error(
      "Error updating treatmentPlan 'Other' isActive status",
      error
    );
    throw new Error("Error updating treatmentPlan 'Other' isActive status");
  }
}

async function handleMedicamentTreatmentStoringToDb(
  treatmentPlan: TreatmentMedicament
): Promise<void> {
  const newTreatment = new TreatmentMedicamentModel(treatmentPlan);
  try {
    await newTreatment.save();
  } catch (error) {
    console.error("Error saving treatmentPlan 'Medicament'", error);
    throw new Error("Error saving treatmentPlan 'Medicament'");
  }
}

async function handleOtherTreatmentStoringToDb(
  treatmentPlan: TreatmentOther
): Promise<void> {
  const newTreatment = new TreatmentOtherModel(treatmentPlan);
  try {
    await newTreatment.save();
  } catch (error) {
    console.error("Error saving treatmentPlan 'Other'", error);
    throw new Error("Error saving treatmentPlan 'Other'");
  }
}
