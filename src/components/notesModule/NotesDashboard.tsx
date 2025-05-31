import { useState, useEffect, useRef } from "react";
import AddNoteButton from "./AddNoteButton";
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
  const [isNoteFormVisible, setIsNoteFormVisible] = useState(false);
  const userChangedAMPM = useRef(false);

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
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full h-full bg-grey">
      <AnimatePresence>
        {visible && (
          <motion.p
            key="note-dashboard"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 36, opacity: 1 }}
            exit={{ y: -36, opacity: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="fixed top-1 left-1/2 transform -translate-x-1/2 z-50 text-4xl font-bold text-[#525b28] whitespace-nowrap"
          >
            Note Dashboard!
          </motion.p>
        )}
      </AnimatePresence>

      <div className="w-full h-full items-start timeline-scroll-container">
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
          isNoteFormVisible={isNoteFormVisible}
        />
      </div>

      <div className="fixed bottom-5 right-1 flex items-center space-x-4">
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-xl font-bold text-white">Filters</span>
          <input
            type="checkbox"
            checked={filterButton}
            onChange={() => setFilterButton(!filterButton)}
            className="hidden"
            disabled={isNoteFormVisible}
          />
          <div className={"relative w-16 h-8 rounded-full transition"}>
            <div
              className={`absolute top-1 bottom-1 left-1 w-5 h-6 bg-[#525b28] rounded-full transition-transform ${
                filterButton
                  ? "translate-x-9 bg-[#525b28]"
                  : "translate-x-0 bg-[#525b28]"
              }`}
            ></div>
          </div>
        </label>

        <AddNoteButton onFormVisibilityChange={setIsNoteFormVisible} />
      </div>

      {filterButton && !isNoteFormVisible && (
        <div className="fixed bottom-40 right-6 bg-white p-6 shadow-lg rounded-lg border border-gray-200 text-center w-190">
          <NotesTimelineFilter
            interval={interval}
            setInterval={setInterval}
            selectedAMPM={selectedAMPM}
            setSelectedAMPM={(val) => {
              userChangedAMPM.current = true;
              setSelectedAMPM(val);
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
