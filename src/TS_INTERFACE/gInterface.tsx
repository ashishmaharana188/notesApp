import { Moment } from "moment";

export interface notesProps {
  id: string;
  title: string;
  noteSnippet: string;
  date: string | number | Moment;
}

export interface NotesFormProp {
  notes?: notesProps;
  onSubmit?: (notes: {
    id?: string;
    title: string;
    noteSnippet: string;
    date: string | number | Moment;
  }) => void;
}
export interface NotesFormState {
  title: string;
  noteSnippet: string;
  date: Moment;
}
