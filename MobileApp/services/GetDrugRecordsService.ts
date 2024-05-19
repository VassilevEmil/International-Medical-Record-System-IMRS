import axios from 'axios';

import {  DrugRecordResponse } from '../models/drugRecord';



interface GetDrugResponse {
    success: boolean;
    message: string;
    data?: DrugRecordResponse[],
}

export default class GetDrugsService {

  private static BASE_URL = `${process.env.API_BASE_URL}/drugRecords/getAllDrugRecords/`;

    static async fetchDrugRecordsByPatientId(patientId: string, page: number, recordLimit: number): Promise<GetDrugResponse> {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          recordLimit: recordLimit.toString(),
        });
      
        const urlWithPatientIdAndParams = `${this.BASE_URL}${encodeURIComponent(patientId)}?${queryParams.toString()}`;
      
        try {
          const response = await fetch(urlWithPatientIdAndParams, {
            method: "GET",
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log("records from service, " , data);
            
    
            return {
              success: true,
              message: "Records fetched successfully test",
              data: data
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
            message: `Record fetch failed: ${error instanceof Error ? error.message : 'A network error occurred'}`,
          };
        }
      }

    }