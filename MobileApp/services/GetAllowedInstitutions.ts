import EncryptedStorage from "react-native-encrypted-storage";
import { Institution } from "../models/institution";

export async function getAllowedInstitutions(
  patientId: string,
  page = 1,
  limit = 10
): Promise<Institution[]> {
  const url = `https://imrs-server-12m3e12kdk1k12mek.tech/api/institutions/allowedInstitutions/${patientId}?page=${page}&limit=${limit}`;
  const bearerToken = await EncryptedStorage.getItem("token");

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
    }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const institutions: Institution[] = await response.json();
    return institutions;
  } catch (error) {
    console.error("Error fetching allowed institutions:", error);
    throw error;
  }
}
