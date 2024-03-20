import {
  FETCH_MEDICAL_RECORDS_REQUEST,
  FETCH_MEDICAL_RECORDS_SUCCESS,
  FETCH_MEDICAL_RECORDS_FAILURE,
} from '../../constants/constants'

// Define the shape of your state
interface MedicalRecordsState {
  data: any[]; // Replace `any[]` with the actual data type later // define type of medicalRecord
  loading: boolean;
  error: string | null;
}

const initialState: MedicalRecordsState = {
  data: [],
  loading: false,
  error: null,
};

const medicalRecordsReducer = (
  state = initialState,
  action: any
): MedicalRecordsState => {
  switch (action.type) {
    case FETCH_MEDICAL_RECORDS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_MEDICAL_RECORDS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_MEDICAL_RECORDS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default medicalRecordsReducer;
