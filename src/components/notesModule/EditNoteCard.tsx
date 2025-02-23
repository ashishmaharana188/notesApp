import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import NotesForm from "./NotesForm";
import { useParams, useNavigate } from "react-router-dom";
import { notesReducerIntf } from "../../TS_INTERFACE/gInterface";
import { editNote, removeNote } from "../../actions/AddNote";

const EditNotePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const note = useSelector((state: any) =>
    state.notes.find((note: notesReducerIntf) => note.id === id)
  );
  useEffect(() => {
    console.log("🔄 EditNotePage Mounted or Re-rendered");
  });

  // Logging for debugging
  console.log("editId", id);
  console.log("note", note);

  return (
    <div>
      <NotesForm
        note={note}
        onSubmit={(note) => {
          if (id) {
            dispatch(editNote(id, note));
            navigate("/notes");
          } else {
            console.log(`id is not present`);
          }
        }}
      />

      <button
        onClick={() => {
          if (id) {
            dispatch(removeNote(id));
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

export default EditNotePage;
