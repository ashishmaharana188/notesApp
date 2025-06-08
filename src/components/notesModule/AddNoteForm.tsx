import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import NotesForm from "./NotesForm";
import { addNote } from "../../actions/AddNote";
import { NotesFormProp, NavigationState } from "../../TS_INTERFACE/gInterface";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material"; // For loading circle
import CheckIcon from "@mui/icons-material/Check"; // For tick mark

const AddNoteForm = ({ onClose }: NotesFormProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state: NavigationState | null };

  const handleSubmit = (note: any) => {
    // Show animation by adding a class
    const animationContainer = document.querySelector(".animation-container");
    animationContainer?.classList.remove("hidden");

    // Dispatch the note addition
    dispatch(addNote(note));

    // Artificial delay for animation
    setTimeout(() => {
      // After 0.25s, hide circle, show filled green circle and tick mark
      const loadingCircle = document.querySelector(".loading-circle");
      const filledCircle = document.querySelector(".filled-circle");
      const tickContainer = document.querySelector(".tick-container");
      loadingCircle?.classList.add("hidden");
      filledCircle?.classList.remove("hidden");
      tickContainer?.classList.remove("hidden");

      setTimeout(() => {
        // After 0.6s, navigate
        const fromSlot = location.state?.fromSlot;
        if (fromSlot) {
          navigate("/notes/timeline", { state: { selectedSlot: fromSlot } });
        } else {
          navigate("/notes/timeline");
        }
        onClose?.();
      }, 600);
    }, 700);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg relative">
      {/* Notes Form */}
      <NotesForm
        onSubmit={handleSubmit}
        onClose={() => {
          const fromSlot = location.state?.fromSlot;
          if (fromSlot) {
            navigate("/notes/timeline", { state: { selectedSlot: fromSlot } });
          } else {
            navigate("/notes/timeline");
          }
          onClose?.();
        }}
      />

      {/* Loading Circle, Filled Circle, Tick Mark, and Success Animation */}
      <div className="animation-container hidden absolute inset-0 flex flex-col items-center mt-62 ml-38 justify-center bg-white rounded-lg">
        <div className="relative flex items-center justify-center">
          <motion.div
            className="loading-circle"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.25, ease: "linear" }}
          >
            <CircularProgress size={20} sx={{ color: "#525b28" }} />{" "}
          </motion.div>

          <motion.div
            className="filled-circle hidden absolute z-0"
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#525b28",
              borderRadius: "50%",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          />

          {/* Tick Mark Container for 0.25s */}
          <motion.div
            className="tick-container hidden absolute flex items-center justify-center z-10"
            style={{ width: "40px", height: "40px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <CheckIcon
              className="size-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-sm z-10"
              style={{ fill: "white" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddNoteForm;
