import AsyncStorage from "@react-native-async-storage/async-storage";
import { MedicalRecordsResponse } from "../models/medicalRecord";

interface GetRecordResponse { 
    success: boolean;
    message: string;
    data?: MedicalRecordsResponse
  }
  
  export default class GetRecordsService {
    private static apiUrl = `https://imrs-server-12m3e12kdk1k12mek.tech/api/medicalRecords/getMedicalRecords`;
    private static apiUrl2 = `https://imrs-server-12m3e12kdk1k12mek.tech/api/medicalRecords/getMedicalRecordById/`;

    static async getRecords(page: number, recordLimit: number): Promise<GetRecordResponse> {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        recordLimit: recordLimit.toString(),
      });

      const bearerToken = await AsyncStorage.getItem("token");
      
      const urlWithParams = `${this.apiUrl}?${queryParams.toString()}`;
      console.log("as ", urlWithParams);
      try {
        const response = await fetch(urlWithParams, { 
          method: "GET",
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        }
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
  
  
