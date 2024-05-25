import EncryptedStorage from "react-native-encrypted-storage";

const apiUrl = `https://imrs-server-12m3e12kdk1k12mek.tech/api/ssn`;

export async function addSSN(
  patientId: string,
  ssn: string,
  country: string
): Promise<void> {
  try {
    const bearerToken = await EncryptedStorage.getItem("token");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId, ssn, country }),
    });

    if (!response.ok) {
      throw new Error("Failed to add SSN");
    }
  } catch (error) {
    console.error("Error adding SSN:", error);
    throw error;
  }
}
