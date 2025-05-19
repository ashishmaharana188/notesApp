import React, {
  useState,
  useEffect,
  useRef,
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
    isNoteFormVisible,
  } = props;

  const timelineRef = useRef<HTMLUListElement | null>(null);
  const [currentStartTime, setCurrentStartTime] = useState(
    moment().startOf("day")
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

    // Check if we're moving to a new day
    if (nextStartTime.isAfter(moment(currentStartTime).endOf("day"))) {
      nextStartTime = moment(currentStartTime).add(1, "day").startOf("day");

      // Check if we already have cached data for this day
    }

    // If no cache or not changing day, proceed normally
    setCurrentStartTime(nextStartTime);
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

    // Check if we're moving to a previous day
    if (prevStartTime.isBefore(moment(currentStartTime).startOf("day"))) {
      // Calculate end of previous day minus interval
      prevStartTime = moment(currentStartTime)
        .subtract(1, "day")
        .startOf("day")
        .add(24 - intervalHours, "hours");

      // Check if we already have cached data for this day
    }

    // If no cache or not changing day, proceed normally
    setCurrentStartTime(prevStartTime);
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

  return (
    <div className="mt-15">
      {filterButton && !isNoteFormVisible && (
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
      <div className="mt-40 flex justify-center">
        <Timeline ref={timelineRef} className="-mr-150 w-full max-w-2xl">
          {timeIntervals.map((time, index) => {
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
                  index={index}
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
