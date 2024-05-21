interface UploadResponse {
  success: boolean;
  message: string;

  data?: any;
}

export default class UploadRecordService {
  private static apiUrl = `${import.meta.env.VITE_API_URL}/medicalRecords`;

  static async uploadRecord(
    formData: FormData,
    apiKey: string,
    institutionId: string
  ): Promise<UploadResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": apiKey,
          "institution-id": institutionId,
        },
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
          return {
            success: true,
            message: "Record uploaded successfully",
            data: null,
          };
        }
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
        message: `File upload failed: ${error}`,
      };
    }
  }
}
