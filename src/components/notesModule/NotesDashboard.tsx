import { useState, useEffect, useRef } from "react";
import AddNoteButton from "./AddNoteButton";
import "../../styles/components/notesModule/NoteDashboard.css";
import NotesTimeline from "./NotesTimeLine";
import NotesTimelineFilter from "./NotesTimelineFilter";
import { NotesTimelineRef } from "../../TS_INTERFACE/gInterface";
import { motion, AnimatePresence } from "framer-motion";

const NotesDashboardPage = () => {
  const timelineRef = useRef<NotesTimelineRef>(null);
  const [visible, setVisible] = useState<boolean | undefined>(true);
  const lastScrollY = useRef(0);
  const [interval, setInterval] = useState<"6h" | "12h" | "24h">("12h");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM" | null>("AM");
  const [is24Hour, setIs24Hour] = useState(false);
  const [filterButton, setFilterButton] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const userChangedAMPM = useRef(false);

  // Custom hook to track scroll position
  const handleFilteredNotesChange = (hasNotes: boolean) => {
    setVisible(window.scrollY === 0 && !hasNotes);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);
      const isScrollingUp =
        currentScrollY < lastScrollY.current
          ? lastScrollY.current
          : currentScrollY;

      const hasNotes = timelineRef.current?.getFilteredNotesLength
        ? timelineRef.current.getFilteredNotesLength() > 0
        : false;
      setVisible(!isScrollingUp && !hasNotes);

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll); // Add event listener

    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, []);

  // Function to reset selectedAMPM to null

  return (
    <div>
      {/* 📌 Dashboard Title */}
      <AnimatePresence>
        {visible && (
          <motion.p
            key="note-dashboard"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 40, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }} // 👈 moves up and fades out
            transition={{ duration: 0.11, ease: "easeInOut" }}
            className="fixed top-1 left-1/13 transform -translate-x-1/2 text-4xl font-bold transition-transform duration-150"
          >
            Note Dashboard!
          </motion.p>
        )}
      </AnimatePresence>

      {/* 📌 Notes Timeline (Centered in Middle) */}
      <div className="w-full mt-10 h-full flex flex-col items-start timeline-scroll-container">
        <NotesTimeline
          ref={timelineRef}
          filterButton={filterButton}
          interval={interval}
          setSelectedAMPM={setSelectedAMPM}
          sortOrder={sortOrder}
          selectedAMPM={selectedAMPM}
          is24Hour={is24Hour}
          scrollPosition={scrollPosition}
          onFilteredNotesChange={handleFilteredNotesChange}
          userChangedAMPM={userChangedAMPM}
        />
      </div>

      {/* 📌 Floating Buttons (Bottom Right) */}
      <div className="fixed bottom-5 right-1 flex items-center space-x-4">
        {/* 🔘 Filter Toggle Switch */}
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-xl font-bold text-black-700">Filters</span>
          <input
            type="checkbox"
            checked={filterButton}
            onChange={() => setFilterButton(!filterButton)}
            className="hidden"
          />
          <div className={"relative w-16 h-8 rounded-full transition"}>
            <div
              className={`absolute top-1 bottom-1 left-1 w-5 h-6 bg-black rounded-full transition-transform ${
                filterButton
                  ? "translate-x-9 bg-black-800"
                  : "translate-x-0 bg-black-800"
              }`}
            ></div>
          </div>
        </label>

        {/* ➕ Add Note Button */}
        <AddNoteButton />
      </div>

      {/* Filter Panel (Appears above the buttons) */}
      {filterButton && (
        <div className="fixed bottom-40 right-6 bg-white p-6 shadow-lg rounded-lg border border-gray-200 text-center w-190">
          <NotesTimelineFilter
            interval={interval}
            setInterval={setInterval}
            selectedAMPM={selectedAMPM}
            setSelectedAMPM={(val) => {
              userChangedAMPM.current = true; // ✅ inform NotesTimeline
              setSelectedAMPM(val); // original state update
            }}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            is24Hour={is24Hour}
            setIs24Hour={setIs24Hour}
          />
        </div>
      )}
    </div>
  );
};

export default NotesDashboardPage;
