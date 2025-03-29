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
import NotesTimelineFilter from "./NotesTimelineFilter";

const NotesTimeline = ({ notes }: NoteListProps) => {
  const [interval, setInterval] = useState<"6h" | "12h" | "24h">("12h");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");
  const [is24Hour, setIs24Hour] = useState(false);

  const [clickedDot, setClickedDot] = useState<number | null>(null);
  const [scrollPositions, setScrollPositions] = useState<{
    [key: number]: number;
  }>({});
  const [preservedScrollPositions, setPreservedScrollPositions] = useState<
    Set<number>
  >(new Set());
  const [activeInterval, setActiveInterval] = useState<number | null>(null);
  const [preservedIntervals, setPreservedIntervals] = useState<Set<number>>(
    new Set()
  );
  const [isElastic, setIsElastic] = useState(false);
  const timelineRef = useRef<HTMLUListElement | null>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHorizontalScrolling, setIsHorizontalScrolling] = useState(false);

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (!is24Hour) {
      filtered = filtered.filter(
        (note) => moment(note.time).format("A") === selectedAMPM
      );
    }

    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? moment(a.time).valueOf() - moment(b.time).valueOf()
        : moment(b.time).valueOf() - moment(a.time).valueOf()
    );
  }, [notes, sortOrder, selectedAMPM, is24Hour]);

  const timeIntervals = useMemo(() => {
    let intervals = [];
    const startHour = selectedAMPM === "AM" ? 0 : 12;

    if (interval === "6h") {
      for (let i = startHour; i < startHour + 6; i++) {
        intervals.push(moment().startOf("day").add(i, "hours").valueOf());
      }
    } else if (interval === "12h") {
      for (let i = startHour; i < startHour + 12; i++) {
        intervals.push(moment().startOf("day").add(i, "hours").valueOf());
      }
    } else {
      for (let i = 0; i < 24; i++) {
        intervals.push(moment().startOf("day").add(i, "hours").valueOf());
      }
    }

    return sortOrder === "asc"
      ? intervals.sort((a, b) => a - b)
      : intervals.sort((a, b) => b - a);
  }, [interval, selectedAMPM, sortOrder]);

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

  const preventDefaultScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
  }, []);

  /** Handles horizontal scrolling behavior */
  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (!activeInterval) return;

      event.preventDefault();
      event.stopPropagation();

      console.log(`🌀 Scrolling on interval: ${activeInterval}`);

      const notesAtThisTime = notes.filter((note) =>
        moment(note.time).isSame(moment(activeInterval), "hour")
      );

      if (notesAtThisTime.length === 0) return;

      const maxOffset = -((notesAtThisTime.length - 1) * 180);
      const newOffset =
        (scrollPositions[activeInterval] || 0) + (event.deltaY > 0 ? -50 : 50);
      const updatedOffset = Math.max(maxOffset - 20, Math.min(newOffset, 20));

      console.log(
        `📍 Updated scroll position for ${activeInterval}: ${updatedOffset}`
      );

      setScrollPositions((prev) => ({
        ...prev,
        [activeInterval]: updatedOffset,
      }));

      if (updatedOffset <= maxOffset - 10) {
        console.log(`✅ Fully scrolled on interval: ${activeInterval}`);

        setPreservedIntervals(new Set([...preservedIntervals, activeInterval]));
        setIsElastic(true);

        setTimeout(() => {
          setIsElastic(false);
          const nextInterval = findAdjacentInterval(activeInterval, "next");

          if (nextInterval) {
            console.log(`➡️ Moving to next interval: ${nextInterval}`);

            setActiveInterval(nextInterval);
            setClickedDot(nextInterval);
          }
        }, 200);
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

  const handleClick = useCallback(
    (time: number) => {
      console.log(`🖱 Click detected on time: ${time}`);

      // Check if a double-click is happening
      if (clickTimeoutRef.current) {
        console.log(`🟢 Double-click detected on time: ${time}`);

        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;

        // ✅ Double-click only works on an active interval OR preserved scroll position
        if (activeInterval === time || preservedScrollPositions.has(time)) {
          console.log(`🔄 Toggling preserved scroll position for ${time}`);

          setPreservedScrollPositions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(time)) {
              console.log(`❌ Removing preserved scroll for ${time}`);
              setScrollPositions((prevPositions) => {
                const updatedPositions = { ...prevPositions };
                delete updatedPositions[time];
                return updatedPositions;
              });
              newSet.delete(time);
            } else {
              console.log(`📌 Adding preserved scroll for ${time}`);
              newSet.add(time);
            }
            return newSet;
          });
        }

        return; // ✅ Exit early for double-click
      }

      console.log(`⏳ Waiting 300ms for possible double-click`);

      clickTimeoutRef.current = setTimeout(() => {
        console.log(`✅ Single-click confirmed on time: ${time}`);

        // Single-click activates an interval if none is active
        if (activeInterval === time) {
          console.log("🔄 Deactivating interval & restoring normal scrolling");

          setIsHorizontalScrolling(false);
          setActiveInterval(null);
          setClickedDot(null);

          // ✅ Delay enabling vertical scrolling by 10ms
          setTimeout(() => {
            console.log("🛑 Restoring default vertical scrolling");
            window.removeEventListener("wheel", preventDefaultScroll);
          }, 10);

          // ✅ Reset scroll position if not preserved
          if (!preservedScrollPositions.has(time)) {
            console.log(`🔄 Resetting scroll position for ${time}`);
            setScrollPositions((prev) => ({
              ...prev,
              [time]: 0, // Reset to first card
            }));
          }

          return;
        }

        // ✅ Delay disabling vertical scroll & enabling horizontal by 10ms
        setTimeout(() => {
          console.log("🛑 Instantly blocking vertical scrolling");
          window.addEventListener("wheel", preventDefaultScroll, {
            passive: false,
          });

          console.log("➡️ Instantly enabling horizontal scrolling");
          window.addEventListener("wheel", handleScroll, { passive: false });

          // ✅ **Trigger horizontal scroll immediately**
          handleScroll({ deltaY: 1, preventDefault: () => {} } as WheelEvent);
        }, 10);

        setIsHorizontalScrolling(true);
        setClickedDot(time);
        setActiveInterval(time);

        clickTimeoutRef.current = null; // Clear timeout after single-click action
      }, 300); // ✅ Fast double-click detection
    },
    [
      activeInterval,
      preventDefaultScroll,
      preservedScrollPositions,
      handleScroll,
    ]
  );

  /** Manage event listeners */
  useEffect(() => {
    if (isHorizontalScrolling) {
      console.log("🛑 Blocking vertical scroll & enabling horizontal scroll");
      window.addEventListener("wheel", handleScroll, { passive: false });
      window.addEventListener("wheel", preventDefaultScroll, {
        passive: false,
      });
    } else {
      console.log("✅ Restoring normal scrolling");
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("wheel", preventDefaultScroll);
    }

    return () => {
      console.log("♻ Cleaning up event listeners");
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("wheel", preventDefaultScroll);

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
    };
  }, [
    isHorizontalScrolling,
    handleScroll,
    preventDefaultScroll,
    preservedScrollPositions,
  ]);

  return (
    <div>
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
      <Timeline ref={timelineRef} position="right">
        {timeIntervals.map((time) => {
          const notesAtThisTime = filteredNotes.filter((note) =>
            moment(note.time).isSame(moment(time), "hour")
          );

          return (
            <TimelineItem
              key={time}
              className={
                notesAtThisTime.length > 0 ? "mb-10 mt-10 -ml-80" : "-ml-100"
              }
            >
              <TimelineSeparator>
                <div className="relative flex flex-col items-center">
                  <TimelineDot
                    className={`cursor-pointer ${
                      clickedDot === time ? "animate-bounce" : ""
                    } ${
                      preservedIntervals.has(time)
                        ? "bg-gray-800 shadow-lg"
                        : ""
                    }`}
                    onClick={() => handleClick(time)}
                  />
                  <TimelineConnector
                    className="min-h-[100px] cursor-pointer"
                    onClick={() => handleClick(time)}
                  />
                  <div className="absolute left-[-14px] top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-lg shadow-lg z-10">
                    <button
                      className="text-white text-sm px-3 py-1"
                      onClick={() => handleClick(time)}
                    >
                      {moment(time).format(is24Hour ? "HH:mm" : "hh:mm A")}
                    </button>
                  </div>
                </div>
              </TimelineSeparator>

              <TimelineContent>
                <h4 className="mt-1 text-lg font-semibold">
                  {moment(time).format(is24Hour ? "HH:mm" : "hh:mm A")}
                </h4>
              </TimelineContent>

              {notesAtThisTime.length > 0 && (
                <div
                  className={`absolute left-150 -top-5 flex gap-4 transition-transform ${
                    isElastic
                      ? "duration-200 ease-out"
                      : "duration-500 ease-out"
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
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  notes: state.notes,
});

export default connect(mapStateToProps)(React.memo(NotesTimeline));
