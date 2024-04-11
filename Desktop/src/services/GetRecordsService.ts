interface GetRecordResponse { // need to specify later on, exact data.
    success: boolean;
    message: string;
    data?: any;
  }
  
  export default class GetRecordsService {
    private static apiUrl = "https://localhost:3000/medicalRecords/getTenMedicalRecords/233";
  
    static async getRecords(): Promise<GetRecordResponse> {
      try {
        const response = await fetch(this.apiUrl, {
          method: "GET"
          //'Content-Type' SET IT LATER ON
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
          message: `Record fetch failed: ${error}`,
        };
      }
    }
  }
  
