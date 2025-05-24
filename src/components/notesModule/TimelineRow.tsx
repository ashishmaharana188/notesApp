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
  index: number;
  notesAtThisTime: Note[];
  is24Hour: boolean;
};

const TimelineRow: React.FC<TimelineRowProps> = ({
  time,
  notesAtThisTime,
  is24Hour,
  index,
}) => {
  const shouldAnimate = notesAtThisTime.length > 0;
  const isLeftSide = index % 2 === 0; // Even index -> left, odd index -> right
  console.log(
    `TimelineRow - Time: ${moment(time).format(
      "hh:mm A"
    )}, Index: ${index}, isLeftSide: ${isLeftSide}`
  );

  return (
    <motion.div
      className={
        shouldAnimate
          ? `transform transition-all duration-350 mb-45 ${
              isLeftSide ? "ml-[-10px]" : "ml-10"
            }`
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
            {shouldAnimate && (
              <div
                className={
                  isLeftSide ? "translate-x-[-40px]" : "translate-x-20"
                }
              >
                <TimelineDot
                  className={`cursor-pointer !ml-0 !bg-[#525b28] z-30 transition-colors duration-200 `}
                />
              </div>
            )}

            <div className="cursor-pointer left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-lg bg-[#525b28] ">
              <button className="cursor-pointer text-[white] text-sm px-3 py-1 transition-colors duration-200 ">
                {moment(time).format(is24Hour ? "HH:mm" : "hh:mm A")}
              </button>
            </div>
          </div>
        </TimelineSeparator>
        W
        {shouldAnimate && (
          <motion.div
            className={`absolute top-0 ${
              isLeftSide ? "left-[-360px]" : "left-30"
            }`} // Adjust positioning based on side
            initial={false}
          >
            <motion.div
              className="flex gap-4"
              drag="x"
              dragConstraints={{
                left: isLeftSide ? 0 : -((notesAtThisTime.length - 1) * 180),
                right: isLeftSide ? (notesAtThisTime.length - 1) * 180 : 0,
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
