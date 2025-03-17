import { Moment } from "moment";
import { Dispatch } from "redux";

// Existing interfaces
export interface notesReducerIntf {
  id?: string;
  title: string;
  noteSnippet: string;
  tags: string;
  date: number;
  time: number;
}

export interface NotesFormProp {
  note?: notesReducerIntf;
  onSubmit?: (note: notesReducerIntf) => void;
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
  time: Moment;
  redirect: boolean;
  openDatePicker: boolean;
  openTimePicker: boolean;
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
  notes: notesReducerIntf[];
  filters: notesFilterReducerIntf;
}

// Updated TimelineProps interface
export interface TimelineProps {
  notes: notesReducerIntf[]; // Include notes in the props
}
