import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
} from "react";
import { connect } from "react-redux";
import moment from "moment";
import { motion } from "framer-motion";
import NoteCard from "./NotesCard";
import { NotesTimelineProps } from "../../TS_INTERFACE/gInterface";

const NotesTimeline = forwardRef<unknown, NotesTimelineProps>((props, ref) => {
  const {
    notes,
    sortOrder,
    is24Hour,
    onFilteredNotesChange,
    isNoteFormVisible,
  } = props;

  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isVerticalScrollBlocked, setIsVerticalScrollBlocked] = useState(false);

  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const inertiaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const noteMap = useMemo(() => {
    const map: Record<string, Record<string, any[]>> = {};
    notes.forEach((note) => {
      const dateKey = moment(note.date).format("YYYY-MM-DD");
      const timeKey = moment(note.time).startOf("hour").format("HH:mm");
      if (!map[dateKey]) map[dateKey] = {};
      if (!map[dateKey][timeKey]) map[dateKey][timeKey] = [];
      map[dateKey][timeKey].push(note);
    });
    return map;
  }, [notes]);

  const sortedDates = useMemo(() => {
    return Object.keys(noteMap).sort((a, b) =>
      sortOrder === "asc"
        ? moment(a).valueOf() - moment(b).valueOf()
        : moment(b).valueOf() - moment(a).valueOf()
    );
  }, [noteMap, sortOrder]);

  const sortedTimes = useMemo(() => {
    const times = new Set<string>();
    Object.values(noteMap).forEach((hourMap) => {
      Object.keys(hourMap).forEach((time) => times.add(time));
    });
    return Array.from(times).sort((a, b) =>
      moment(a, "HH:mm").diff(moment(b, "HH:mm"))
    );
  }, [noteMap]);

  useImperativeHandle(ref, () => ({
    getFilteredNotesLength: () => notes.length,
  }));

  useEffect(() => {
    onFilteredNotesChange?.(notes.length > 0);
  }, [notes.length, onFilteredNotesChange]);

  const handleSlotClick = (date: any, time: any) => {
    setSelectedSlot({ date, time });
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>, date: string) => {
    if (!isHovering) return;

    if (!isVerticalScrollBlocked) {
      e.preventDefault();
      setIsVerticalScrollBlocked(true);
    }

    const row = rowRefs.current.get(date);
    if (!row) return;

    const delta = e.deltaY;
    const scrollSpeed = Math.abs(delta) < 50 ? delta * 0.5 : delta * 1;
    setScrollVelocity(scrollSpeed);

    row.scrollLeft -= scrollSpeed; // Rely on native scrolling

    if (inertiaTimeoutRef.current) clearTimeout(inertiaTimeoutRef.current);

    inertiaTimeoutRef.current = setTimeout(() => {
      setScrollVelocity(0);
      setIsVerticalScrollBlocked(false);
    }, 100);
  };

  const handleHoverStart = () => {
    setIsHovering(true);
  };

  const handleHoverEnd = () => {
    setIsHovering(false);
    if (scrollVelocity === 0) {
      setIsVerticalScrollBlocked(false);
    }
  };

  if (selectedSlot) {
    const { date, time } = selectedSlot;
    const cellNotes = noteMap[date]?.[time] || [];

    return (
      <div className="w-full h-[calc(100vh-150px)] overflow-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-500">
            {moment(date).format("MMM DD, YYYY")}{" "}
            {moment(time, "HH:mm").format(is24Hour ? "HH:mm" : "hh:mm A")}
          </h2>
          <button
            onClick={() => setSelectedSlot(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {cellNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-auto px-4">
      <div
        className="grid gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: `180px repeat(${sortedTimes.length}, 25vw)`,
        }}
      >
        {!isNoteFormVisible && (
          <div className="font-bold text-2xl bg-transparent text-[#525b28] sticky w-58 mt-20 z-10">
            Date / Time
          </div>
        )}

        {sortedTimes.map((time) => (
          <div
            key={time}
            className="text-center text-gray-500 mt-15 font-bold mr-25 text-4xl cursor-pointer"
            onClick={() => handleSlotClick(sortedDates[0], time)}
          >
            {moment(time, "HH:mm").format(is24Hour ? "HH:mm" : "hh:mm A")}
          </div>
        ))}

        {!isNoteFormVisible &&
          sortedDates.map((date) => (
            <React.Fragment key={date}>
              <div className="text-4xl font-bold text-gray-500 sticky left-0 mt-20 z-10 bg-transparent whitespace-nowrap">
                {moment(date).format("MMM DD, YYYY")}
              </div>

              {sortedTimes.map((time) => {
                const cellNotes = noteMap[date]?.[time] || [];
                const hasNotes = cellNotes.length > 1;

                return (
                  <div
                    key={`${date}-${time}`}
                    className="flex flex-row gap-2 cursor-pointer overflow-x-auto"
                    style={{
                      minHeight: "150px",
                      transform: hasNotes ? "translateX(-20px)" : "none",
                    }}
                    ref={(el) => {
                      if (el) rowRefs.current.set(date, el);
                    }}
                    onClick={() => handleSlotClick(date, time)}
                  >
                    <motion.div
                      className="flex flex-row gap-2"
                      onWheel={(e) => handleScroll(e, date)}
                      onHoverStart={handleHoverStart}
                      onHoverEnd={handleHoverEnd}
                    >
                      {cellNotes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          style={{ zIndex: index }}
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.3 },
                          }}
                        >
                          <NoteCard note={note} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
});

const mapStateToProps = (state: any) => ({
  notes: state.notes,
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  React.memo(NotesTimeline)
);
