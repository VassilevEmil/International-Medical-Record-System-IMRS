import { TypoeOfTreament } from "../../enums";
import { TreatmentMedicament, TreatmentOther } from "../../models/treatmentPlan";
import { TreatmentMedicamentModel, TreatmentOtherModel } from "../models/treatmentPlan";

export async function addTreatmentPlanToDb(treatmentPlan: TreatmentMedicament | TreatmentOther): Promise<void> {
    switch (treatmentPlan.type) {
        case TypoeOfTreament.Medicament:
            await handleMedicamentTreatmentStoringToDb(treatmentPlan as TreatmentMedicament);
            break;
        case TypoeOfTreament.Other:
            await handleOtherTreatmentStoringToDb(treatmentPlan as TreatmentOther);
            break;
        default:
            throw new Error('Unknown treatment plan type');
    }
}

export async function updateTreatmentPlanIsActiveInDb(treatmentPlan: TreatmentMedicament | TreatmentOther){
    switch (treatmentPlan.type) {
        case TypoeOfTreament.Medicament:
            await handleMedicamentTreatmentUpdatingIsActiveInDb(treatmentPlan as TreatmentMedicament);
            break;
        case TypoeOfTreament.Other:
            await handleOtherTreatmentUpdatingIsActiveInDb(treatmentPlan as TreatmentOther);
            break;
        default:
            throw new Error('Unknown treatment plan type');
    }
}

export async function getTreatmentPlanById(type: TypoeOfTreament, treatmentPlanId: string): Promise<TreatmentMedicament | TreatmentOther> {
    switch (type) {
        case TypoeOfTreament.Medicament:
            return await handleGetMedicamentTreatmentById(treatmentPlanId);
        case TypoeOfTreament.Other:
            return await handleGetOtherTreatmentById(treatmentPlanId);
        default:
            throw new Error('Unknown treatment plan type');
    }
}

async function handleGetMedicamentTreatmentById(treatmentPlanId: string): Promise<TreatmentMedicament> {
    try {
        const treatment: TreatmentMedicament = await findMedicamentTreatmentById(treatmentPlanId);
        if (!treatment) {
            console.log('No Medicament treatment found with the given ID');
            throw Error();
        }
        return treatment;
    } catch (error) {
        console.error("Error retrieving Medicament treatment", error);
        throw new Error("Error retrieving Medicament treatment");
    }
}

async function handleGetOtherTreatmentById(treatmentPlanId: string): Promise<TreatmentOther> {
    try {
        const treatment = await findOtherTreatmentById(treatmentPlanId)
        if (!treatment) {
            throw new Error();
        }
        return treatment;
    } catch (error) {
        console.error("Error retrieving Other treatment", error);
        throw new Error("Error retrieving Other treatment");
    }
}

async function handleMedicamentTreatmentUpdatingIsActiveInDb(treatmentPlan: TreatmentMedicament): Promise<void> {
    try {
        const updatedTreatment = await TreatmentMedicamentModel.findByIdAndUpdate(treatmentPlan.id, { isActive: treatmentPlan.isActive }, { new: true });
        if (!updatedTreatment) {
            throw new Error();
        }
    } catch (error) {
        console.error("Error updating treatmentPlan 'Medicament' isActive status", error);
        throw new Error("Error updating treatmentPlan 'Medicament' isActive status");
    }
}

async function handleOtherTreatmentUpdatingIsActiveInDb(treatmentPlan: TreatmentOther): Promise<void> {
    try {
        const updatedTreatment = await TreatmentOtherModel.findByIdAndUpdate(treatmentPlan.id, { isActive: treatmentPlan.isActive }, { new: true });
        if (!updatedTreatment) {
            throw new Error();
        }
    } catch (error) {
        console.error("Error updating treatmentPlan 'Other' isActive status", error);
        throw new Error("Error updating treatmentPlan 'Other' isActive status");
    }
}

async function handleMedicamentTreatmentStoringToDb(treatmentPlan: TreatmentMedicament): Promise<void> {
    const newTreatment = new TreatmentMedicamentModel(treatmentPlan);
    try {
        await newTreatment.save();
    } catch (error) {
        console.error("Error saving treatmentPlan 'Medicament'", error);
        throw new Error("Error saving treatmentPlan 'Medicament'");
    }
}

async function handleOtherTreatmentStoringToDb(treatmentPlan: TreatmentOther): Promise<void> {
    const newTreatment = new TreatmentOtherModel(treatmentPlan);
    try {
        await newTreatment.save();
    } catch (error) {
        console.error("Error saving treatmentPlan 'Other'", error);
        throw new Error("Error saving treatmentPlan 'Other'");
    }
}

async function findMedicamentTreatmentById(treatmentPlanId: string){
    try {
        const treatmentPlan: TreatmentMedicament | null = await TreatmentMedicamentModel.findOne({
          id: treatmentPlanId,
        }).exec();
    
        if(!treatmentPlan){
          throw Error();
        }
    
        return treatmentPlan;
      }
      catch(error){
        throw new Error(`Treatment Plan not found with ID: ${treatmentPlanId}`);
      }
}

async function findOtherTreatmentById(treatmentPlanId: string){
    try {
        const treatmentPlan: TreatmentOther | null = await TreatmentOtherModel.findOne({
          id: treatmentPlanId,
        }).exec();
    
        if(!treatmentPlan){
          throw Error();
        }
    
        return treatmentPlan;
      }
      catch(error){
        throw new Error(`Treatment Plan not found with ID: ${treatmentPlanId}`);
      }
}