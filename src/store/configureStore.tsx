import { configureStore, combineReducers } from "@reduxjs/toolkit";
import notesReducer from "../reducers/notes";
import notesFitlerReducer from "./../reducers/notesFilters";

export default () => {
  //ROOT REDUCER
  const rootReducer = combineReducers({
    notes: notesReducer,
    filters: notesFitlerReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });
  return store;
};
