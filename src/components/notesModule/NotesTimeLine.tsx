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
  const [preservedIntervals, setPreservedIntervals] = useState<Set<number>>(
    new Set()
  );
  const [isElastic, setIsElastic] = useState(false);
  const timelineRef = useRef<HTMLUListElement | null>(null);

  // Filtered notes based on selected AM/PM and sorting order
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

  // Generate timeline intervals based on selected interval setting
  const timeIntervals = useMemo(() => {
    let intervals = [];

    if (interval === "6h") {
      // If "6h" is selected, generate 6 one-hour slots
      const startHour = selectedAMPM === "AM" ? 0 : 12;
      for (let i = startHour; i < startHour + 6; i++) {
        intervals.push(moment().startOf("day").add(i, "hours").valueOf());
      }
    } else if (interval === "12h") {
      // If "12h" is selected, generate 12 one-hour slots
      const startHour = selectedAMPM === "AM" ? 0 : 12;
      for (let i = startHour; i < startHour + 12; i++) {
        intervals.push(moment().startOf("day").add(i, "hours").valueOf());
      }
    } else {
      // If "24h" is selected, generate 24 one-hour slots
      for (let i = 0; i < 24; i++) {
        intervals.push(moment().startOf("day").add(i, "hours").valueOf());
      }
    }

    return intervals;
  }, [interval, selectedAMPM]);

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
              className={notesAtThisTime.length > 0 ? "mb-10 mt-10" : ""}
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
                    onClick={() => setClickedDot(time)}
                  />
                  <TimelineConnector
                    className="min-h-[100px] cursor-pointer"
                    onClick={() => setClickedDot(time)}
                  />
                  <div className="absolute left-[-14px] top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-lg shadow-lg z-10">
                    <button
                      className="text-white text-sm px-3 py-1"
                      onClick={() => setClickedDot(time)}
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
                  className={`absolute left-50 -top-5 flex gap-4 transition-transform ${
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
