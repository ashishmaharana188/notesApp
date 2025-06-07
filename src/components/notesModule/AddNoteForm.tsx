import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import NotesForm from "./NotesForm";
import { addNote } from "../../actions/AddNote";
import { NotesFormProp, NavigationState } from "../../TS_INTERFACE/gInterface";

const AddNoteForm = ({ onClose }: NotesFormProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state: NavigationState | null };

  const handleSubmit = (note: any) => {
    dispatch(addNote(note));
    const fromSlot = location.state?.fromSlot;
    if (fromSlot) {
      navigate("/notes/timeline", { state: { selectedSlot: fromSlot } });
    } else {
      navigate("/notes/timeline");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <NotesForm
        onSubmit={handleSubmit}
        onClose={() => {
          // *** Highlighted Change: Navigate based on fromSlot for Cancel ***
          const fromSlot = location.state?.fromSlot;
          if (fromSlot) {
            navigate("/notes/timeline", { state: { selectedSlot: fromSlot } });
          } else {
            navigate("/notes/timeline");
          }
          onClose?.();
          // *** End of Highlighted Change ***
        }}
      />
    </div>
  );
};

export default AddNoteForm;
