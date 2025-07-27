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
}

class FilesDraw extends Component<NoteListProps, FilesDrawState> {
  state: FilesDrawState = {
    selectedNoteId: null,
    dragY: {},
    finalHeight: {},
    topOffsetY: {},
  };

  heightLockRef = new Map<string, boolean>();

  handleDragStart = (note: notesReducerIntf) => {
    console.log(`handleDragStart - noteId: ${note.id}`);
    this.setState({ selectedNoteId: note.id });
    this.heightLockRef.set(note.id, false);
  };

  handleDrag = (note: notesReducerIntf, info: PanInfo) => {
    const noteId = note.id;
    const dragY = info.offset.y;
    const currentHeight = this.calculateDynamicHeight(noteId, dragY);
    console.log(
      `handleDrag - noteId: ${noteId}, dragY: ${dragY}, currentHeight: ${currentHeight}`
    );
    if (currentHeight < 600 && !this.heightLockRef.get(noteId)) {
      this.setState({
        dragY: { ...this.state.dragY, [noteId]: dragY },
      });
    }
    if (currentHeight >= 600 && !this.heightLockRef.get(noteId)) {
      console.log(
        `Locking height at 600px and topOffsetY at ${dragY} for noteId: ${noteId}`
      );
      this.setState(
        (prevState) => ({
          finalHeight: { ...prevState.finalHeight, [noteId]: 600 },
          topOffsetY: { ...prevState.topOffsetY, [noteId]: dragY },
          dragY: { ...prevState.dragY, [noteId]: 0 },
        }),
        () => {
          console.log(
            `State after lock - finalHeight: ${this.state.finalHeight[noteId]}, topOffsetY: ${this.state.topOffsetY[noteId]}`
          );
        }
      );
      this.heightLockRef.set(noteId, true);
    }
  };

  handleDragEnd = (note: notesReducerIntf) => {
    const noteId = note.id;
    const dragY = this.state.dragY[noteId] || 0;
    const dynamicHeight = this.calculateDynamicHeight(noteId, dragY);
    console.log(
      `handleDragEnd - noteId: ${noteId}, dragY: ${dragY}, dynamicHeight: ${dynamicHeight}`
    );
    if (dynamicHeight >= 600) {
      console.log(`Finalizing lock for noteId: ${noteId}`);
      this.setState(
        {
          selectedNoteId: dragY === 0 ? null : this.state.selectedNoteId,
        },
        () => {
          console.log(
            `State after drag end - finalHeight: ${this.state.finalHeight[noteId]}, topOffsetY: ${this.state.topOffsetY[noteId]}`
          );
        }
      );
    } else {
      this.setState({
        dragY: { ...this.state.dragY, [noteId]: 0 },
        selectedNoteId: dragY === 0 ? null : this.state.selectedNoteId,
      });
    }
  };

  calculateDynamicHeight = (noteId: string, dragY: number): number => {
    const isSelected = noteId === this.state.selectedNoteId;
    console.log(
      `calculateDynamicHeight - noteId: ${noteId}, dragY: ${dragY}, isSelected: ${isSelected}`
    );
    if (!isSelected) return this.state.finalHeight[noteId] || 30;
    const baseHeight = 30;
    const heightChange = Math.abs(dragY) * 1.9;
    const newHeight = baseHeight + heightChange;
    const result = Math.min(600, newHeight); // Cap at 600px
    console.log(`calculateDynamicHeight - calculated height: ${result}`);
    return result;
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

    const totalLayers = groupArray.reduce(
      (sum, [, g]) => sum + 3 + 2 * g.length,
      0
    );
    let nextZ = totalLayers;

    let yCursor = 814;
    const HEADER_GAP = 38;
    const NOTE_SPACING = 25;

    const groupLeftPositions = [300, 650, 950];
    const noteLeftPositions = [570, 860];

    return (
      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div className="grid grid-cols-1 grid-rows-1 relative h-[800px] w-[1200px] min-w-[500px] min-h-[928px] mt-0 p-0">
            <div>
              <div className="absolute rounded-xl border-2 bg-white left-[2%] bottom-[10%] w-1 h-6/7" />
              <div className="absolute rounded-xl border-2 bg-white right-[2%] bottom-[10%] w-1 h-6/7" />
              <div className="absolute rounded-xl border-2 bg-white right-[0.5%] top-[90%] w-1 h-[10%] rotate-10" />
              <div className="absolute rounded-sm border-2 w-[100%] top-[90%] bg-white h-2 z-30" />
              <div className="absolute rounded-xl border-2 bg-white left-[0.5%] top-[90%] w-1 h-[10%] -rotate-10" />
            </div>
            <div className="absolute">
              {groupArray.map(([firstChar, groupNotes], groupIndex) => {
                const groupTopOffset = yCursor;
                const groupZIndex = nextZ;

                const groupLeft =
                  groupLeftPositions[groupIndex % groupLeftPositions.length];

                const groupContent = groupNotes.map((note, noteIndex) => {
                  const isSelected = note.id === this.state.selectedNoteId;
                  const numLabel = String(
                    notes.findIndex((n) => n.id === note.id) + 1
                  ).padStart(3, "0");
                  const topOffset =
                    groupTopOffset - HEADER_GAP - noteIndex * NOTE_SPACING;

                  const noteLeft =
                    noteLeftPositions[noteIndex % noteLeftPositions.length];

                  const zIndexWhite = groupZIndex - 2 * noteIndex - 1;
                  const zIndexShadow = zIndexWhite - 1;

                  const dragY = this.state.dragY[note.id] || 0;
                  const finalHeight =
                    this.state.finalHeight[note.id] ||
                    this.calculateDynamicHeight(note.id, dragY);
                  const topOffsetY = this.state.topOffsetY[note.id] || 0;
                  const svgTop =
                    finalHeight >= 600
                      ? topOffset + topOffsetY + 20
                      : isSelected
                      ? topOffset + dragY + 20
                      : topOffset - 20;
                  const whiteTop =
                    finalHeight >= 600
                      ? topOffset + topOffsetY + 30
                      : isSelected
                      ? topOffset + 30 + dragY
                      : topOffset;
                  const shadowTop =
                    finalHeight >= 600
                      ? topOffset + topOffsetY + 29
                      : isSelected
                      ? topOffset + dragY + 29
                      : topOffset - 2;

                  return (
                    <div key={note.id}>
                      <motion.div
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: `${svgTop}px`,
                          left: `${noteLeft}px`,
                          zIndex: zIndexWhite,
                          cursor: finalHeight < 600 ? "grab" : "default",
                          width: "598px",
                          height: "140px",
                          clipPath:
                            "polygon(40% 100%, 50% 25%, 50% 0%, 50% 20%, 100% 17%, 95% 18.2%, 100% 50%, 96% 100%)",
                        }}
                        drag={finalHeight < 600 ? "y" : false} // Disable drag at 600px
                        dragConstraints={
                          finalHeight < 600
                            ? { top: -600, bottom: 600 }
                            : { top: 0, bottom: 0 }
                        }
                        dragElastic={0.2}
                        dragTransition={{
                          bounceStiffness: 600,
                          bounceDamping: 20,
                        }}
                        onDragStart={() => this.handleDragStart(note)}
                        onDrag={(event, info) => this.handleDrag(note, info)}
                        onDragEnd={() => this.handleDragEnd(note)}
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
                        style={{
                          top: `${shadowTop}px`,
                          height: `${finalHeight}px`,
                          zIndex: zIndexShadow,
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                        }}
                      />

                      {noteIndex === 0 && (
                        <>
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: `${groupTopOffset - 23}px`,
                              left: `${groupLeft}px`,
                              zIndex: groupZIndex - 1,
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
                            className="w-453 h-20 absolute -translate-x-1/2 -translate-y-1/2 bg-white border-2 rounded-xl"
                            style={{
                              top: `${groupTopOffset}px`,
                              left: "600px",
                              zIndex: groupZIndex,
                              clipPath:
                                "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                            }}
                          />
                          <div
                            className="w-454 h-20 absolute -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                            style={{
                              top: `${groupTopOffset}px`,
                              left: "600px",
                              zIndex: groupZIndex - 1,
                              clipPath:
                                "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                            }}
                          />
                        </>
                      )}
                    </div>
                  );
                });

                nextZ -= 3 + 2 * groupNotes.length;
                yCursor -= HEADER_GAP + groupNotes.length * NOTE_SPACING;

                return <div key={firstChar}>{groupContent}</div>;
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
