import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { connect } from "react-redux";
import moment from "moment";
import NoteCard from "./NotesCard";
import { NotesTimelineProps } from "../../TS_INTERFACE/gInterface";

const NotesTimeline = forwardRef<unknown, NotesTimelineProps>((props, ref) => {
  const {
    notes,
    sortOrder,
    is24Hour,
    onFilteredNotesChange,
    isNoteFormVisible,
  } = props;

  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

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

  const sortedDates = useMemo(() => {
    return Object.keys(noteMap).sort((a, b) =>
      sortOrder === "asc"
        ? moment(a).valueOf() - moment(b).valueOf()
        : moment(b).valueOf() - moment(a).valueOf()
    );
  }, [noteMap, sortOrder]);

  const sortedTimes = useMemo(() => {
    const times = new Set<string>();

    Object.values(noteMap).forEach((hourMap) => {
      Object.keys(hourMap).forEach((time) => times.add(time));
    });

    return Array.from(times).sort((a, b) =>
      moment(a, "HH:mm").diff(moment(b, "HH:mm"))
    );
  }, [noteMap]);

  useImperativeHandle(ref, () => ({
    getFilteredNotesLength: () => notes.length,
  }));

  useEffect(() => {
    onFilteredNotesChange?.(notes.length > 0);
  }, [notes.length, onFilteredNotesChange]);

  // Handle click on time slot
  const handleSlotClick = (date: any, time: any) => {
    setSelectedSlot({ date, time });
  };

  // Expanded view for selected slot
  if (selectedSlot) {
    const { date, time } = selectedSlot;
    const cellNotes = noteMap[date]?.[time] || [];

    return (
      <div className="w-full h-[calc(100vh-120px)] overflow-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-500">
            {moment(date).format("MMM DD, YYYY")}{" "}
            {moment(time, "HH:mm").format(is24Hour ? "HH:mm" : "hh:mm A")}
          </h2>
          <button
            onClick={() => setSelectedSlot(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {cellNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-auto px-4">
      <div
        className="grid gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: `180px repeat(${sortedTimes.length}, 25vw)`, // Consistent width
        }}
      >
        {/* Top Header Row */}
        {!isNoteFormVisible && (
          <div className="font-bold text-2xl bg-transparent text-[#525b28] sticky w-58 mt-20 z-10">
            Date / Time
          </div>
        )}

        {sortedTimes.map((time) => (
          <div
            key={time}
            className="text-center text-gray-500 mt-15 font-bold text-4xl cursor-pointer"
            onClick={() => handleSlotClick(sortedDates[0], time)}
          >
            {moment(time, "HH:mm").format(is24Hour ? "HH:mm" : "hh:mm A")}
          </div>
        ))}

        {/* Data Grid Rows */}
        {!isNoteFormVisible &&
          sortedDates.map((date) => (
            <React.Fragment key={date}>
              {/* Date column */}
              <div className="text-4xl font-bold text-gray-500 sticky left-0 mt-20 z-10 bg-transparent whitespace-nowrap">
                {moment(date).format("MMM DD, YYYY")}
              </div>

              {/* Time columns per date */}
              {sortedTimes.map((time) => {
                const cellNotes = noteMap[date]?.[time] || [];
                const displayNotes = cellNotes.slice(0, 4);
                const hasNotes = cellNotes.length > 0;

                return (
                  <div
                    key={`${date}-${time}`}
                    className="flex flex-row gap-2 relative cursor-pointer"
                    style={{
                      minHeight: "150px",
                    }}
                    onClick={() => handleSlotClick(date, time)}
                  >
                    {displayNotes.map((note, index) => (
                      <div
                        key={note.id}
                        className="absolute"
                        style={{
                          left: hasNotes
                            ? `${index * 10 - 40}px`
                            : `${index * 10}px`, // Shift cards left by 40px if notes exist
                          zIndex: index,
                        }}
                      >
                        <NoteCard note={note} />
                      </div>
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
