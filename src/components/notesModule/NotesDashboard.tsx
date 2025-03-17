import { useState, useEffect, useRef } from "react";
import AddNoteButton from "./AddNoteButton";
import "../../styles/components/notesModule/NoteDashboard.css";
import NotesTimeline from "./NotesTimeLine";

const NotesDashboardPage = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY === 0);
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <p
        className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-4xl font-bold transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        Dashboard!
      </p>

      <div className="flex flex-col items-start w-full max-w-15xl mt-20">
        {/* Ensure the NotesTimeline component takes full height */}
        <div className="w-full h-full flex flex-col items-start">
          <NotesTimeline />
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <AddNoteButton />
      </div>
    </div>
  );
};

export default NotesDashboardPage;
