import { PatientData } from "../models/patientData";

export const getPatientData = async (
  ssn: string,
  apiKey: string,
  institutionId: string
): Promise<PatientData> => {
  const uri = `${import.meta.env.VITE_API_URL}/auth/getPatientData`;
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "institution-id": institutionId,
      },
      body: JSON.stringify({ ssn }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    throw error;
  }
};
