import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { removeNote } from "../../actions/AddNote";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
    <div className="max-w-sm bg-white rounded-lg shadow-md p-5 border border-gray-200">
      <h2 className="text-xl font-bold text-black">
        {note?.title || "Untitled Note"}
      </h2>

      <p className="text-gray-800 mt-2">
        {note?.noteSnippet || "No content available"}
      </p>

      <p className="text-gray-500 text-sm mt-2">
        {note?.date ? new Date(note.date).toLocaleDateString() : "No date"}
      </p>

      <div className="flex justify-between items-center mt-4">
        <Link
          to={`/edit/${note?.id}`}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <EditIcon className="text-gray-600" />
        </Link>

        <button
          onClick={handleDelete}
          className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
        >
          <DeleteIcon className="text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
