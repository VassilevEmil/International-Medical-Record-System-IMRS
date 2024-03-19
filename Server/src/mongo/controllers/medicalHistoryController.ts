import MedicalHistoryModel from "../models/medicalHistory";

export async function uploadMedicalHistory(patientId: string, diagnosisList: string[]) {
    try{
        const newMedicalHistory = new MedicalHistoryModel({
          patientId,
          diagnosisList,
          dateCreated: new Date(),
        });
        await newMedicalHistory.save();
        console.log("Uploaded medical history to database");
      }
      catch (error)
      {
        console.error("Failed to upload to database", error);
      }
}

export async function getAllMedicalHistoriesByPatientId(patientId: string) {
    try {
      const medicalHistories = await MedicalHistoryModel.find({ patientId: patientId })
        .sort({ dateCreated: -1 }) // Sort by createdAt in descending order (newest first)
        .exec();
      
      if (medicalHistories.length === 0) {
        console.log(`No medical history found for patientId: ${patientId}`);
        return null;
      }
      
      console.log(`Found medical history for patientId: ${patientId}`);
      return medicalHistories;
    } catch (error) {
      console.error(`Error fetching medical history for patientId: ${patientId}`, error);
      throw error; 
    }
}

export async function getTenMostRecentMedicalHistoriesById(patientId: string) {
  try {
    const recentMedicalHistories = await MedicalHistoryModel.find({ patientId: patientId })
      .sort({ dateCreated: -1 })
      .limit(10) // Limit to the 10 most recent documents
      .exec();
    
    if (recentMedicalHistories.length === 0) {
      console.log(`No medical history found for patientId: ${patientId}`);
      return null;
    }
    
    console.log(`Found recent medical history for patientId: ${patientId}`);
    return recentMedicalHistories;
  } catch (error) {
    console.error(`Error fetching recent medical history for patientId: ${patientId}`, error);
    throw error;
  }
}
