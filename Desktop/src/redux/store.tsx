import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

//reducer import below
import searchReducer from "./SearchReducer";

const rootReducer = combineReducers({
  searchReducer,
});

const store = configureStore({
  reducer: rootReducer,
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
