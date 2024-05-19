import { MedicalRecordsResponse } from "../models/medicalRecord";

interface GetRecordResponse {
  success: boolean;
  message: string;
  data?: MedicalRecordsResponse;
}

export default class GetRecordsService {
  private static apiUrl = `${
    import.meta.env.VITE_API_URL
  }/medicalRecords/getMedicalRecords/`;
  private static apiUrl2 = `${import.meta.env.VITE_API_URL}/medicalRecords/`;

  static async getRecords(
    patientId: string,
    page: number,
    recordLimit: number,
    apiKey: string,
    institutionId: string
  ): Promise<GetRecordResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      recordLimit: recordLimit.toString(),
    });

    const urlWithPatientIdAndParams = `${this.apiUrl}${encodeURIComponent(
      patientId
    )}?${queryParams.toString()}`;

    try {
      const response = await fetch(urlWithPatientIdAndParams, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "institution-id": institutionId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Records fetched successfully",
          data: data,
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
        message: `Record fetch failed: ${
          error instanceof Error ? error.message : error
        }`,
      };
    }
  }

  static async fetchRecord(
    recordId: string,
    apiKey: string,
    institutionId: string
  ): Promise<GetRecordResponse> {
    const urlWithRecordId = this.apiUrl2 + encodeURIComponent(recordId);
    try {
      const response = await fetch(urlWithRecordId, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "institution-id": institutionId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Record fetched successfully",
          data: data,
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
        message: `Record fetch failed: ${
          error instanceof Error ? error.message : error
        }`,
      };
    }
  }
}
