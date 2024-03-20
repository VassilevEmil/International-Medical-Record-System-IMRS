import {
    FETCH_MEDICAL_RECORDS_REQUEST,
    FETCH_MEDICAL_RECORDS_SUCCESS,
    FETCH_MEDICAL_RECORDS_FAILURE,
} from '../../constants/constants'

import { Dispatch } from "redux";

export const fetchMedicalRecords = () => async (dispatch : Dispatch) => {
    dispatch({ type: 'FETCH_MEDICAL_RECORDS_REQUEST' });
  
    try {
      const response = await fetch('http://localhost:3000/medicalRecords');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      dispatch({ type: 'FETCH_MEDICAL_RECORDS_SUCCESS', payload: data });
    } catch (error: any) {
      dispatch({ type: 'FETCH_MEDICAL_RECORDS_FAILURE', payload: error.message });
    }
  };