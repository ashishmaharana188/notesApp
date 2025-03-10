import { Moment } from "moment";

import { Dispatch } from "redux";

export interface notesReducerIntf {
  id?: string;
  title: string;
  noteSnippet: string;
  tags: string;
  date: number;
}

export interface NotesFormProp {
  note?: notesReducerIntf;
  onSubmit?: (note: {
    id?: string;
    title: string;
    noteSnippet: string;
    tags: string;
    date: number;
  }) => void;
  dispatch?: Dispatch;
  onOpen?: () => void;
  onClose?: () => void;
  onSave?: () => void;
}
export interface NotesFormState {
  id: string;
  title: string;
  noteSnippet: string;
  tags: string;
  date: Moment;
  redirect: boolean;
}
export interface notesFilterReducerIntf {
  tags: string;
  sortBy: string | null;
  startDate?: Moment | null;
  endDate?: Moment | null;
  sortOrder: string | null;
}

export interface NoteListProps {
  notes: notesReducerIntf[];
}
export interface RootState {
  notes: notesReducerIntf[]; // ✅ This matches the store
  filters: notesFilterReducerIntf;
}
