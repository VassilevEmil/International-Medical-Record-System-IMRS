import { combineReducers } from 'redux';
//import authReducer from './authReducer';
//import userPreferencesReducer from './userPreferencesReducer';

// reducer imports below
import medicalRecordsReducer from './MedicalRecords/medicalRecordsReducer';

export const rootReducer = combineReducers({
  //userPreferences: userPreferencesReducer,
  //auth: authReducer,
  records: medicalRecordsReducer,
  // ... other reducers
});

export type RootReducer = ReturnType<typeof rootReducer>;
