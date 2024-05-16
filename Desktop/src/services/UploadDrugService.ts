import { MedicalRecord } from "../models/medicalRecord";

interface UploadResponse {
  success: boolean;
  message: string;

  data?: any;
}

export default class UploadRecordService {
  private static apiUrl = "http://localhost:8080/prescription";

  // "https://imrs-server-12m3e12kdk1k12mek.tech/prescription";

  static async uploadPrescription(formData: FormData): Promise<UploadResponse> {
    try {
      console.log("SENT DATA: ", formData);

      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      console.log("DAmn ", formData);
      console.log("DAmn2 ", formData.entries());

      const response = await fetch(this.apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          return {
            success: true,
            message: "Drug uploaded successfully",
            data: data,
          };
        } else {
          // Handle plain text response
          return {
            success: true,
            message: "Drug uploaded successfully",
            data: null,
          };
        }
      } else {
        const text = await response.text(); // Ensure you await the text
        return {
          success: false,
          message: `Server responded with status: ${response.status}: '${text}'`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `File upload failed: ${error}`,
      };
    }
  }
}
