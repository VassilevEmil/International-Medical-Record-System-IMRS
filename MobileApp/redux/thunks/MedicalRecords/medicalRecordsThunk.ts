import {
    FETCH_MEDICAL_RECORDS_REQUEST,
    FETCH_MEDICAL_RECORDS_SUCCESS,
    FETCH_MEDICAL_RECORDS_FAILURE,
} from '../../constants/constants'

import { Dispatch } from "redux";

export const fetchMedicalRecords = () => async (dispatch: Dispatch) => {
  dispatch({ type: 'FETCH_MEDICAL_RECORDS_REQUEST' });
  console.log("FETCH_MEDICAL_RECORDS_REQUEST");
  try {
    console.log("INSIDE TRY BRACKETS");
    const response = await fetch('http://127.0.0.1:3200/medicalRecords/allMedicalHistories?patientId=123', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee bro", data);
    dispatch({ type: 'FETCH_MEDICAL_RECORDS_SUCCESS', payload: data });
  } catch (error) {
    console.error('Fetch medical records failed:', error);
    dispatch({ type: 'FETCH_MEDICAL_RECORDS_FAILURE', payload: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};
