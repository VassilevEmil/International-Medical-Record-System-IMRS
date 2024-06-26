/**
Data interface
defines the structure of the response object that the getFile method returns.
*/
interface GetFileResponse { // TO DO: NEED to specify EXACTLY THE DATA TYPES WE EXPECT.
    success: boolean;
    message: string;
    data?: string; 
    mimeType?: string; 
}  

/**
 * Service class that is responsible for fetching files from the server.
 */
export default class GetFileService {

  // Base URL of IMRS (our) API
  private static baseApiUrl = `${import.meta.env.VITE_API_URL}/medicalRecords/`;

  /**
 * Fetches a file from the server associated with the given medical record ID and file ID.
 * @param medicalRecordId The ID of the medical record that is associated with the file.
 * @param fileId The ID of the file to fetch.
 * @returns A promise that resolves to a GetFileResponse object.
 * @throws Throws an error if the fetch operation fails.
 */
  static async getFile(medicalRecordId: string, fileId: string, apiKey: string, institutionId: string): Promise<GetFileResponse> {
    const url = `${this.baseApiUrl}/getFile/${medicalRecordId}/${fileId}`;
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "institution-id": institutionId,
        },
      });

      if (response.ok) {
        const mimeType = response.headers.get("Content-Type") || "application/octet-stream";
        const blob = await response.blob(); 
        // Create a blob URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        // Return object defined by the GetFileResponse interface.
        return {
          success: true,
          message: "File fetched successfully",
          data: blobUrl,
          mimeType: mimeType,
        };

      } else {
        const text = await response.text();
        return {
          success: false,
          message: `Server responded with status: ${response.status}: '${text}'`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `File fetch failed: ${error}`,
      };
    }
  }
}