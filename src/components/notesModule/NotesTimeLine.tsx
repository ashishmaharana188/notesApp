import React from "react";
import { connect } from "react-redux";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import NoteCard from "./NotesCard"; // Import your NoteCard component
import {
  NoteListProps,
  noteTimelineState,
} from "../../TS_INTERFACE/gInterface";
import moment from "moment";

class NotesTimeline extends React.Component<NoteListProps, noteTimelineState> {
  constructor(props: NoteListProps) {
    super(props);
    this.state = {
      clickedDot: null,
      lastScrollDirection: "down",
      activeInterval: null,
    };
  }

  generateTimeIntervals() {
    const intervals = [];
    const startOfDay = moment().startOf("day");

    for (let i = 0; i < 24; i++) {
      intervals.push(startOfDay.clone().add(i, "hours").valueOf());
    }

    return intervals;
  }

  handleScroll = (event: WheelEvent) => {
    const { activeInterval, lastScrollDirection } = this.state;
    if (!activeInterval) return; // No interval selected

    const scrollDirection = event.deltaY > 0 ? "down" : "up";
    if (scrollDirection === lastScrollDirection) return; // Prevent redundant movement

    console.log(`Scrolling ${scrollDirection}`);
    this.setState({ lastScrollDirection: scrollDirection });

    // Move selected interval's notes left when scrolling down
    if (scrollDirection === "down") {
      document
        .getElementById(`notes-${activeInterval}`)
        ?.classList.add("translate-x-[-400px]");
    }

    // Move selected interval's notes back when scrolling up
    if (scrollDirection === "up") {
      document
        .getElementById(`notes-${activeInterval}`)
        ?.classList.remove("translate-x-[-400px]");
    }
  };

  handleClick = (time: any) => {
    console.log(`Dot clicked at time: ${moment(time).format("HH:mm")}`);
    this.setState({ clickedDot: time, activeInterval: time });

    // Attach scroll event listener
    window.addEventListener("wheel", this.handleScroll);
  };

  render() {
    const { clickedDot, activeInterval } = this.state;
    const { notes } = this.props; // Access notes from Redux store
    const timeIntervals = this.generateTimeIntervals();

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
                  notesAtThisTime.length > 0
                    ? "translate-x-10"
                    : "translate-x-0"
                }`}
              >
                <TimelineDot
                  className={`cursor-pointer transition-transform duration-300 ${
                    clickedDot === time ? "animate-bounce" : ""
                  }`}
                  onClick={() => this.handleClick(time)}
                />
                <TimelineConnector
                  className={`min-h-[100px] cursor-pointer transition-transform duration-300 ${
                    clickedDot === time ? "animate-bounce" : ""
                  }`}
                  onClick={() => this.handleClick(time)}
                />
              </TimelineSeparator>

              <TimelineContent>
                <h4
                  className={`${
                    notesAtThisTime.length > 0
                      ? " mt-25 text-xl font-semibold translate-x-10"
                      : "mt-1 text-lg font-semibold"
                  }`}
                >
                  {moment(time).format("HH:mm")}
                </h4>
              </TimelineContent>

              {notesAtThisTime.length > 0 && (
                <div
                  id={`notes-${time}`}
                  className={`absolute left-50 flex gap-4 transition-transform duration-500 ${
                    activeInterval === time ? "translate-x-0" : ""
                  }`}
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
  }
}

const mapStateToProps = (state: any) => ({
  notes: state.notes,
});

export default connect(mapStateToProps)(NotesTimeline);
