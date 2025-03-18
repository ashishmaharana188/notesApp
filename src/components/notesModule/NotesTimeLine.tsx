import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import NoteCard from "./NotesCard"; // Import your NoteCard component
import { NoteListProps } from "../../TS_INTERFACE/gInterface";
import moment from "moment";

const NotesTimeline = ({ notes }: NoteListProps) => {
  const [clickedDot, setClickedDot] = useState<number | null>(null);
  const [activeInterval, setActiveInterval] = useState<number | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  const generateTimeIntervals = () => {
    const intervals = [];
    const startOfDay = moment().startOf("day");
    for (let i = 0; i < 24; i++) {
      intervals.push(startOfDay.clone().add(i, "hours").valueOf());
    }
    return intervals;
  };

  const handleClick = (time: number) => {
    console.log(`Dot clicked at time: ${moment(time).format("HH:mm")}`);
    if (activeInterval === time) {
      // Reset everything when toggling off
      setActiveInterval(null);
      setClickedDot(null);
      setScrollOffset(0);
      setScrolling(false);
    } else {
      setActiveInterval(time);
      setClickedDot(time);
      setScrollOffset(0);
    }
  };

  const handleScroll = (event: WheelEvent) => {
    if (!activeInterval) return; // Do nothing if no active interval

    event.preventDefault(); // Prevent default vertical scroll
    setScrolling(true);

    const scrollAmount = event.deltaY > 0 ? 50 : -50; // Adjust scroll step
    setScrollOffset((prev) => prev + scrollAmount);

    // Stop scrolling smoothly
    setTimeout(() => setScrolling(false), 300);
  };

  // Add and remove event listener for scroll
  useEffect(() => {
    if (activeInterval) {
      window.addEventListener("wheel", handleScroll, { passive: false });
    }
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [activeInterval]);

  const timeIntervals = generateTimeIntervals();

  return (
    <Timeline position="right">
      {timeIntervals.map((time) => {
        const startOfHour = moment(time);
        const notesAtThisTime = notes.filter((note) =>
          moment(note.time).isSame(startOfHour, "hour")
        );

        return (
          <TimelineItem
            key={time}
            className={`${notesAtThisTime.length > 0 ? "mb-10" : ""}`}
          >
            <TimelineSeparator
              className={`pb-15 relative ${
                notesAtThisTime.length > 0 ? "translate-x-10" : "translate-x-0"
              }`}
            >
              <TimelineDot
                className={`cursor-pointer transition-transform duration-300 ${
                  clickedDot === time ? "animate-bounce" : ""
                }`}
                onClick={() => handleClick(time)}
              />
              <TimelineConnector
                className={`min-h-[100px] cursor-pointer transition-transform duration-300 ${
                  clickedDot === time ? "animate-bounce" : ""
                }`}
                onClick={() => handleClick(time)}
              />
            </TimelineSeparator>

            <TimelineContent>
              <h4
                className={`${
                  notesAtThisTime.length > 0
                    ? "mt-25 text-xl font-semibold translate-x-10"
                    : "mt-1 text-lg font-semibold"
                }`}
              >
                {moment(time).format("HH:mm")}
              </h4>
            </TimelineContent>

            {notesAtThisTime.length > 0 && (
              <div
                id={`notes-${time}`}
                className={`absolute left-50 flex gap-4 transition-transform duration-500 ease-out`}
                style={{
                  transform:
                    activeInterval === time
                      ? `translateX(${scrollOffset}px)`
                      : "translateX(0px)",
                  transition: scrolling
                    ? "transform 0.3s ease-out"
                    : "transform 0.5s ease-out",
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
