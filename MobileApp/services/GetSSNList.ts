import { SSNList } from "models/SSNList";

const apiUrl = `https://imrs-server-12m3e12kdk1k12mek.tech/api/ssn/getSSNList`;

export async function getSSNList(patientId: string): Promise<SSNList[]> {
  if (!patientId || typeof patientId !== "string") {
    throw new Error("Invalid Patient ID Provided");
  }

  try {
    const response = await fetch(`${apiUrl}/${patientId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch SSN list");
    }

    const ssnList: SSNList[] = await response.json();
    console.log("ssnList: ", ssnList);
    return ssnList;
  } catch (error) {
    console.error("Error fetching SSN list:", error);
    throw error;
  }
}
