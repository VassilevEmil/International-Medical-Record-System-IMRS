import AsyncStorage from "@react-native-async-storage/async-storage";

interface GetFileResponse { 
    success: boolean;
    message: string;
    data?: string; 
    mimeType?: string; 
}  

const baseApiUrl = `https://imrs-server-12m3e12kdk1k12mek.tech/api/medicalRecords`;

const fetchFromApi = async (url: string, logout: () => Promise<void>): Promise<Response> => {
  const bearerToken = await AsyncStorage.getItem("token");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  });

  const responseBody = await response.json();  // Parse the JSON response body
  if (!response.ok) {
    if (response.status === 400 || responseBody.message === "Invalid token!") {
      await logout();
      throw new Error('Unauthorized access or invalid token. Logging out.');
    }
    throw new Error(`Server responded with status: ${response.status}: '${responseBody.message}'`);
  }

  return response;
};

const getFile = async (medicalRecordId: string, fileId: string, logout: () => Promise<void>): Promise<GetFileResponse> => {
  const url = `${baseApiUrl}/getFile/${medicalRecordId}/${fileId}`;
  
  try {
    const response = await fetchFromApi(url, logout);
    const mimeType = response.headers.get("Content-Type") || "application/octet-stream";
    return {
      success: true,
      message: "File fetched successfully",
      data: response.url,
      mimeType: mimeType,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `File fetch failed: ${error.message}`,
    };
  }
};

export { getFile };
