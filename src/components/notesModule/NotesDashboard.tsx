import { useState, useEffect, useRef } from "react";
import AddNoteButton from "./AddNoteButton";
import "../../styles/components/notesModule/NoteDashboard.css";
import NotesTimeline from "./NotesTimeLine";
import NotesTimelineFilter from "./NotesTimelineFilter";

const NotesDashboardPage = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [interval, setInterval] = useState<"6h" | "12h" | "24h">("12h");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM" | null>("AM");
  const [is24Hour, setIs24Hour] = useState(false);
  const [filterButton, setFilterButton] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Custom hook to track scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY); // Update scroll position
      setVisible(currentScrollY === 0); // Update visibility based on scroll position
      lastScrollY.current = currentScrollY; // Update last scroll position
    };

    window.addEventListener("scroll", handleScroll); // Add event listener

    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, []);

  // Function to reset selectedAMPM to null

  const resetSelectedAMPM = () => {
    setSelectedAMPM(null);
  };

  return (
    <div>
      {/* 📌 Dashboard Title */}
      <p
        className={`fixed top-1 left-1/2 transform -translate-x-1/2 text-4xl font-bold transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        Dashboard!
      </p>

      {/* 📌 Notes Timeline (Centered in Middle) */}
      <div className="w-full mt-20 h-full flex flex-col items-start ">
        <NotesTimeline
          interval={interval}
          sortOrder={sortOrder}
          selectedAMPM={selectedAMPM}
          is24Hour={is24Hour}
          resetSelectedAMPM={resetSelectedAMPM}
          scrollPosition={scrollPosition}
        />
      </div>

      {/* 📌 Floating Buttons (Bottom Right) */}
      <div className="fixed bottom-2 right-1 flex items-center space-x-4">
        {/* 🔘 Filter Toggle Switch */}
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-lg font-bold text-gray-700">Filters</span>
          <input
            type="checkbox"
            checked={filterButton}
            onChange={() => setFilterButton(!filterButton)}
            className="hidden"
          />
          <div className="relative w-16 h-8 bg-gray-300 rounded-full transition">
            <div
              className={`absolute top-1 bottom-1 left-1 w-5 h-6 bg-white rounded-full transition-transform ${
                filterButton ? "translate-x-9 bg-green-500" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>

        {/* ➕ Add Note Button */}
        <AddNoteButton />
      </div>

      {/* Filter Panel (Appears above the buttons) */}
      {filterButton && (
        <div className="fixed bottom-40 right-6 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
          <NotesTimelineFilter
            interval={interval}
            setInterval={setInterval}
            selectedAMPM={selectedAMPM}
            setSelectedAMPM={setSelectedAMPM}
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
