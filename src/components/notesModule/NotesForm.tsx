import React from "react";

const NoteCard = ({ note, onClick }) => {
  return (
    <div onClick={onClick}>
      <h3>{note.title}</h3>
      <p>{note.noteSnippet}</p>
      <p>{new Date(note.Date).toLocaleDateString()}</p>
    </div>
  );
};
