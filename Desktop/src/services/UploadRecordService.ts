interface UploadResponse {
  success: boolean;
  message: string;

  data?: any;
}

export default class UploadRecordService {
  private static apiUrl =
    "https://imrs-server-12m3e12kdk1k12mek.tech/medicalRecords";

  static async uploadRecord(formData: FormData): Promise<UploadResponse> {
    try {
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
            message: "Record uploaded successfully",
            data: data,
          };
        } else {
          // Handle plain text response
          return {
            success: true,
            message: "Record uploaded successfully",
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
