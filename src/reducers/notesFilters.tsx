import { notesFilterReducerIntf } from "../TS_INTERFACE/gInterface";

const notesFiltersReducerDefaultState = {
  tag: "",
  sortBy: "",
  sortOrder: "",
  startDate: null,
  endDate: null,
};
const notesFitlerReducer = (
  state: notesFilterReducerIntf = notesFiltersReducerDefaultState,
  action: any
) => {
  switch (action.type) {
    case "SET_TAGS":
      return {
        ...state,
        tag: action.tag,
      };
    default:
      return state;
  }
};
export default notesFitlerReducer;
