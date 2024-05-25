import EncryptedStorage from "react-native-encrypted-storage";
import { MedicalRecordsResponse } from "../models/medicalRecord";

interface GetRecordResponse {
  success: boolean;
  message: string;
  data?: MedicalRecordsResponse;
}

const apiUrl2 = `https://imrs-server-12m3e12kdk1k12mek.tech/api/medicalRecords/getMedicalRecordById`;

const apiUrl = `https://imrs-server-12m3e12kdk1k12mek.tech/api/medicalRecords/getMedicalRecords`;

const fetchFromApi = async (url: string, logout: () => Promise<void>): Promise<any> => {
  const bearerToken = await EncryptedStorage.getItem("token");
  console.log(bearerToken);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const responseBody = await response.json();
  if (!response.ok) {
    if (response.status === 400 || responseBody.message.includes("Invalid token!")) {
      await logout();
      throw new Error('Unauthorized access or invalid token. Logging out.');
    }
    throw new Error(`Server responded with status: ${response.status}`);
  }
  return responseBody;
};

export const getRecords = async (page: number, recordLimit: number, logout: () => Promise<void>): Promise<GetRecordResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    recordLimit: recordLimit.toString(),
  });

  const urlWithParams = `${apiUrl}?${queryParams}`;

  try {
    const data = await fetchFromApi(urlWithParams, logout);
    return {
      success: true,
      message: "Records fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Record fetch failed: ${error.message}`,
    };
  }
};

export const fetchRecord = async (recordId: string, logout: () => Promise<void>): Promise<GetRecordResponse> => {
  const urlWithRecordId = `${apiUrl2}/${encodeURIComponent(recordId)}`;

  try {
    const data = await fetchFromApi(urlWithRecordId, logout);
    return {
      success: true,
      message: "Record fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Record fetch failed: ${error.message}`,
    };
  }
};
