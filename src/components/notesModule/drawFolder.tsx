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

    // Unlock from 600-lock if dragging back down below 600
    if (this.heightSnapshotRef.has(noteId) && currentHeight < 600) {
      this.heightSnapshotRef.delete(noteId);

      // carry the anchor back from locked → offset
      const lockedAnchor = this.state.lockedDragY[noteId] || 0;

      this.setState((prev) => ({
        dragOffsetY: { ...prev.dragOffsetY, [noteId]: lockedAnchor },
        lockedDragY: { ...prev.lockedDragY, [noteId]: 0 },
      }));
      // let normal drag update continue
    }

    // Enter 600-lock from below for the first time this drag
    if (currentHeight >= 600 && !this.heightSnapshotRef.has(noteId)) {
      this.heightSnapshotRef.set(noteId, info.offset.y);

      // carry anchor from offset → locked
      const offsetAnchor = this.state.dragOffsetY[noteId] || 0;

      this.setState((prev) => ({
        dragY: { ...prev.dragY, [noteId]: info.offset.y },
        lockedDragY: { ...prev.lockedDragY, [noteId]: offsetAnchor },
        // dragOffsetY stays as-is but is ignored while locked
      }));

      if (this.heightSnapshotRef250.has(noteId)) {
        this.heightSnapshotRef250.delete(noteId);
      }
      return;
    }

    // Mark 250 lock if within that range for the first time
    if (
      currentHeight > 250 &&
      currentHeight < 600 &&
      !this.heightSnapshotRef250.has(noteId)
    ) {
      this.heightSnapshotRef250.set(noteId, info.offset.y);
    }

    // Normal drag position update
    this.setState({
      dragY: { ...this.state.dragY, [noteId]: info.offset.y },
    });
  };

  handleDragEnd = (note: notesReducerIntf, info: PanInfo) => {
    const noteId = note.id;
    const finalDragY = info.offset.y;

    const snapshotY600 = this.heightSnapshotRef.get(noteId);

    const dynamicHeight = this.calculateDynamicHeight(
      noteId,
      snapshotY600 ?? finalDragY
    );
    const baseOffset =
      this.state.topOffsetY[noteId] ??
      this.state.initialTopOffsetY[noteId] ??
      0;

    // Commit to 600 lock
    if (dynamicHeight >= 600) {
      const newTopOffset = 515;

      // choose the anchor that was actually driving the element
      const anchor =
        this.state.lockedDragY[noteId] != null
          ? this.state.lockedDragY[noteId]!
          : this.state.dragOffsetY[noteId] || 0;

      // visual top at mouse-up (remember: style includes +dragY and transform adds another +dragY)
      const currentSvgTopDuringDrag =
        (this.state.topOffsetY[noteId] ?? 0) - 10 + anchor + 2 * finalDragY;

      const requiredLockedDragY =
        snapshotY600 ?? currentSvgTopDuringDrag - (newTopOffset - 10);

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

      // Keep marker to indicate 600-lock after commit
      this.heightSnapshotRef.set(noteId, 0);
      return;
    }

    // Commit between 250 and 600
    if (dynamicHeight > 250) {
      const finalTop = baseOffset + finalDragY;

      this.setState((prevState) => ({
        finalHeight: { ...prevState.finalHeight, [noteId]: dynamicHeight },
        topOffsetY: { ...prevState.topOffsetY, [noteId]: finalTop },
        dragY: { ...prevState.dragY, [noteId]: 0 },
        dragOffsetY: {
          ...prevState.dragOffsetY,
          [noteId]: (prevState.dragOffsetY[noteId] || 0) + finalDragY,
        },
        selectedNoteId: null,
      }));
      return;
    }

    // Commit under 250
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

                  // consider locked if actively locked or finalHeight committed at 600 with locked anchor
                  const isLocked600 =
                    this.heightSnapshotRef.has(note.id) ||
                    ((this.state.finalHeight[note.id] || 0) >= 600 &&
                      !!this.state.lockedDragY[note.id]);

                  // choose anchor consistently
                  const anchor = isLocked600
                    ? this.state.lockedDragY[note.id] || 0
                    : this.state.dragOffsetY[note.id] || 0;

                  const finalHeight =
                    isDragging || this.state.finalHeight[note.id] === undefined
                      ? this.calculateDynamicHeight(note.id, dragY)
                      : this.state.finalHeight[note.id];

                  // unified calculation
                  const baseTop = topOffset - 10;
                  const svgTop = isDragging
                    ? baseTop + anchor + dragY
                    : baseTop + anchor;
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
