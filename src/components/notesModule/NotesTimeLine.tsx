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

const NotesTimeline = ({ notes }: NoteListProps) => {
  const [clickedDot, setClickedDot] = useState<number | null>(null);
  const [activeInterval, setActiveInterval] = useState<number | null>(null);
  const [scrollPositions, setScrollPositions] = useState<{
    [key: number]: number;
  }>({});
  const [previouslyUsedIntervals, setPreviouslyUsedIntervals] = useState<
    Set<number>
  >(new Set());

  const timelineRef = useRef<HTMLUListElement | null>(null);

  const timeIntervals = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) =>
      moment().startOf("day").add(i, "hours").valueOf()
    );
  }, []);

  const handleClick = useCallback(
    (time: number) => {
      const notesAtThisTime = notes.filter((note) =>
        moment(note.time).isSame(moment(time), "hour")
      );
      const noteCount = notesAtThisTime.length;

      setScrollPositions((prev) => {
        const previousScroll = prev[time] || 0;
        return noteCount < 10 || previousScroll < 11 * 180
          ? { ...prev, [time]: 0 }
          : prev;
      });

      if (activeInterval === time) {
        setActiveInterval(null);
        setClickedDot(null);
      } else {
        setActiveInterval(time);
        setClickedDot(time);
      }
    },
    [activeInterval, notes]
  );

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
      const updatedOffset = Math.max(maxOffset, Math.min(newOffset, 0));

      setScrollPositions((prev) => ({
        ...prev,
        [activeInterval]: updatedOffset,
      }));

      if (Math.abs(updatedOffset) / 180 >= 10) {
        setPreviouslyUsedIntervals(
          (prev) => new Set([...prev, activeInterval])
        );
      }
    },
    [activeInterval, notes, scrollPositions]
  );

  useEffect(() => {
    if (activeInterval) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    } else {
      setScrollPositions({});
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [activeInterval, handleScroll]);

  return (
    <Timeline ref={timelineRef} position="right">
      {timeIntervals.map((time) => {
        const notesAtThisTime = notes.filter((note) =>
          moment(note.time).isSame(moment(time), "hour")
        );

        return (
          <TimelineItem
            key={time}
            className={notesAtThisTime.length > 0 ? "mb-10" : ""}
          >
            <TimelineSeparator>
              <TimelineDot
                className={`cursor-pointer ${
                  clickedDot === time ? "animate-bounce" : ""
                } ${previouslyUsedIntervals.has(time) ? "bg-gray-800" : ""}`}
                onClick={() => handleClick(time)}
              />
              <TimelineConnector
                className="min-h-[100px] cursor-pointer"
                onClick={() => handleClick(time)}
              />
            </TimelineSeparator>

            <TimelineContent>
              <h4 className="mt-1 text-lg font-semibold">
                {moment(time).format("HH:mm")}
              </h4>
            </TimelineContent>

            {notesAtThisTime.length > 0 && (
              <div
                className="absolute left-50 top-10 flex gap-4 transition-transform duration-500"
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
