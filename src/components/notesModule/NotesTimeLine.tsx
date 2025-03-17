import React from "react";
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

class NotesTimeline extends React.Component<NoteListProps> {
  generateTimeIntervals() {
    const intervals = [];
    const startOfDay = moment().startOf("day");

    for (let i = 0; i < 24; i++) {
      intervals.push(startOfDay.clone().add(i, "hours").valueOf());
    }

    return intervals;
  }

  render() {
    const { notes } = this.props; // Access notes from Redux store
    const timeIntervals = this.generateTimeIntervals();

    return (
      <Timeline position="right">
        {timeIntervals.map((time) => {
          const startOfHour = moment(time);

          // Filter notes for the current hour
          const notesAtThisTime = notes.filter((note) => {
            const noteTime = moment(note.time);
            return noteTime.isSame(startOfHour, "hour");
          });

          return (
            <TimelineItem
              key={time}
              className={`${notesAtThisTime.length > 0 ? "mb-10" : ""}`}
            >
              {/* Move Dot & Connector Right if Notes Exist */}
              <TimelineSeparator
                className={`pb-15 relative ${
                  notesAtThisTime.length > 0
                    ? "translate-x-10"
                    : "translate-x-0"
                }`}
              >
                <TimelineDot />
                <TimelineConnector className=" min-h-[100px]" />
              </TimelineSeparator>

              {/* Time Label (Remains Fixed) */}
              <TimelineContent>
                <h4
                  className={` ${
                    notesAtThisTime.length > 0
                      ? " mt-25 text-xl font-semibold translate-x-10"
                      : "mt-1 text-lg font-semibold"
                  }`}
                >
                  {moment(time).format("HH:mm")}
                </h4>
              </TimelineContent>

              {/* Notes Section - Doesn't affect timeline */}
              {notesAtThisTime.length > 0 && (
                <div className="absolute left-50 flex gap-4">
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
  notes: state.notes, // Connect to the notes in the Redux store
});

export default connect(mapStateToProps)(NotesTimeline);
