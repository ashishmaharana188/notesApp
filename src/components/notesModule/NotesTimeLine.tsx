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
            <TimelineItem key={time}>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div>
                  <h4>{moment(time).format("HH:mm")}</h4>
                  {notesAtThisTime.length > 0 ? (
                    notesAtThisTime.map((note) => (
                      <NoteCard key={note.id} note={note} /> // Render NoteCard for each matching note
                    ))
                  ) : (
                    <p>No notes at this time</p>
                  )}
                </div>
              </TimelineContent>
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
