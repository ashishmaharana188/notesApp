import React from "react";
import { NotesForm } from "../../TS_INTERFACE/gInterface";

const NoteCard: React.FC<NotesForm> = ({ note, onClick }) => {
  return (
    <div onClick={onClick}>
      <h3>{note.title}</h3>
      <p>{note.noteSnippet}</p>
      <p>{new Date(note.Date).toLocaleDateString()}</p>
    </div>
  );
};
export default NoteCard;
