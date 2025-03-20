import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { connect } from "react-redux";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import NoteCard from "./NotesCard";
import { NoteListProps } from "../../TS_INTERFACE/gInterface";
import moment from "moment";
import TimelineFilter from "./NotesTimelineFilter";

const NotesTimeline = ({ notes }: NoteListProps) => {
  //TimeLine FIlter State
  const [interval, setInterval] = useState<"6h" | "12h" | "24h">("12h");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");

  const [clickedDot, setClickedDot] = useState<number | null>(null);
  const [activeInterval, setActiveInterval] = useState<number | null>(null);
  const [scrollPositions, setScrollPositions] = useState<{
    [key: number]: number;
  }>({});
  const [preservedIntervals, setPreservedIntervals] = useState<Set<number>>(
    new Set()
  );
  const [isElastic, setIsElastic] = useState(false);
  const timelineRef = useRef<HTMLUListElement | null>(null);

  const timeIntervals = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) =>
      moment().startOf("day").add(i, "hours").valueOf()
    );
  }, []);

  /** Finds the next or previous valid interval */
  const findAdjacentInterval = useCallback(
    (current: number, direction: "next" | "prev"): number | null => {
      const index = timeIntervals.indexOf(current);
      if (index === -1) return null;
      const range =
        direction === "next"
          ? timeIntervals.slice(index + 1)
          : timeIntervals.slice(0, index).reverse();
      return (
        range.find((time) =>
          notes.some((note) => moment(note.time).isSame(moment(time), "hour"))
        ) || null
      );
    },
    [notes, timeIntervals]
  );

  /** Handles clicking on a time interval */
  const handleClick = useCallback(
    (time: number) => {
      if (activeInterval === time) {
        setActiveInterval(null);
        setClickedDot(null);
        setScrollPositions((prev) => {
          const newPositions: { [key: number]: number } = {};
          Object.keys(prev).forEach((key) => {
            const timeKey = parseInt(key, 10);
            if (preservedIntervals.has(timeKey)) {
              newPositions[timeKey] = prev[timeKey];
            }
          });
          return newPositions;
        });
      } else {
        setActiveInterval(time);
        setClickedDot(time);
      }
    },
    [activeInterval, preservedIntervals]
  );

  /** Handles scrolling behavior */
  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (!activeInterval) return;
      event.preventDefault();

      const notesAtThisTime = notes.filter((note) =>
        moment(note.time).isSame(moment(activeInterval), "hour")
      );
      if (notesAtThisTime.length === 0) return;

      const maxOffset = -((notesAtThisTime.length - 1) * 180);
      const newOffset =
        (scrollPositions[activeInterval] || 0) + (event.deltaY > 0 ? -50 : 50);
      const updatedOffset = Math.max(maxOffset - 20, Math.min(newOffset, 20));

      setScrollPositions((prev) => ({
        ...prev,
        [activeInterval]: updatedOffset,
      }));

      if (updatedOffset <= maxOffset - 10) {
        setPreservedIntervals((prev) => new Set([...prev, activeInterval]));
        setIsElastic(true);
        setTimeout(() => {
          setIsElastic(false);
          const nextInterval = findAdjacentInterval(activeInterval, "next");
          if (nextInterval) {
            setActiveInterval(nextInterval);
            setClickedDot(nextInterval);
          }
        }, 300);
      } else if (updatedOffset >= 10) {
        if (preservedIntervals.has(activeInterval)) {
          setIsElastic(true);
          setTimeout(() => {
            setIsElastic(false);
            const prevInterval = findAdjacentInterval(activeInterval, "prev");
            if (prevInterval) {
              setActiveInterval(prevInterval);
              setClickedDot(prevInterval);
            }
          }, 300);
        }
      }
    },
    [
      activeInterval,
      notes,
      scrollPositions,
      findAdjacentInterval,
      preservedIntervals,
    ]
  );

  useEffect(() => {
    if (activeInterval) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    } else {
      setScrollPositions((prev) => {
        const newPositions: { [key: number]: number } = {};
        let hasChanges = false;
        Object.keys(prev).forEach((key) => {
          const timeKey = parseInt(key, 10);
          if (preservedIntervals.has(timeKey)) {
            newPositions[timeKey] = prev[timeKey];
          }
        });

        if (Object.keys(newPositions).length !== Object.keys(prev).length) {
          hasChanges = true;
        }

        return hasChanges ? newPositions : prev;
      });
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [activeInterval, handleScroll, preservedIntervals]);

  return (
    <Timeline ref={timelineRef} position="right">
      {timeIntervals.map((time) => {
        const notesAtThisTime = notes.filter((note) =>
          moment(note.time).isSame(moment(time), "hour")
        );

        return (
          <TimelineItem
            key={time}
            className={notesAtThisTime.length > 0 ? "mb-10 mt-10" : ""}
          >
            <TimelineSeparator>
              {/* Timeline Dot with Floating Holder */}
              <div className="relative flex flex-col items-center">
                <TimelineDot
                  className={`cursor-pointer ${
                    clickedDot === time ? "animate-bounce" : ""
                  } ${
                    preservedIntervals.has(time) ? "bg-gray-800 shadow-lg" : ""
                  }`}
                  onClick={() => handleClick(time)}
                />
                <TimelineConnector
                  className="min-h-[100px] cursor-pointer"
                  onClick={() => handleClick(time)}
                />
                {/* Floating Button Holder */}
                <div className="absolute left-[-14px] top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-lg shadow-lg z-10">
                  <button
                    className="text-white text-sm px-3 py-1"
                    onClick={() => handleClick(time)}
                  >
                    {moment(time).format("HH:mm")}
                  </button>
                </div>
              </div>
            </TimelineSeparator>

            {/* Time Label */}
            <TimelineContent>
              <h4 className="mt-1 text-lg font-semibold">
                {moment(time).format("HH:mm")}
              </h4>
            </TimelineContent>

            {/* Notes Section */}
            {notesAtThisTime.length > 0 && (
              <div
                className={`absolute left-50 -top-5 flex gap-4 transition-transform ${
                  isElastic ? "duration-200 ease-out" : "duration-500 ease-out"
                }`}
                style={{
                  transform: `translateX(${scrollPositions[time] || 0}px)`,
                }}
              >
                {notesAtThisTime.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

const mapStateToProps = (state: any) => ({
  notes: state.notes,
});

export default connect(mapStateToProps)(React.memo(NotesTimeline));
