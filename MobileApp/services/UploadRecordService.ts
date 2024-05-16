interface UploadResponse {
  success: boolean;
  message: string;

  data?: any;
}

export default class UploadRecordService {
  private static apiUrl = "https://imrs-server-12m3e12kdk1k12mek.tech/medicalRecords/";

  static async uploadRecord(formData: FormData): Promise<UploadResponse> {
    try {
      console.log("SENT DATA: ", formData);
      const response = await fetch(this.apiUrl, {
        method: "POST",
        body: formData,
        //'Content-Type' will be set automatically when using FormData
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Record uploaded successfully",
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
        message: `File upload failed: ${error}`,
      };
    }
  }
}
