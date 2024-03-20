// store.js
import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers/rootReducer';

// persistance configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'userPreferences'], // Reducers to persist
  // blacklist: ['medRecords'], // Reducers not to persist (Medical records in our case)
  //// Persistance usually comes with caveat of security. 
  // If we persist medical records we need to use encryption here 
  //(Research, there is some default encryption libs for react for exactly this use case - to encrypt persisted data)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Default export that initializes and returns both persistor and store
export default function configureStore() => {
  let store = createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return { store, persistor };
};
