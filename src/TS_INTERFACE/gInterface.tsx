export interface notesProps {
  title: string;
  noteSnippet: string;
  Date: string | number | Date;
}

export interface NotesForm {
  note: notesProps;
  onClick: () => void;
}
