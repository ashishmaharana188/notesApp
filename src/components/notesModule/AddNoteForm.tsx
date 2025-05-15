import { useDispatch } from "react-redux";
import NotesForm from "./NotesForm";
import { addNote } from "../../actions/AddNote";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";

const AddNoteForm = ({ onClose }: NotesFormProp) => {
  const dispatch = useDispatch();

  const handleSubmit = (note: any) => {
    dispatch(addNote(note));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <NotesForm onSubmit={handleSubmit} onClose={onClose} />
    </div>
  );
};

export default AddNoteForm;
