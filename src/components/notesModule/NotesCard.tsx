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
                scale: 0,
                opacity: 0,
                x: "100%",
                z: -100,
                borderTopRightRadius: "30%",
                borderBottomRightRadius: "30%",
                borderBottomLeftRadius: "10%",
                borderTopLeftRadius: "10%",
                filter: "blur(2px)",
                transition: {
                  duration: 0.3,
                  ease: "easeIn",
                  scale: { duration: 0.1 },
                  x: { delay: 0.1, duration: 0.1 },
                  z: { delay: 0.1, duration: 0.1 },
                  borderTopLeftRadius: { duration: 0.1 },
                  borderBottomLeftRadius: { duration: 0.1 },
                  borderBottomRightRadius: { duration: 0.1 },
                  borderTopRightRadius: { duration: 0.1 },
                  filter: { duration: 0.1 },
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
        onAnimationComplete={handleAnimationComplete}
        style={{ transformOrigin: "center right" }}
        className="w-120 mb-2 ml-3 bg-white rounded-lg shadow-md p-5 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-black">
          {note?.title || "Untitled Note"}
        </h2>

        <p className="text-xl mt-3 text-gray-800 mt-2">
          {note?.noteSnippet || "No content available"}
        </p>

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col mt-5">
            <p className="text-xl mt-3 text-gray-500">
              {note?.date
                ? new Date(note.date).toLocaleDateString()
                : "No date"}
            </p>
            <p className="text-xl mt-2 text-gray-500">
              {note?.time
                ? new Date(note.time).toLocaleTimeString()
                : "No Time"}
            </p>
          </div>
          <p className="text-xl text-black h-9 bg-[#525b28]/30 mt-15 rounded-lg px-3 py-1 hover:bg-[#525b28]/20 transition">
            {note?.tags || "No tags"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          {onEdit ? (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-[#525b28]/30 transition"
            >
              <EditIcon className="text-gray-600" />
            </button>
          ) : (
            <Link
              to={`/edit/${note?.id}`}
              className="p-2 rounded-lg hover:bg-[#525b28]/30 transition"
            >
              <EditIcon className="text-gray-600" />
            </Link>
          )}

          <button
            onClick={handleDelete}
            className="p-2 bg-white rounded-lg hover:bg-[#525b28]/30 transition"
            disabled={isDeleting}
          >
            <DeleteIcon className="text-red-600" />
          </button>
        </div>
      </motion.div>
    );
  }
);

export default NoteCard;
