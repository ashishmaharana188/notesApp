import React from "react";
import { Link } from "react-router-dom";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { removeNote } from "../../actions/AddNote";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const NoteCard = ({ note }: NotesFormProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{note?.title || "Untitled Note"}</h3>
      <p style={styles.snippet}>
        {note?.noteSnippet || "No content available"}
      </p>
      <p style={styles.date}>
        {note?.date ? new Date(note.date).toLocaleDateString() : "No date"}
      </p>
      <Link to={`/edit/${note?.id}`} style={styles.button}>
        Edit
      </Link>
      <button
        onClick={() => {
          if (note?.id) {
            dispatch(removeNote(note.id));
            navigate("/notes");
          } else {
            console.log("Entry not available to delete");
          }
        }}
      >
        Remove
      </button>
    </div>
  );
};

// Styles for truncating text
const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "5px",
    maxWidth: "300px",
    margin: "10px",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  snippet: {
    fontSize: "14px",
    color: "#555",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  date: {
    fontSize: "12px",
    color: "#777",
    marginTop: "5px",
  },
};

export default NoteCard;
