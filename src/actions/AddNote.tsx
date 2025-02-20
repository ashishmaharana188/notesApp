import { v4 as uuid } from "uuid";

//ADD_NOTE
export const addNote = ({ title = "", noteSnippet = "", date = 0 } = {}) => ({
  type: "ADD_NOTE" as const,
  note: {
    id: uuid(),
    title,
    noteSnippet,
    date,
  },
});
