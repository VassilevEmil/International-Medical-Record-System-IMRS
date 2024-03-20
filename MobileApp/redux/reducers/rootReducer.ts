import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userPreferencesReducer from './userPreferencesReducer';

// reducer imports below
import medicalRecordReducer from './MedicalRecords/medicalRecordReducer'

const rootReducer = combineReducers({
  //userPreferences: userPreferencesReducer,
  //auth: authReducer,
  records: medicalRecordReducer,
  // ... other reducers
});

export default rootReducer;
