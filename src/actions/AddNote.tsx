import { v4 as uuid } from "uuid";

//ADD_NOTE
export const addNote = ({
  title = "",
  noteSnippet = "",
  date = 0,
  tags = "",
  time = "",
} = {}) => ({
  type: "ADD_NOTE" as const,
  note: {
    id: uuid(),
    title,
    noteSnippet,
    date,
    tags,
    time,
  },
});

export const editNote = (id: string, updates: any) => ({
  type: "EDIT_NOTE",
  id,
  updates,
});

export const removeNote = (id: string) => ({
  type: "REMOVE_NOTE" as const,
  id,
});
