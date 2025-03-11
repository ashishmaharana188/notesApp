import { useState, useEffect, useRef } from "react";
import AddNoteButton from "./AddNoteButton";
import "../../styles/components/notesModule/NoteDashboard.css";

import NoteCardPlot from "./NotesCardPlot";
const NotesDashboardPage = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <p
        className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] font-bold transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        Dashboard!
      </p>
      <div>
        <NoteCardPlot />
      </div>
      <div>
        <AddNoteButton />
      </div>
    </div>
  );
};
export default NotesDashboardPage;
