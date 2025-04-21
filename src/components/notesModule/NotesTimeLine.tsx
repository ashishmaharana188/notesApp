import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { connect } from "react-redux";
import Timeline from "@mui/lab/Timeline";
import { NotesTimelineProps } from "../../TS_INTERFACE/gInterface";
import moment from "moment";
import TimelineRow from "./TimelineRow";

const NotesTimeline = forwardRef<unknown, NotesTimelineProps>((props, ref) => {
  const {
    notes,
    interval,
    sortOrder,
    selectedAMPM,
    is24Hour,
    setSelectedAMPM,
    filterButton,

    onFilteredNotesChange,
  } = props;
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
  const timelineRef = useRef<HTMLUListElement | null>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHorizontalScrolling, setIsHorizontalScrolling] = useState(false);
  const [currentStartTime, setCurrentStartTime] = useState(
    moment().startOf("day")
  );
  type CachedDayData = {
    timeIntervals: number[];
    scrollPositions: Record<number, number>;
  };
  const [cachedDays, setCachedDays] = useState<Record<string, CachedDayData>>(
    {}
  );

  const timeIntervals = useMemo(() => {
    const intervalHours = interval === "6h" ? 6 : interval === "12h" ? 12 : 24;
    const intervals = new Set<number>();

    // Add regular intervals within the current window
    for (let i = 0; i < intervalHours; i++) {
      let intervalTime = moment(currentStartTime)
        .add(i, "hours")
        .startOf("hour")
        .valueOf();

      // If AM/PM filter is selected, modify intervalTime accordingly
      if (selectedAMPM === "AM") {
        // Ensure the time is within AM range (00:00 to 11:59)
        if (moment(intervalTime).hour() >= 12) {
          // Skip intervals in PM range
        }
      } else if (selectedAMPM === "PM") {
        // If PM is selected, shift AM hours to PM (12:00 PM to 23:59 PM)
        if (moment(intervalTime).hour() < 12) {
          intervalTime = moment(intervalTime).add(12, "hours").valueOf();
        }
      }

      intervals.add(intervalTime);
    }

    // Find notes within the current day AND time range
    const currentEndTime = moment(currentStartTime).add(intervalHours, "hours");

    notes.forEach((note) => {
      let noteTime = moment(note.date);

      // Only add intervals for notes within the visible time range
      if (
        noteTime.isSame(moment(currentStartTime), "day") &&
        noteTime.isSameOrAfter(currentStartTime) &&
        noteTime.isBefore(currentEndTime)
      ) {
        // Adjust noteTime based on AM/PM filter
        if (selectedAMPM === "AM" && noteTime.hour() >= 12) {
          // Skip notes in PM range if AM is selected
          return;
        } else if (selectedAMPM === "PM" && noteTime.hour() < 12) {
          noteTime = noteTime.add(12, "hours"); // Shift to PM if PM is selected
        }

        intervals.add(noteTime.startOf("hour").valueOf());
      }
    });

    // Sort intervals based on user preference
    return sortOrder === "asc"
      ? Array.from(intervals).sort((a, b) => a - b)
      : Array.from(intervals).sort((a, b) => b - a);
  }, [notes, interval, currentStartTime, sortOrder, selectedAMPM]);

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
          notes.some((note) => moment(note.date).isSame(moment(time), "hour"))
        ) || null
      );
    },
    [notes, timeIntervals]
  );

  const preventDefaultScroll = useCallback((event: WheelEvent) => {
    event.preventDefault();
  }, []);

  // Update the filteredNotes useMemo function

  const filteredNotes = useMemo(() => {
    const matchedNotes = notes.filter((note) => {
      const noteDate = moment(note.date).format("YYYY-MM-DD");
      const noteTime = moment(note.time).startOf("hour").format("HH:mm");

      const match = timeIntervals.find((interval) => {
        const intervalMoment = moment(interval); // already in ms
        const intervalDate = intervalMoment.format("YYYY-MM-DD");
        const intervalTime = intervalMoment.format("HH:mm");

        const isSameDate = intervalDate === noteDate;
        const isSameTime = intervalTime === noteTime;

        if (isSameDate && isSameTime) {
          return true;
        }

        return false;
      });

      return Boolean(match);
    });

    const sortedNotes = matchedNotes.sort((a, b) =>
      sortOrder === "asc"
        ? moment.unix(a.date).valueOf() - moment.unix(b.date).valueOf()
        : moment.unix(b.date).valueOf() - moment.unix(a.date).valueOf()
    );

    return sortedNotes;
  }, [notes, timeIntervals, sortOrder]);

  useImperativeHandle(ref, () => ({
    getFilteredNotesLength: () => filteredNotes.length,
  }));

  useEffect(() => {
    if (onFilteredNotesChange) {
      onFilteredNotesChange(filteredNotes.length > 0);
    }
  }, [filteredNotes, onFilteredNotesChange]);
  // Added `currentStartTime`
  // ADD DEBUGGING LOGS HERE

  // Then in the navigation handlers:
  const handleNextInterval = () => {
    console.log("Next button clicked!");

    const intervalHours = interval === "6h" ? 6 : interval === "12h" ? 12 : 24;
    let nextStartTime = moment(currentStartTime).add(intervalHours, "hours");

    // Cache current day's data before moving
    const currentDayKey = moment(currentStartTime).format("YYYY-MM-DD");
    setCachedDays((prev) => ({
      ...prev,
      [currentDayKey]: {
        timeIntervals: timeIntervals,
        scrollPositions: { ...scrollPositions },
      },
    }));

    // Check if we're moving to a new day
    if (nextStartTime.isAfter(moment(currentStartTime).endOf("day"))) {
      nextStartTime = moment(currentStartTime).add(1, "day").startOf("day");

      // Check if we already have cached data for this day
      const nextDayKey = nextStartTime.format("YYYY-MM-DD");
      if (cachedDays[nextDayKey]) {
        console.log("Using cached data for", nextDayKey);
        // We can't directly set timeIntervals (it's computed via useMemo)
        // Instead, set currentStartTime and let useMemo recompute with cached positions
        setCurrentStartTime(nextStartTime);
        setScrollPositions(cachedDays[nextDayKey].scrollPositions);
        setSelectedAMPM(moment(nextStartTime).hour() < 12 ? "AM" : "PM"); // Restore AM/PM
        return;
      }
    }

    // If no cache or not changing day, proceed normally
    setCurrentStartTime(nextStartTime);
    setScrollPositions({});
    setActiveInterval(null);
    setClickedDot(null);
    setSelectedAMPM(moment(nextStartTime).hour() < 12 ? "AM" : "PM"); // Restore AM/PM
  };

  const handlePreviousInterval = () => {
    console.log("Previous button clicked!");

    console.log("Current selectedAMPM after reset:", null);

    const intervalHours = interval === "6h" ? 6 : interval === "12h" ? 12 : 24;
    let prevStartTime = moment(currentStartTime).subtract(
      intervalHours,
      "hours"
    );

    // Cache current day's data before moving
    const currentDayKey = moment(currentStartTime).format("YYYY-MM-DD");
    setCachedDays((prev) => ({
      ...prev,
      [currentDayKey]: {
        timeIntervals: timeIntervals,
        scrollPositions: { ...scrollPositions },
      },
    }));

    // Check if we're moving to a previous day
    if (prevStartTime.isBefore(moment(currentStartTime).startOf("day"))) {
      // Calculate end of previous day minus interval
      prevStartTime = moment(currentStartTime)
        .subtract(1, "day")
        .startOf("day")
        .add(24 - intervalHours, "hours");

      // Check if we already have cached data for this day
      const prevDayKey = prevStartTime.format("YYYY-MM-DD");
      if (cachedDays[prevDayKey]) {
        console.log("Using cached data for", prevDayKey);
        setCurrentStartTime(prevStartTime);
        setScrollPositions(cachedDays[prevDayKey].scrollPositions);
        setSelectedAMPM(moment(prevStartTime).hour() < 12 ? "AM" : "PM"); // Restore AM/PM
        return;
      }
    }

    // If no cache or not changing day, proceed normally
    setCurrentStartTime(prevStartTime);
    setScrollPositions({});
    setActiveInterval(null);
    setClickedDot(null);
    setSelectedAMPM(moment(prevStartTime).hour() < 12 ? "AM" : "PM"); // Restore AM/PM
  };

  /**am pm useEffect */
  useEffect(() => {
    if (!filterButton || !props.userChangedAMPM?.current) return;

    const startOfDay = moment(currentStartTime).startOf("day");

    if (selectedAMPM === "AM") {
      setCurrentStartTime(startOfDay); // Same day, 00:00
    } else if (selectedAMPM === "PM") {
      setCurrentStartTime(startOfDay.clone().add(12, "hours")); // Same day, 12:00
    }

    props.userChangedAMPM.current = false; // ✅ Reset the flag
  }, [selectedAMPM]);

  /** Handles horizontal scrolling behavior */
  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (!activeInterval) return;

      event.preventDefault();
      event.stopPropagation();

      console.log(`Scrolling on interval: ${activeInterval}`);

      const notesAtThisTime = notes.filter((note) =>
        // Use note.date consistently instead of note.time
        moment(note.time).isSame(moment(activeInterval), "hour")
      );

      if (notesAtThisTime.length === 0) return;

      const maxOffset = -((notesAtThisTime.length - 1) * 180);
      const newOffset =
        (scrollPositions[activeInterval] || 0) + event.deltaY * -0.5;
      const updatedOffset = Math.max(maxOffset - 20, Math.min(newOffset, 20));

      console.log(
        `📍 Updated scroll position for ${activeInterval}: ${updatedOffset}`
      );

      setScrollPositions((prev) => ({
        ...prev,
        [activeInterval]: updatedOffset,
      }));

      if (updatedOffset <= maxOffset - 10) {
        console.log(`Fully scrolled on interval: ${activeInterval}`);

        setPreservedIntervals(new Set([...preservedIntervals, activeInterval]));

        setTimeout(() => {
          const nextInterval = findAdjacentInterval(activeInterval, "next");

          if (nextInterval) {
            console.log(`Moving to next interval: ${nextInterval}`);

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

  const handleVerticalScroll = useCallback(
    (event: any) => {
      // Skip if we're in an active interval
      if (activeInterval) return;

      // Only apply to vertical scrolling
      if (event.deltaX !== 0 || Math.abs(event.deltaY) < 5) return;

      // Prevent the default scroll
      event.preventDefault();

      // Apply gentler vertical scrolling
      window.scrollBy({
        top: event.deltaY > 0 ? 20 : -20, // Reduced intensity
        behavior: "smooth",
      });
    },
    [activeInterval]
  ); // Add activeInterval to dependencies

  const handleClick = useCallback(
    (time: number) => {
      console.log(`Click detected on time: ${time}`);

      // Check if a double-click is happening
      if (clickTimeoutRef.current) {
        console.log(`Double-click detected on time: ${time}`);

        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;

        // ✅ Double-click only works on an active interval OR preserved scroll position
        if (activeInterval === time || preservedScrollPositions.has(time)) {
          console.log(`Toggling preserved scroll position for ${time}`);

          setPreservedScrollPositions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(time)) {
              console.log(`Removing preserved scroll for ${time}`);
              setScrollPositions((prevPositions) => {
                const updatedPositions = { ...prevPositions };
                delete updatedPositions[time];
                return updatedPositions;
              });
              newSet.delete(time);
            } else {
              console.log(`Adding preserved scroll for ${time}`);
              newSet.add(time);
            }
            return newSet;
          });
        }

        return; // ✅ Exit early for double-click
      }

      console.log(`Waiting 300ms for possible double-click`);

      clickTimeoutRef.current = setTimeout(() => {
        console.log(`Single-click confirmed on time: ${time}`);

        // Single-click activates an interval if none is active
        if (activeInterval === time) {
          console.log("Deactivating interval & restoring normal scrolling");

          setIsHorizontalScrolling(false);
          setActiveInterval(null);
          setClickedDot(null);

          //  Delay enabling vertical scrolling by 10ms
          setTimeout(() => {
            console.log("Restoring default vertical scrolling");
            window.removeEventListener("wheel", preventDefaultScroll);
          }, 2);

          // Reset scroll position if not preserved
          if (!preservedScrollPositions.has(time)) {
            console.log(`Resetting scroll position for ${time}`);
            setScrollPositions((prev) => ({
              ...prev,
              [time]: 0, // Reset to first card
            }));
          }

          return;
        }

        // Delay disabling vertical scroll & enabling horizontal by 10ms
        console.log("Blocking vertical scroll & enabling horizontal scroll");
        window.addEventListener("wheel", preventDefaultScroll, {
          passive: false,
        });
        window.addEventListener("wheel", handleScroll, { passive: false });

        // ✅ Now update state AFTER listeners are set
        setIsHorizontalScrolling(true);
        setClickedDot(time);
        setActiveInterval(time);

        // Nudge scroll after browser settles
        setTimeout(() => {
          handleScroll({ deltaY: 1, preventDefault: () => {} } as WheelEvent);
        }, 0);

        setIsHorizontalScrolling(true);
        setClickedDot(time);
        setActiveInterval(time);

        clickTimeoutRef.current = null; // Clear timeout after single-click action
      }, 300); // Fast double-click detection
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
    props.onFilteredNotesChange?.(filteredNotes.length > 0);

    // Manage event listeners
    if (isHorizontalScrolling) {
      console.log("Blocking vertical scroll & enabling horizontal scroll");
      window.addEventListener("wheel", handleScroll, { passive: false });
      window.addEventListener("wheel", preventDefaultScroll, {
        passive: false,
      });
    } else {
      console.log("Restoring normal scrolling");
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("wheel", preventDefaultScroll);
    }

    window.addEventListener("wheel", handleVerticalScroll, { passive: false });

    return () => {
      console.log("Cleaning up event listeners");
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("wheel", preventDefaultScroll);
      window.removeEventListener("wheel", handleVerticalScroll);

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
    };
  }, [
    filteredNotes,
    timeIntervals,
    currentStartTime,
    isHorizontalScrolling,
    handleScroll,
    handleVerticalScroll,
    preventDefaultScroll,
    notes,
    filteredNotes,
    activeInterval,
  ]);

  return (
    <div className="mt-15">
      {filterButton && (
        <div
          className={`flex fixed bottom-90 right-0 justify-between items-center bg-black/80 p-3 bg-gray-200 rounded-lg shadow-lg mx-4 transition-all duration-300 z-50 backdrop-blur-sm bg-white/60 border-white/20 `}
        >
          <button
            onClick={handlePreviousInterval}
            className="w-25 cursor-pointer px-4 py-2 bg-[#525b28] text-white text-lg rounded-md shadow-lg hover:bg-[#625b28]/80 transition"
          >
            Previous
          </button>

          <div className="text-lg font-semibold mx-4 min-w-[150px] text-center">
            {moment(currentStartTime).format("MMMM D, YYYY")}
            <br />
            {moment(currentStartTime).format("hh:mm A")} -{" "}
            {moment(currentStartTime)
              .add(
                interval === "6h" ? 6 : interval === "12h" ? 12 : 24,
                "hours"
              )
              .format("hh:mm A")}
          </div>

          <button
            onClick={handleNextInterval}
            className="w-25 cursor-pointer px-4 py-2 bg-[#525b28] text-white text-lg rounded-md shadow-lg hover:bg-[#625b28]/80 transition"
          >
            Next
          </button>
        </div>
      )}
      <div className="mt-15">
        <Timeline ref={timelineRef} position="left" className="ml-15">
          {timeIntervals.map((time) => {
            const notesAtThisTime = useMemo(() => {
              return filteredNotes.filter((note) => {
                // Assume note.date and note.time are both in SECONDS (Unix format)
                const noteDate = moment(note.date).format("YYYY-MM-DD");
                const noteTime = moment(note.time)
                  .startOf("hour")
                  .format("HH:mm");

                const intervalDate = moment(time).format("YYYY-MM-DD");
                const intervalTime = moment(time).format("HH:mm");

                const isMatch =
                  noteDate === intervalDate && noteTime === intervalTime;

                return isMatch;
              });
            }, [filteredNotes, time]);

            return (
              <div className="flex items-center">
                <TimelineRow
                  key={time}
                  time={time}
                  notesAtThisTime={notesAtThisTime}
                  is24Hour={is24Hour}
                  clickedDot={clickedDot}
                  preservedIntervals={preservedIntervals}
                  handleClick={handleClick}
                />
              </div>
            );
          })}
        </Timeline>
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
