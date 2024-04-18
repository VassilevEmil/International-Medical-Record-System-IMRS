interface GetRecordResponse { // need to specify later on, exact data.
    success: boolean;
    message: string;
    data?: any;
  }
  
  export default class GetRecordsService {
    private static apiUrl = "https://localhost:3000/medicalRecords/getTenMedicalRecords/";
    private static apiUrl2 = "https://localhost:3000/medicalRecords/";

    static async getRecords(patientId: string): Promise<GetRecordResponse> {
      const urlWithPatientId = this.apiUrl + encodeURIComponent(patientId); // Append the patientId to the apiUrl
      try {
        const response = await fetch(urlWithPatientId, { // Use the complete URL with patientId
          method: "GET",
          // Headers will be set here, if needed
        });
  
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            message: "Records fetched successfully",
            data: data,
          };
        } else {
          // HTTP errors
          const text = await response.text();
          return {
            success: false,
            message: `Server responded with status: ${response.status}: '${text}'`,
          };
        }
      } catch (error) {
        // network errors
        return {
          success: false,
          message: `Record fetch failed: ${error instanceof Error ? error.message : error}`,
        };
      }
    }

    static async fetchRecord(recordId: string) : Promise<GetRecordResponse> {

      const urlWithRecordId = this.apiUrl2 + encodeURIComponent(recordId);
      try {
        const response = await fetch(urlWithRecordId, { 
          method: "GET",
        });
  
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            message: "Record fetched successfully",
            data: data,
          };
        } else {
          // HTTP errors
          const text = await response.text();
          return {
            success: false,
            message: `Server responded with status: ${response.status}: '${text}'`,
          };
        }
      } catch (error) {
        // network errors
        return {
          success: false,
          message: `Record fetch failed: ${error instanceof Error ? error.message : error}`,
        };
      }
    }
  }
  
  
