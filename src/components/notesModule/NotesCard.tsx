import React from "react";
import { noteCardProp } from "../../TS_INTERFACE/gInterface";

const NoteCard: React.FC<noteCardProp> = ({
  note = { title: "", noteSnippet: "", date: "" },
}) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{note.title || "Untitled Note"}</h3>
      <p style={styles.snippet}>{note.noteSnippet || "No content available"}</p>
      <p style={styles.date}>
        {note.date ? new Date(note.date).toLocaleDateString() : "No date"}
      </p>
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
    whiteSpace: "nowrap", // Prevents wrapping
    overflow: "hidden", // Hides overflow text
    textOverflow: "ellipsis", // Adds "..."
    width: "100%", // Ensures it doesn't break
  },
  date: {
    fontSize: "12px",
    color: "#777",
    marginTop: "5px",
  },
};

export default NoteCard;
