interface UploadResponse {
    success: boolean;
    message: string;
    data?: any;
  }

  export default class UploadRecordService {
    private static apiUrl = 'API_ENDPOINT'; 
  
    static async uploadRecord(formData: FormData): Promise<UploadResponse> {
      try {
        console.log("SENT DATA: ", formData);
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          body: formData,
          //'Content-Type' will be set automatically when using FormData
        });
  
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            message: 'Record uploaded successfully',
            data: data,
          };
        } else {
          // HTTP errors
          return {
            success: false,
            message: `Server responded with status: ${response.status}`,
          };
        }
      } catch (error) {
        // network errors
        return {
          success: false,
          message: `File upload failed: ${error}`,
        };
      }
    }
  }