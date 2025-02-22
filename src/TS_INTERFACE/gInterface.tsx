import { Moment } from "moment";

import { Dispatch } from "redux";

export interface notesReducerIntf {
  id: string;
  title: string;
  noteSnippet: string;
  date: number;
}
export interface noteCardProp {
  note?: notesReducerIntf;
}
export interface NotesFormProp {
  note?: notesReducerIntf;
  onSubmit?: (note: {
    id?: string;
    title: string;
    noteSnippet: string;
    date: number;
  }) => void;
  dispatch?: Dispatch;
  onClose?: () => void;
}
export interface NotesFormState {
  id: string;
  title: string;
  noteSnippet: string;
  date: Moment;
}
export interface notesFilterReducerIntf {
  tag: string;
  sortBy: string | null;
  startDate?: Moment | null;
  endDate?: Moment | null;
  sortOrder: string | null;
}

export interface NoteListProps {
  notes: notesReducerIntf[];
}
