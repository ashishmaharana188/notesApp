import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import NoteCard from "./NotesCard"; // adjust path if needed
import { Note } from "../../TS_INTERFACE/gInterface"; // adjust path if needed

type TimelineRowProps = {
  time: number;
  notesAtThisTime: Note[];
  is24Hour: boolean;
  clickedDot: number | null;
  preservedIntervals: Set<number>;
  handleClick: (time: number) => void;
};

const TimelineRow: React.FC<TimelineRowProps> = ({
  time,
  notesAtThisTime,
  is24Hour,
  clickedDot,
  preservedIntervals,
  handleClick,
}) => {
  const shouldAnimate = notesAtThisTime.length > 0;

  return (
    <motion.div
      className={
        shouldAnimate
          ? "transform transition-all duration-350 mb-45 ml-10"
          : "transform transition-all duration-350 mb-20 mt-0"
      }
      initial={false}
      animate={{
        x: shouldAnimate ? 0 : 0,
        transition: { duration: 0.21 },
      }}
      layoutId={`timeline-row-${time}`}
    >
      <TimelineItem>
        <TimelineSeparator>
          <div className="absolute flex flex-row items-center justify-start">
            <div className="translate-x-20">
              <TimelineDot
                className={`cursor-pointer !ml-0 !bg-[#525b28] hover:!bg-[#6B705C] z-30 transition-colors duration-200 ${
                  clickedDot === time ? "animate-bounce" : ""
                } ${
                  preservedIntervals.has(time)
                    ? "!bg-[#525b28] shadow-lg ring-2 ring-[#525b28]"
                    : ""
                }`}
                onClick={() => handleClick(time)}
              />
            </div>

            <div className="cursor-pointer left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-lg bg-[#525b28] hover:bg-[#525b28]/80">
              <button
                className="cursor-pointer text-[white] hover:text-[white]/80 text-sm px-3 py-1 transition-colors duration-200 "
                onClick={() => handleClick(time)}
              >
                {moment(time).format(is24Hour ? "HH:mm" : "hh:mm A")}
              </button>
            </div>
          </div>
        </TimelineSeparator>
        W
        {shouldAnimate && (
          <motion.div className="absolute left-30 -top-10" initial={false}>
            <motion.div
              className="flex gap-4"
              drag="x"
              dragConstraints={{
                left: -((notesAtThisTime.length - 1) * 180),
                right: 0,
              }}
              style={{ cursor: "grab" }}
              whileTap={{ cursor: "grabbing" }}
              dragElastic={0.2}
              dragTransition={{
                bounceStiffness: 300,
                bounceDamping: 20,
              }}
            >
              <AnimatePresence mode="popLayout">
                {notesAtThisTime.map((note) => (
                  <motion.div
                    key={note.id}
                    className="touch-none select-none"
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    }}
                  >
                    <NoteCard note={note} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </TimelineItem>
    </motion.div>
  );
};

export default React.memo(TimelineRow);
