import { SET_PATIENT_ID } from "../constants/constants";

const initialState = {
  patientId: "",
};

export default function searchReducer(state = initialState, action: any) {
  switch (action.type) {
    case SET_PATIENT_ID:
      state = {
        patientId: action.payload,
      };
      return state;
    default:
      return state;
  }
}