import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";
import { removeNote } from "../../actions/AddNote";

import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

const NoteCard = React.memo(({ note }: NotesFormProp) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (note?.id) {
      dispatch(removeNote(note.id));
    } else {
      console.log("Entry not available to delete");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3 }}
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
        {" "}
        {/* Use flex to align items to the left */}
        <p className="inline-block p-2 pl-3 pr-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
          {note?.tags || "No tags"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Link
          to={`/edit/${note?.id}`}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <EditIcon className="text-gray-600" />
        </Link>

        <button
          onClick={handleDelete}
          className="p-2 bg-white rounded-lg hover:bg-[#525b28]/30 transition"
        >
          <DeleteIcon className="text-red-600" />
        </button>
      </div>
    </motion.div>
  );
});

export default NoteCard;
