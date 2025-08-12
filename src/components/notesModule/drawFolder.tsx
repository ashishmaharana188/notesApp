import { Component } from "react";
import { connect } from "react-redux";
import { motion, PanInfo } from "framer-motion";
import { NoteListProps, notesReducerIntf } from "../../TS_INTERFACE/gInterface";

// Define FilesDrawState interface if not already in gInterface
interface FilesDrawState {
  selectedNoteId: string | null;
  dragY: Record<string, number>;
  finalHeight: Record<string, number>;
  topOffsetY: Record<string, number>;
  initialTopOffsetY: Record<string, number>;
  dragOffsetY: Record<string, number>;
  lockedDragY: Record<string, number>;
  svgTop: Record<string, number>;
}

class FilesDraw extends Component<NoteListProps, FilesDrawState> {
  state: FilesDrawState = {
    selectedNoteId: null,
    dragY: {},
    finalHeight: {},
    topOffsetY: {},
    initialTopOffsetY: {},
    dragOffsetY: {},
    lockedDragY: {},
    svgTop: {},
  };

  heightLockRef = new Map<string, boolean>();
  heightSnapshotRef = new Map<string, number>();
  heightSnapshotRef250 = new Map<string, number>();

  handleDragStart = (note: notesReducerIntf) => {
    this.setState({ selectedNoteId: note.id });
  };

  handleDrag = (note: notesReducerIntf, info: PanInfo) => {
    const noteId = note.id;
    const dragY = info.offset.y;
    const currentHeight = this.calculateDynamicHeight(noteId, dragY);
    const previousOffset = this.state.dragOffsetY[noteId] || 0;

    if (this.heightSnapshotRef.has(noteId) && currentHeight < 600) {
      // Unlock 600px lock and fall back to 250px logic
      this.heightSnapshotRef.delete(noteId);

      // Figure out where the SVG is right now
      const currentSvgTop =
        (this.state.topOffsetY[noteId] ?? 0) -
        10 +
        (this.state.lockedDragY[noteId] || 0);

      const newDragOffsetY =
        currentSvgTop - (this.state.topOffsetY[noteId] ?? 0) + 10;

      this.setState((prev) => ({
        dragOffsetY: { ...prev.dragOffsetY, [noteId]: newDragOffsetY },
        lockedDragY: { ...prev.lockedDragY, [noteId]: 0 },
      }));
    }

    // Check if we're crossing 600px threshold during drag
    if (currentHeight >= 600 && !this.heightSnapshotRef.has(noteId)) {
      this.heightSnapshotRef.set(noteId, info.offset.y);

      this.setState((prevState) => ({
        dragY: { ...prevState.dragY, [noteId]: info.offset.y },
        lockedDragY: {
          ...prevState.lockedDragY,
          [noteId]: info.offset.y + previousOffset, // Include previous offset
        },
        dragOffsetY: {
          ...prevState.dragOffsetY,
          [noteId]: previousOffset,
        },
      }));
      return;
    }

    if (
      currentHeight > 250 &&
      currentHeight < 600 &&
      !this.heightSnapshotRef250.has(noteId)
    ) {
      this.heightSnapshotRef250.set(noteId, info.offset.y);
    }

    this.setState({
      dragY: { ...this.state.dragY, [noteId]: info.offset.y },
    });
  };

  handleDragEnd = (note: notesReducerIntf, info: PanInfo) => {
    const noteId = note.id;
    const finalDragY = info.offset.y; // where it ended visually

    const snapshotY600 = this.heightSnapshotRef.get(noteId);

    const dynamicHeight = this.calculateDynamicHeight(
      noteId,
      snapshotY600 ?? finalDragY
    );
    const baseOffset =
      this.state.topOffsetY[noteId] ??
      this.state.initialTopOffsetY[noteId] ??
      0;

    if (dynamicHeight >= 600) {
      const lockedDragY = snapshotY600 ?? finalDragY;
      const previousOffset = this.state.dragOffsetY[noteId] || 0;
      const newTopOffset = 515;
      const currentSvgTopDuringDrag =
        (this.state.topOffsetY[noteId] ?? 0) -
        10 +
        previousOffset +
        2 * finalDragY;
      const requiredLockedDragY =
        snapshotY600 ?? currentSvgTopDuringDrag - (515 - 10);

      this.setState((prevState) => ({
        finalHeight: { ...prevState.finalHeight, [noteId]: 600 },
        topOffsetY: { ...prevState.topOffsetY, [noteId]: newTopOffset },
        dragY: { ...prevState.dragY, [noteId]: 0 },
        dragOffsetY: { ...prevState.dragOffsetY, [noteId]: 0 },
        lockedDragY: {
          ...prevState.lockedDragY,
          [noteId]: requiredLockedDragY,
        },
        selectedNoteId: null,
      }));
    } else if (dynamicHeight > 250) {
      const lockedDragY = finalDragY;
      const newTopOffset = baseOffset + lockedDragY;
      console.log(
        `Base Offset: ${baseOffset}, Locked Drag Y: ${lockedDragY}, New Top Offset: ${newTopOffset}`
      );
      this.setState((prevState) => ({
        finalHeight: { ...prevState.finalHeight, [noteId]: dynamicHeight },
        topOffsetY: { ...prevState.topOffsetY, [noteId]: newTopOffset },
        dragY: { ...prevState.dragY, [noteId]: 0 },
        dragOffsetY: {
          ...prevState.dragOffsetY,
          [noteId]: (prevState.dragOffsetY[noteId] || 0) + lockedDragY,
        },
        selectedNoteId: null,
      }));
    } else {
      const originalOffset = this.state.initialTopOffsetY[noteId] || 0;
      this.setState((prevState) => ({
        dragY: { ...prevState.dragY, [noteId]: 0 },
        finalHeight: { ...prevState.finalHeight, [noteId]: 50 },
        topOffsetY: { ...prevState.topOffsetY, [noteId]: originalOffset },
        dragOffsetY: { ...prevState.dragOffsetY, [noteId]: 0 },
        selectedNoteId: null,
      }));
      this.heightLockRef.set(noteId, false);
      this.heightSnapshotRef.delete(noteId);
      this.heightSnapshotRef250.delete(noteId);
    }
  };

  calculateDynamicHeight = (noteId: string, dragY: number): number => {
    const isSelected = noteId === this.state.selectedNoteId;
    console.log(
      `calculateDynamicHeight - noteId: ${noteId}, dragY: ${dragY}, isSelected: ${isSelected}`
    );
    if (!isSelected) return this.state.finalHeight[noteId] || 50;
    const baseHeight = this.state.finalHeight[noteId] || 50;
    const newHeight = baseHeight - dragY * 2;

    console.log(`calculateDynamicHeight - calculated height: ${newHeight}`);
    return newHeight;

    console.log(`calculateDynamicHeight - calculated height: ${newHeight}`);
    return newHeight;
  };

  render() {
    const { notes } = this.props;

    const groupedNotes: Record<string, notesReducerIntf[]> = notes.reduce(
      (acc, note) => {
        const firstChar = (note.title.charAt(0) || "A").toUpperCase();
        (acc[firstChar] ??= []).push(note);
        return acc;
      },
      {} as Record<string, notesReducerIntf[]>
    );

    const groupArray = Object.entries(groupedNotes).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    let nextZ = 1000;
    let yCursor = 820;
    const HEADER_GAP = 30;
    const NOTE_SPACING = 30;

    const groupLeftPositions = [300, 650, 950];
    const noteLeftPositions = [570, 860];

    return (
      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div className="grid grid-cols-1 grid-rows-1 relative h-[800px] w-[1200px] min-w-[500px] min-h-[928px] mt-0 p-0">
            <div>
              <div className="absolute rounded-xl border-2 bg-white right-[0.5%] top-[90%] w-1 h-[10%] rotate-10" />
              <div className="absolute rounded-sm border-2 w-[100%] top-[90%] bg-white h-4 z-2000" />
              <div className="absolute rounded-xl border-2 bg-white left-[0.5%] top-[90%] w-1 h-[10%] -rotate-10" />
            </div>
            <div className="absolute">
              {groupArray.map(([firstChar, groupNotes], groupIndex) => {
                const groupTopOffset = yCursor;
                const groupZIndexBase = nextZ;

                const groupLeft =
                  groupLeftPositions[groupIndex % groupLeftPositions.length];

                // Corrected z-index for the group note components
                const groupHeaderZIndex =
                  groupZIndexBase + 3 * groupNotes.length + 3;
                const groupCardZIndex =
                  groupZIndexBase + 3 * groupNotes.length + 2;
                const groupShadowZIndex =
                  groupZIndexBase + 3 * groupNotes.length + 1;

                const subNoteContent = groupNotes.map((note, noteIndex) => {
                  const isSelected = note.id === this.state.selectedNoteId;

                  const numLabel = String(
                    notes.findIndex((n) => n.id === note.id) + 1
                  ).padStart(3, "0");

                  const defaultTopOffset =
                    groupTopOffset - HEADER_GAP - noteIndex * NOTE_SPACING;

                  const topOffset =
                    this.state.topOffsetY[note.id] !== undefined
                      ? this.state.topOffsetY[note.id]
                      : defaultTopOffset;

                  if (this.state.topOffsetY[note.id] === undefined) {
                    this.setState((prevState) => ({
                      topOffsetY: {
                        ...prevState.topOffsetY,
                        [note.id]: topOffset,
                      },
                      initialTopOffsetY: {
                        ...prevState.initialTopOffsetY,
                        [note.id]: topOffset,
                      },
                    }));
                  }

                  const noteLeft =
                    noteLeftPositions[noteIndex % noteLeftPositions.length];

                  const dragY = this.state.dragY[note.id] || 0;

                  const isDragging = note.id === this.state.selectedNoteId;
                  const initialLockedDragY =
                    this.state.lockedDragY[note.id] || 0;
                  const dragOffset = this.state.dragOffsetY[note.id] || 0;

                  const finalHeight =
                    isDragging || this.state.finalHeight[note.id] === undefined
                      ? this.calculateDynamicHeight(note.id, dragY)
                      : this.state.finalHeight[note.id];

                  const wasLocked =
                    (this.state.finalHeight[note.id] || 0) >= 600 &&
                    !!this.state.lockedDragY[note.id];

                  const svgTop = isDragging
                    ? wasLocked
                      ? // use current locked visual top and subtract dragY for smooth movement
                        topOffset - 10 + initialLockedDragY + dragY
                      : topOffset - 10 + (dragOffset + dragY)
                    : wasLocked
                    ? topOffset - 10 + initialLockedDragY
                    : topOffset - 10 + dragOffset;

                  const whiteTop = topOffset + 5;
                  const shadowTop = topOffset + 3.5;

                  // Corrected z-index logic for sub-notes, stacked below group note but above each other
                  const noteZIndexBase =
                    groupZIndexBase + (groupNotes.length - 1 - noteIndex) * 3;
                  const zIndexShadow = noteZIndexBase;
                  const zIndexSvg = noteZIndexBase + 1;
                  const zIndexWhite = noteZIndexBase + 2;

                  return (
                    <div key={note.id}>
                      <motion.div
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        animate={{
                          y: isSelected ? dragY : 0,
                        }}
                        transition={{ duration: -1 }}
                        style={{
                          top: `${svgTop}px`,
                          left: `${noteLeft}px`,
                          zIndex: zIndexSvg,
                          cursor: finalHeight < 600 ? "grab" : "default",
                          width: "598px",
                          height: "140px",
                          clipPath:
                            "polygon(40% 100%, 50% 25%, 50% 0%, 50% 17%, 90% 20%, 94% 19%, 100% 70%, 90% 100%)",
                        }}
                        drag={
                          (this.state.finalHeight[note.id] || 50) < 601
                            ? "y"
                            : false
                        }
                        dragConstraints={{ top: -1000, bottom: 1000 }}
                        dragElastic={0.2}
                        dragTransition={{
                          bounceStiffness: 600,
                          bounceDamping: 20,
                        }}
                        onDragStart={() => this.handleDragStart(note)}
                        onDrag={(event, info) => this.handleDrag(note, info)}
                        onDragEnd={(e, info) => this.handleDragEnd(note, info)}
                      >
                        <svg
                          viewBox="0 0 100 200"
                          className="w-[590px] h-[140px]"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 130 L60 50 Q70 40,85 40 H410 Q425 40,435 60 L470 130 Z"
                            fill="white"
                            stroke="black"
                            strokeWidth={3}
                          />
                          <text
                            x="347"
                            y="72"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fill: "black",
                              fontSize: "3.5rem",
                              fontWeight: "bold",
                            }}
                          >
                            {note.title.toUpperCase() || "DEFAULT TITLE"}
                          </text>
                          <text
                            x="115"
                            y="72"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ fontSize: "3.5rem", fontWeight: "bold" }}
                          >
                            {numLabel}
                          </text>
                        </svg>
                      </motion.div>
                      <motion.div
                        className="text-3xl text-black text-center font-bold w-453 bg-white border-2 border-t-0 rounded-xl absolute left-240 -translate-x-1/2 -translate-y-1/2"
                        animate={{ y: isSelected ? dragY : 0 }}
                        transition={{ duration: -1 }}
                        style={{
                          top: `${whiteTop}px`,
                          height: `${finalHeight}px`,
                          zIndex: zIndexWhite,
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                          transform: "rotateX(-5deg)",
                        }}
                      />
                      <motion.div
                        className="w-454.5 h-20 absolute left-240 -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                        animate={{ y: isSelected ? dragY : 0 }}
                        transition={{ duration: -1 }}
                        style={{
                          top: `${shadowTop}px`,
                          height: `${finalHeight}px`,
                          zIndex: zIndexShadow,
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                        }}
                      />
                    </div>
                  );
                });

                nextZ -= 3 * groupNotes.length + 3;
                yCursor -= HEADER_GAP + groupNotes.length * NOTE_SPACING;

                return (
                  <div key={firstChar}>
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: `${groupTopOffset - 23}px`,
                        left: `${groupLeft}px`,
                        zIndex: groupHeaderZIndex - 1,
                        clipPath:
                          "polygon(1% 100%, 20% 20%, 50% 16%, 90% 20%, 85% 20%, 100% 80%, 67% 60%, 0% 60%)",
                      }}
                    >
                      <svg
                        viewBox="0 0 400 200"
                        className="w-[350px] h-[170px]"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M40 130 L80 50 Q90 40,105 40 H320 Q335 40,345 60 L380 130 Z"
                          fill="black"
                          stroke="white"
                          strokeWidth={3}
                        />
                        <text
                          x="120"
                          y="72"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ fill: "white", fontSize: "3.5rem" }}
                        >
                          {firstChar}
                        </text>
                      </svg>
                    </div>
                    <div
                      className="w-453 h-18 absolute -translate-x-1/2 -translate-y-1/2 bg-white border-2 rounded-xl"
                      style={{
                        top: `${groupTopOffset}px`,
                        left: "600px",
                        zIndex: groupCardZIndex,
                        clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                      }}
                    />
                    <div
                      className="w-454 h-18 absolute -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                      style={{
                        top: `${groupTopOffset}px`,
                        left: "600px",
                        zIndex: groupShadowZIndex,
                        clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                      }}
                    />
                    {subNoteContent}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({ notes: state.notes ?? [] });

export default connect(mapStateToProps)(FilesDraw);
