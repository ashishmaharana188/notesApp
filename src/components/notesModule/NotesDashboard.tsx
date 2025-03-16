import { useState, useEffect, useRef } from "react";
import AddNoteButton from "./AddNoteButton";
import "../../styles/components/notesModule/NoteDashboard.css";
import NotesList from "./NotesList";
import Timeline from "./NotesTimeLine";

const NotesDashboardPage = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    setStartTime(new Date());

    const handleScroll = () => {
      setVisible(window.scrollY === 0);
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <p
        className={`fixed top-2 left-1/2 transform -translate-x-1/2 text-4xl font-bold transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        Dashboard!
      </p>

      {startTime && (
        <div className="w-full max-w-5xl mt-6">
          <Timeline startTime={startTime} />
        </div>
      )}

      <div className="w-full max-w-5xl mt-6">
        <NotesList />
      </div>

      <div className="fixed bottom-4 right-4">
        <AddNoteButton />
      </div>
    </div>
  );
};

export default NotesDashboardPage;
