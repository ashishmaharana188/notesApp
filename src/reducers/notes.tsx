import { notesReducerIntf } from "../TS_INTERFACE/gInterface";

const notesReducerDefaultState: notesReducerIntf[] = [];

const notesReducer = (state = notesReducerDefaultState, action: any) => {
  switch (action.type) {
    case "ADD_NOTE":
      return [...state, action.note];
    default:
      return state;
  }
};
export default notesReducer;
