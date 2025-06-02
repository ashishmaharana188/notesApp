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
import { motion } from "framer-motion";
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
      const noteTime = moment(note.time);
      const dateKey = moment(note.date).format("YYYY-MM-DD");
      const timeKey =
        noteTime.minutes() >= 0 && noteTime.minutes() <= 59
          ? noteTime.startOf("hour").format("HH:mm")
          : noteTime.subtract(1, "hour").startOf("hour").format("HH:mm");

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

  const handleSlotClick = (date: any, time: any) => {
    setSelectedSlot({ date, time });
  };

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
        <div className="flex flex-wrap gap-4">
          {cellNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-120px)] overflow-auto px-4">
      <div className="flex flex-col gap-4">
        {!isNoteFormVisible && (
          <div className="flex flex-row items-start"></div>
        )}

        <div className="flex flex-row flex-1 gap-2"></div>
        {sortedDates.map((date) => (
          <div key={date} className="flex flex-row items-start">
            <div className="text-2xl font-bold text-white mt-20 w-48 sticky left-0 z-10  whitespace-nowrap">
              {moment(date).format("MMM DD, YYYY")}
            </div>
            <div className="flex flex-row flex-1 gap-2">
              {sortedTimes.map((time) => {
                const cellNotes = noteMap[date]?.[time] || [];
                const hasNotes = cellNotes.length > 1;

                const sortedCellNotes = [...cellNotes].sort((a, b) =>
                  moment(a.time).diff(moment(b.time))
                );

                return (
                  <div
                    key={`${date}-${time}`}
                    className="flex flex-col ml-10 mr-30 relative cursor-pointer mt-20 w-[20vw] min-w-[150px]"
                    style={{ minHeight: "150px" }}
                    onClick={() => handleSlotClick(date, time)}
                  >
                    <div
                      key={time}
                      className="text-center text-gray-500 font-bold text-2xl -mt-15 cursor-pointer w-[20vw] min-w-[150px]"
                      onClick={() => handleSlotClick(sortedDates[0], time)}
                    >
                      {moment(time, "HH:mm").format(
                        is24Hour ? "HH:mm" : "hh:mm A"
                      )}
                    </div>

                    {sortedCellNotes.slice(0, 4).map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.05,
                        }}
                        style={{
                          position: "absolute",
                          left: hasNotes
                            ? `${index * 10 - 20}px`
                            : `${index * 5}px`,
                          zIndex: index,
                        }}
                      >
                        <NoteCard note={note} />
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
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
