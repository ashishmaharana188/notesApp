import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { connect } from "react-redux";
import moment from "moment";
import NoteCard from "./NotesCard";
import { NotesTimelineProps } from "../../TS_INTERFACE/gInterface";

const NotesTimeline = forwardRef<unknown, NotesTimelineProps>((props, ref) => {
  const { notes, sortOrder, is24Hour, onFilteredNotesChange } = props;

  // Build a structured map: { date: { hour: [notes] } }
  const noteMap = useMemo(() => {
    const map: Record<string, Record<string, any[]>> = {};

    notes.forEach((note) => {
      const dateKey = moment(note.date).format("YYYY-MM-DD");
      const timeKey = moment(note.time).startOf("hour").format("HH:mm");

      if (!map[dateKey]) map[dateKey] = {};
      if (!map[dateKey][timeKey]) map[dateKey][timeKey] = [];

      map[dateKey][timeKey].push(note);
    });

    return map;
  }, [notes]);

  const allDates = useMemo(() => {
    return Object.keys(noteMap).sort((a, b) =>
      sortOrder === "asc"
        ? moment(a).valueOf() - moment(b).valueOf()
        : moment(b).valueOf() - moment(a).valueOf()
    );
  }, [noteMap, sortOrder]);

  const allTimes = useMemo(() => {
    const times = new Set<string>();
    Object.values(noteMap).forEach((hourMap) => {
      Object.keys(hourMap).forEach((time) => times.add(time));
    });

    return Array.from(times).sort((a, b) =>
      moment(a, "HH:mm").diff(moment(b, "HH:mm"))
    );
  }, [noteMap]);

  // Expose filtered note count
  useImperativeHandle(ref, () => ({
    getFilteredNotesLength: () => notes.length,
  }));

  useEffect(() => {
    onFilteredNotesChange?.(notes.length > 0);
  }, [notes.length, onFilteredNotesChange]);

  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-auto px-4">
      <div
        className="grid gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: `160px repeat(${allTimes.length}, minmax(200px, 1fr))`,
        }}
      >
        {/* Top Header Row */}
        <div className="font-bold text-lg sticky left-0 z-10 bg-white">
          Date / Time
        </div>
        {allTimes.map((time) => (
          <div key={time} className="text-center font-bold text-md">
            {moment(time, "HH:mm").format(is24Hour ? "HH:mm" : "hh:mm A")}
          </div>
        ))}

        {/* Rows by date */}
        {allDates.map((date) => (
          <React.Fragment key={date}>
            <div className="font-semibold sticky left-0 z-10 bg-white whitespace-nowrap">
              {moment(date).format("MMM DD, YYYY")}
            </div>
            {allTimes.map((time) => {
              const cellNotes = noteMap[date]?.[time] || [];
              return (
                <div key={`${date}-${time}`} className="flex flex-col gap-2">
                  {cellNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
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
