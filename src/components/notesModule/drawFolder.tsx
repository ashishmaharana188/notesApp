import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import { NoteListProps, notesReducerIntf } from "../../TS_INTERFACE/gInterface";

// --- CONSTANTS ---
const TAB_WIDTH = 600;
const TAB_HEIGHT = 65;
const CARD_WIDTH = 590;
const MAX_EXTENSION = 450;
const SNAP_THRESHOLD = 150;
const NEGATIVE_MARGIN = "-35px";

// --- INTERFACES ---
interface FileCardProps {
  note: notesReducerIntf;
  zIndex: number;
  stagger: number;
}

// --- SUB-COMPONENT: FILE CARD ---
const FileCard: React.FC<FileCardProps> = ({ note, zIndex, stagger }) => {
  const controls = useAnimation();
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLockedOpen, setIsLockedOpen] = useState(false);

  const cardHeight = useTransform(y, (latestY) => Math.max(0, -latestY));
  const contentOpacity = useTransform(y, [-30, -150], [0, 1]);
  const cardScale = useTransform(y, [-30, -MAX_EXTENSION], [0.98, 1]);
  const activeZ = isDragging || isLockedOpen || y.get() < -5 ? 99999 : zIndex;

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    setIsDragging(false);
    const draggedDistance = -info.offset.y;
    const velocity = -info.velocity.y;

    if (draggedDistance > SNAP_THRESHOLD || velocity > 300) {
      setIsLockedOpen(true);
      await controls.start({
        y: -MAX_EXTENSION,
        transition: { type: "spring", stiffness: 250, damping: 25 },
      });
    } else {
      setIsLockedOpen(false);
      await controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 30 },
      });
    }
  };

  const handleTabClick = () => {
    if (isLockedOpen) {
      setIsLockedOpen(false);
      controls.start({ y: 0 });
    }
  };

  return (
    <motion.div
      className="relative flex justify-center"
      style={{
        width: "100%",
        height: TAB_HEIGHT,
        marginBottom: NEGATIVE_MARGIN,
        zIndex: activeZ,
        x: stagger,
      }}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: -MAX_EXTENSION, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="relative"
      >
        <div
          onClick={handleTabClick}
          className="relative cursor-grab active:cursor-grabbing"
          style={{ width: TAB_WIDTH, height: TAB_HEIGHT }}
        >
          <svg
            viewBox="0 0 600 65"
            className="w-full h-full drop-shadow-sm overflow-visible"
          >
            <path
              d="M0 65 L0 25 Q0 15, 10 15 L220 15 Q240 15, 250 5 L255 0 H425 Q435 0, 440 5 L445 15 Q455 15, 470 15 L590 15 Q600 15, 600 25 L600 65 Z"
              fill="#F3F4F6"
              stroke="#1F2937"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text
              x="280"
              y="14"
              className="fill-gray-900 font-sans font-bold text-xs tracking-widest"
            >
              {note.id.substring(0, 3)}
            </text>
            <text
              x="400"
              y="14"
              textAnchor="end"
              className="fill-gray-900 font-sans font-bold text-xs uppercase"
            >
              {note.title.length > 15
                ? note.title.substring(0, 12) + ".."
                : note.title}
            </text>
          </svg>
        </div>

        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 bg-[#F3F4F6] rounded-b-xl border-2 border-t-0 border-gray-900 shadow-2xl overflow-hidden flex flex-col"
          style={{
            top: TAB_HEIGHT - 2,
            width: CARD_WIDTH,
            height: cardHeight,
            scale: cardScale,
            zIndex: -1,
          }}
        >
          <motion.div
            className="p-6 w-full h-full flex flex-col items-center"
            style={{ opacity: contentOpacity }}
          >
            <div className="w-full flex justify-between items-end border-b-2 border-gray-300 pb-2 mb-6">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {note.title}
              </h2>
              <span className="text-[10px] font-mono text-gray-500">
                Note ID: {note.id}
              </span>
            </div>
            <div className="w-full h-48 bg-white rounded border-2 border-dashed border-gray-300 mb-6 flex items-center justify-center relative group overflow-hidden shrink-0">
              <span className="text-4xl opacity-10">📄</span>
            </div>
            <p className="text-gray-500 w-full text-left leading-relaxed font-mono text-[10px]">
              {note.noteSnippet ||
                "CONFIDENTIAL ARCHIVE RECORD. ACCESS LOGGED."}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-b-xl"
          style={{
            top: TAB_HEIGHT,
            width: CARD_WIDTH - 10,
            height: cardHeight,
            zIndex: -2,
            opacity: 0.2,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// --- GROUP DIVIDER ---
const GroupDivider: React.FC<{ char: string; zIndex: number }> = ({
  char,
  zIndex,
}) => {
  return (
    <div
      className="relative flex justify-center pointer-events-none"
      style={{
        width: "100%",
        height: 50,
        marginBottom: "-35px",
        zIndex: zIndex,
      }}
    >
      <svg viewBox="0 0 600 70" className="w-[600px] h-[50px] overflow-visible">
        <path
          d="M50 50 L50 20 Q50 10, 60 10 L160 10 Q170 10, 180 20 L190 50 Z"
          fill="#111827"
          stroke="#F3F4F6"
          strokeWidth="2"
        />
        <text
          x="70"
          y="35"
          fill="white"
          className="font-bold text-xl font-sans"
        >
          {char}
        </text>
        <line
          x1="0"
          y1="50"
          x2="600"
          y2="50"
          stroke="#9CA3AF"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

// --- MAIN COMPONENT ---
const FilesDraw: React.FC<NoteListProps> = ({ notes }) => {
  return (
    <div className="w-full h-full bg-stone-200 font-sans overflow-hidden">
      <div
        className="relative w-full h-full bg-[#d6d3d1] shadow-2xl border-x-4 border-[#a8a29e] flex flex-col overflow-hidden"
        style={{ zoom: "145%" }}
      >
        <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 z-10 pointer-events-none" />{" "}
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-6 py-1 shadow-lg rotate-1 border border-yellow-400 z-[99999] rounded-sm font-handwriting text-xs font-bold text-gray-800 pointer-events-none">
          Sam's Secret Files
        </div>
        <div className="flex-1 w-full overflow-y-auto hide-scrollbar relative">
          <div className="flex flex-col justify-end items-center w-full min-h-full pt-[600px] pb-30">
            {(() => {
              if (!notes || notes.length === 0) {
                return (
                  <div className="text-gray-500 font-mono text-sm mb-auto mt-20">
                    [ NO RECORDS FOUND ]
                  </div>
                );
              }

              const groupMap = new Map<string, notesReducerIntf[]>();
              [...notes]
                .sort((a, b) => a.title.localeCompare(b.title))
                .forEach((n) => {
                  const c = (n.title.charAt(0) || "#").toUpperCase();
                  if (!groupMap.has(c)) groupMap.set(c, []);
                  groupMap.get(c)!.push(n);
                });

              let z = 10;
              const els: React.ReactNode[] = [];

              Array.from(groupMap.entries()).forEach(([char, gNotes]) => {
                els.push(<GroupDivider key={char} char={char} zIndex={z} />);
                z++;

                gNotes.forEach((n, i) => {
                  const stagger = i % 2 === 0 ? -10 : 10;
                  els.push(
                    <FileCard
                      key={n.id}
                      note={n}
                      zIndex={z}
                      stagger={stagger}
                    />
                  );
                  z++;
                });

                els.push(<div key={`spacer-${char}`} className="w-full" />);
              });

              return els;
            })()}
          </div>
        </div>
        {/* Bottom Gradient Overlay (Inside the frame) */}
        <div className="absolute bottom-0 left-0 right-0 h-40 from-[#d6d3d1] pointer-events-none z-50" />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({ notes: state.notes ?? [] });
export default connect(mapStateToProps)(FilesDraw);
