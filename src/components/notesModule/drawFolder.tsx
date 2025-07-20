import { Component } from "react";
import { connect } from "react-redux";
import {
  NoteListProps,
  notesReducerIntf,
  FilesDrawState,
} from "../../TS_INTERFACE/gInterface";

class FilesDraw extends Component<NoteListProps, FilesDrawState> {
  /** Returns a pseudo‑random x‑position for decorative SVGs */
  state = {
    selectedNoteId: null,
  };

  handleNoteClick = (noteId: string, title: string, numLabel: string) => {
    console.log("Clicked note details:", {
      id: noteId,
      title: title,
      label: numLabel,
      currentlySelected: this.state.selectedNoteId,
    });

    this.setState((prevState) => ({
      selectedNoteId: prevState.selectedNoteId === noteId ? null : noteId,
    }));
  };

  render() {
    const { notes } = this.props;

    /* 1️⃣  Group notes by first letter and sort alphabetically */
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

    /* 2️⃣  z‑index bookkeeping */
    const totalLayers = groupArray.reduce(
      (sum, [, g]) => sum + 3 + 2 * g.length,
      0
    );
    let nextZ = totalLayers;

    /* 3️⃣  Running y‑cursor (starts at the same initial 630px) */
    let yCursor = 814; // first group header position
    const HEADER_GAP = this.state.selectedNoteId ? 38 : 37; // distance between header and its first note
    const NOTE_SPACING = 25; // distance between consecutive notes

    const groupLeftPositions = [300, 650, 950];
    const noteLeftPositions = [570, 860];

    return (
      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div className="grid grid-cols-1 grid-rows-1  relative h-[800px] w-[1200px] min-w-[500px] min-h-[928px] mt-0 p-0">
            <div>
              <div className="absolute rounded-xl border-2 bg-white left-[2%] bottom-[10%] w-1 h-6/7" />
              <div className="absolute rounded-xl border-2 bg-white right-[2%] bottom-[10%] w-1 h-6/7" />
              <div className="absolute rounded-xl border-2 bg-white right-[0.5%] top-[90%] w-1 h-[10%] rotate-10" />
              <div className="absolute rounded-sm border-2 w-[100%] top-[90%] bg-white h-2 z-30" />
              <div className="absolute rounded-xl border-2 bg-white left-[0.5%] top-[90%] w-1 h-[10%] -rotate-10" />
            </div>
            <div className="absolute">
              {groupArray.map(([firstChar, groupNotes], groupIndex) => {
                const groupTopOffset = yCursor; // dynamic
                const groupZIndex = nextZ;

                const groupLeft =
                  groupLeftPositions[groupIndex % groupLeftPositions.length];

                /* Render each note inside the group */
                const groupContent = groupNotes.map((note, noteIndex) => {
                  const isSelected = note.id === this.state.selectedNoteId;
                  const numLabel = String(
                    notes.findIndex((n) => n.id === note.id) + 1
                  ).padStart(3, "0");
                  const topOffset =
                    groupTopOffset - HEADER_GAP - noteIndex * NOTE_SPACING;

                  const noteLeft =
                    noteLeftPositions[noteIndex % noteLeftPositions.length];

                  // ── z‑index per note ───────────────────────────────────────────

                  const zIndexWhite = groupZIndex - 2 * noteIndex - 1;
                  const zIndexShadow = zIndexWhite - 1;

                  return (
                    <div key={note.id}>
                      {/* ── SVG roof (white) ───────────────────────────────────── */}
                      <div
                        className="absolute  -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: `${
                            isSelected ? topOffset - 585 : topOffset - 20
                          }px`,
                          left: `${noteLeft}px`,
                          zIndex: zIndexWhite,

                          cursor: "pointer",
                          width: "590px",
                          height: "140px",
                          clipPath:
                            "polygon(40% 100%, 50% 25%, 50% 0%, 50% 20%, 100% 17%, 95% 18.2%, 100% 50%, 96% 100%)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from bubbling
                          this.handleNoteClick(note.id, note.title, numLabel);
                        }}
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
                      </div>

                      {/* ── white note bar ──────────────────────────────────────── */}
                      <div
                        className="text-3xl text-black text-center font-bold w-453 bg-white border-2 border-t-0 rounded-xl h-20 absolute left-240 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: `${isSelected ? topOffset - 275 : topOffset}px`,
                          height: isSelected ? "600px" : "30px",
                          zIndex: zIndexWhite,
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                          transform: "rotateX(-5deg)",
                        }}
                      />

                      {/* ── black shadow ───────────────────────────────────────── */}
                      <div
                        className="w-454.5 h-20 absolute left-240 -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                        style={{
                          top: `${
                            isSelected ? topOffset - 277 : topOffset - 2
                          }px`,
                          height: isSelected ? "601px" : "30px",
                          zIndex: zIndexShadow,
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                        }}
                      />

                      {/* ── Group header embellishments (only on first note) ───── */}
                      {noteIndex === 0 && (
                        <>
                          {/* black SVG roof */}
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

                          {/* white header bar */}
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
                          {/* black header shadow */}
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

                /* Move bookkeeping cursors for next group */
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
