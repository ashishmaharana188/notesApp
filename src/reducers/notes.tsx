import { notesReducerIntf } from "../TS_INTERFACE/gInterface";

const notesReducerDefaultState: notesReducerIntf[] = [];

const notesReducer = (state = notesReducerDefaultState, action: any) => {
  switch (action.type) {
    case "ADD_NOTE":
      return [...state, action.note];
    case "EDIT_NOTE":
      return state.map((note) => {
        if (note.id === action.id) {
          return {
            ...note,
            ...action.updates,
          };
        } else {
          return note;
        }
      });
    case "REMOVE_NOTE":
      return [
        ...state.filter((note: notesReducerIntf) => note.id !== action.id),
      ];
    default:
      return state;
  }
};
export default notesReducer;
