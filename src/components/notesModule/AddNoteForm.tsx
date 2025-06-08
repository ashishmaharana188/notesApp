import { useDispatch } from "react-redux";
import NotesForm from "./NotesForm";
import { addNote } from "../../actions/AddNote";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material"; // For loading circle
import CheckIcon from "@mui/icons-material/Check"; // For tick mark
import { useState, useRef, useEffect } from "react";

const AddNoteForm = ({ onClose }: NotesFormProp) => {
  const [lastDispatchTime, setLastDispatchTime] = useState<number>(0);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false); // Track animation visibility
  const dispatch = useDispatch();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // For animation
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // For hiding animation

  const handleSubmit = (note: any) => {
    const currentTime = Date.now();
    const timeSinceLastDispatch = (currentTime - lastDispatchTime) / 1000;

    if (timeSinceLastDispatch < 0.1) {
      return;
    }

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Reset animation
    setAnimationKey((prev) => prev + 1);
    setIsAnimating(true); // Show animation

    // Dispatch the note addition
    dispatch(addNote(note));
    setLastDispatchTime(currentTime);

    // Animation sequence
    timeoutRef.current = setTimeout(() => {
      const loadingCircle = document.querySelector(".loading-circle");
      const filledCircle = document.querySelector(".filled-circle");
      const tickContainer = document.querySelector(".tick-container");
      loadingCircle?.classList.add("hidden");
      filledCircle?.classList.remove("hidden");
      tickContainer?.classList.remove("hidden");
      timeoutRef.current = null;
    }, 700);

    // Hide animation after 0.5s if no new dispatch
    hideTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false); // Trigger fade-out animation
      hideTimeoutRef.current = null;
    }, 1200); // 700ms (animation) + 500ms (0.5s idle)
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg relative">
      {/* Notes Form */}
      <NotesForm
        onSubmit={handleSubmit}
        onClose={() => {
          onClose?.();
        }}
      />

      {/* Loading Circle, Filled Circle, Tick Mark, and Success Animation */}
      <motion.div
        key={animationKey}
        className="animation-container absolute inset-0 flex flex-col items-center mt-62 ml-38 justify-center bg-white rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAnimating ? 1 : 0 }} // Fade in/out based on isAnimating
        transition={{ duration: 0.1, ease: "easeOut" }} // Ease-out when hiding
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            className="loading-circle"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.1, ease: "linear" }}
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
            transition={{ duration: 0.01, ease: "easeInOut" }}
          />

          {/* Tick Mark Container for 0.25s */}
          <motion.div
            className="tick-container hidden absolute flex items-center justify-center z-10"
            style={{ width: "40px", height: "40px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.01, ease: "easeInOut" }}
          >
            <CheckIcon
              className="size-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-sm z-10"
              style={{ fill: "white" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNoteForm;
