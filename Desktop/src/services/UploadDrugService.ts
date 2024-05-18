interface UploadResponse {
  success: boolean;
  message: string;

  data?: any;
}

export default class UploadRecordService {
  private static apiUrl =
       "https://imrs-server-12m3e12kdk1k12mek.tech/prescription";

  static async uploadDrugRecord(formData: FormData): Promise<UploadResponse> {
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
            message: "Drug uploaded successfully",
            data: data,
          };
        } else {
          return {
            success: true,
            message: "Drug uploaded successfully",
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
