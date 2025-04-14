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

export interface noteTimelineState {
  clickedDot: number | null;
  activeInterval: number | null;
}

export interface NotesTimelineFilterProps {
  interval: "6h" | "12h" | "24h";
  setInterval: (value: "6h" | "12h" | "24h") => void;
  selectedAMPM: "AM" | "PM" | null;
  setSelectedAMPM: (value: "AM" | "PM") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
}

export interface NotesTimelineProps extends NoteListProps {
  filterButton: boolean;
  interval: "6h" | "12h" | "24h";
  sortOrder: "asc" | "desc";
  selectedAMPM: "AM" | "PM" | null;
  is24Hour: boolean;
  setSelectedAMPM: (value: "AM" | "PM") => void;
  scrollPosition: number;
  onFilteredNotesChange?: (hasNotes: boolean) => void;
  userChangedAMPM: React.MutableRefObject<boolean>;
}

export interface NotesTimelineRef {
  getFilteredNotesLength: () => number;
}
