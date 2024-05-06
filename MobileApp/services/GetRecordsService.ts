import { MedicalRecordsResponse } from "../models/medicalRecord";

interface GetRecordResponse { 
    success: boolean;
    message: string;
    data?: MedicalRecordsResponse
  }
  
  export default class GetRecordsService {
    private static apiUrl = "https://imrs-server-12m3e12kdk1k12mek.tech/medicalRecords/getMedicalRecords/";
    private static apiUrl2 = "https://imrs-server-12m3e12kdk1k12mek.tech/medicalRecords/";

    static async getRecords(patientId: string, page: number, recordLimit: number): Promise<GetRecordResponse> {
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        recordLimit: recordLimit.toString(),
      });

      const urlWithPatientIdAndParams = `${this.apiUrl}${encodeURIComponent(patientId)}?${queryParams.toString()}`;

      try {
        const response = await fetch(urlWithPatientIdAndParams, { 
          method: "GET",
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
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
        console.error('2Network error:', error);
        console.error('2Error status:', error.status);
        console.error('2Error headers:', error.headers);
    
        // Attempt to read more details from the error object
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        } else if (typeof error === 'object') {
          console.error('Error details:', JSON.stringify(error));
        }
    
        return {
          success: false,
          message: `Record fetch failed: ${error instanceof Error ? error.message : 'A network error occurred'}`,
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
  
  
