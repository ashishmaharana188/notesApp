import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { removeNote } from "../../actions/AddNote";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../../styles/components/notesModule/NoteCard.css";

const NoteCard = ({ note }: NotesFormProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (note?.id) {
      dispatch(removeNote(note.id));
      navigate("/notes");
    } else {
      console.log("Entry not available to delete");
    }
  };

  return (
    <div className="note-card">
      <h2 className="note-title">{note?.title || "Untitled Note"}</h2>
      <p className="note-snippet">
        {note?.noteSnippet || "No content available"}
      </p>
      <p className="note-date">
        {note?.date ? new Date(note.date).toLocaleDateString() : "No date"}
      </p>

      {/* Edit & Remove Buttons */}
      <div className="note-actions">
        <Link to={`/edit/${note?.id}`} className="edit-button">
          <EditIcon className="edit-icon" />
        </Link>
        <button onClick={handleDelete} className="delete-button">
          <DeleteIcon className="delete-icon" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
