import { SET_PATIENT_ID } from "../constants/constants";

export const setPatientId = (payload: string) => ({
    type: SET_PATIENT_ID,
    payload: payload
  });