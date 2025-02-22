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
  });
  store.subscribe(() => {
    console.log("Redux Store Updated:", store.getState()); // ✅ Debug Log
  });
  return store;
};
