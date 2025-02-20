import { v4 as uuid } from "uuid";

export const addNote = ({ title = "", noteSnippet = "", date = 0 } = {}) => ({
  type: "ADD_NOTE" as const,
  expense: {
    id: uuid(),
    title,
    noteSnippet,
    date,
  },
});
