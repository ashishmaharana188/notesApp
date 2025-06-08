import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { removeNote } from "../../actions/AddNote";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

const NoteCard = React.memo(
  ({ note, onEdit }: NotesFormProp & { onEdit?: () => void }) => {
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false); // Track delete animation state

    const handleDelete = () => {
      if (note?.id) {
        setIsDeleting(true); // Start the delete animation
      } else {
        console.log("Entry not available to delete");
      }
    };

    const handleAnimationComplete = () => {
      if (isDeleting && note?.id) {
        dispatch(removeNote(note.id)); // Dispatch delete after animation
      }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isDeleting
            ? {
                scale: 0, // Scale down toward the right
                opacity: 0, // Fade out
                x: "100%", // Pull toward the right
                z: -100, // Pull backward (sucked in effect)
                borderTopRightRadius: "30%", // Round only the left top corner
                borderBottomRightRadius: "30%",
                borderBottomLeftRadius: "10%",
                borderTopLeftRadius: "10%", // Round only the left bottom corner
                filter: "blur(2px)", // Add blur for smoother appearance
                transition: {
                  duration: 0.3, // Total duration
                  ease: "easeIn",
                  scale: { duration: 0.1 }, // Collapse quickly
                  x: { delay: 0.1, duration: 0.1 }, // Then pull right
                  z: { delay: 0.1, duration: 0.1 }, // Pull back simultaneously
                  borderTopLeftRadius: { duration: 0.1 }, // Smooth left top edge
                  borderBottomLeftRadius: { duration: 0.1 },
                  borderBottomRightRadius: { duration: 0.1 },
                  borderTopRightRadius: { duration: 0.1 }, // Smooth left bottom edge
                  filter: { duration: 0.1 }, // Apply blur during collapse
                },
              }
            : {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }
        }
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={handleAnimationComplete} // Trigger delete after animation
        style={{ transformOrigin: "center right" }} // Collapse toward the right edge
        className="w-120 mb-2 ml-3 bg-white rounded-lg shadow-md p-5 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-black">
          {note?.title || "Untitled Note"}
        </h2>

        <p className="text-gray-800 mt-2">
          {note?.noteSnippet || "No content available"}
        </p>

        <p className="text-gray-500 text-sm mt-2">
          {note?.date ? new Date(note.date).toLocaleDateString() : "No date"}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          {note?.time ? new Date(note.time).toLocaleTimeString() : "No Time"}
        </p>

        <div className="flex justify-end mt-2">
          <p className="inline-block p-2 pl-3 pr-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            {note?.tags || "No tags"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          {onEdit ? (
            <button
              onClick={onEdit}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <EditIcon className="text-gray-600" />
            </button>
          ) : (
            <Link
              to={`/edit/${note?.id}`}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <EditIcon className="text-gray-600" />
            </Link>
          )}

          <button
            onClick={handleDelete}
            className="p-2 bg-white rounded-lg hover:bg-[#525b28]/30 transition"
            disabled={isDeleting} // Disable button during animation
          >
            <DeleteIcon className="text-red-600" />
          </button>
        </div>
      </motion.div>
    );
  }
);

export default NoteCard;
