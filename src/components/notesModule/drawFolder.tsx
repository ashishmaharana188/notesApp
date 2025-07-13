import { Component } from "react";
import { connect } from "react-redux";
import { NoteListProps, notesReducerIntf } from "../../TS_INTERFACE/gInterface";

class FilesDraw extends Component<NoteListProps> {
  getRandomLeftPosition = () => {
    return Math.floor(Math.random() * (750 - 250 + 1)) + 250;
  };

  render() {
    const { notes } = this.props;
    console.log("Notes data:", notes);

    /* 1️⃣  Group notes by first letter and sort alphabetically */
    const groupedNotes: { [key: string]: notesReducerIntf[] } = notes.reduce(
      (acc, note) => {
        const firstChar = note.title.charAt(0).toUpperCase() || "A";
        acc[firstChar] = acc[firstChar] || [];
        acc[firstChar].push(note);
        return acc;
      },
      {} as { [key: string]: notesReducerIntf[] }
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

    /* 3️⃣  Running y‑cursor (starts at the same initial 610px) */
    let yCursor = 630; // first group header position
    const HEADER_GAP = 20; // distance between header and its first note
    const NOTE_SPACING = 20; // distance between consecutive notes

    return (
      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div className="relative bg-whitesmoke rounded-xl w-full h-full pl-220 pr-220 pt-400 z-0">
            {/* binder rails – unchanged */}
            <div className="absolute rounded-xl border-2 bg-white left-49 bottom-140 w-1 h-300" />
            <div className="absolute rounded-xl border-2 bg-white right-49 bottom-140 w-1 h-300" />
            <div className="absolute rounded-xl border-3 bg-white right-21.5 bottom-100 w-2 h-40 rotate-5" />
            <div className="absolute rounded-sm border-3 w-400 bottom-136 left-20 bg-white h-4 z-300" />
            <div className="absolute rounded-xl border-3 bg-white left-21.5 bottom-100 w-2 h-40 -rotate-5" />

            {groupArray.map(([firstChar, groupNotes], groupIndex) => {
              const groupTopOffset = yCursor; // dynamic, no fixed 100‑px gap
              const groupZIndex = nextZ;

              console.log(
                `Group ${firstChar} (idx ${groupIndex}) → top ${groupTopOffset}px, ` +
                  `header white ${groupZIndex}, black ${groupZIndex - 1}, SVG ${
                    groupZIndex - 2
                  }`
              );

              const renderedGroup = (
                <div key={firstChar}>
                  {groupNotes.map(
                    (note: notesReducerIntf, noteIndex: number) => {
                      const numLabel = String(
                        notes.findIndex((n) => n.id === note.id) + 1
                      ).padStart(3, "0");
                      const topOffset =
                        groupTopOffset - HEADER_GAP - noteIndex * NOTE_SPACING;
                      const zIndex = groupZIndex - noteIndex - 1;

                      console.log(
                        `  Note ${noteIndex} → top ${topOffset}px, white ${zIndex}, black ${
                          zIndex - 1
                        }`
                      );

                      return (
                        <div key={note.id}>
                          {/* SVG roof */}
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: `${groupTopOffset - 40}px`,
                              left: `${this.getRandomLeftPosition()}px`,
                              zIndex: groupZIndex - 1,
                              transform: "rotateY(20deg)",
                            }}
                          >
                            <svg
                              viewBox="0 0 100 200"
                              className="w-[400px] h-[100px]"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20 130 L60 50 Q70 40,85 40 H410 Q425 40,435 60 L470 130 Z"
                                fill="white"
                                stroke="black"
                                strokeWidth="3"
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
                                style={{
                                  fontSize: "3.5rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {numLabel}
                              </text>
                            </svg>
                          </div>

                          {/* white note bar */}
                          <div
                            className="text-3xl text-black text-center font-bold w-333 bg-white border-2 border-t-0 rounded-xl h-20 absolute left-220 -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: `${topOffset}px`,
                              zIndex: zIndex,
                              clipPath:
                                "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                            }}
                          ></div>

                          {/* black shadow under note */}
                          <div
                            className="w-334 h-20 absolute left-220 -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                            style={{
                              top: `${topOffset - 2}px`,
                              zIndex: zIndex - 1,
                              clipPath:
                                "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                            }}
                          />
                          <div
                            className="w-334 h-20 absolute left-220 -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                            style={{
                              top: `${topOffset}px`,
                              zIndex: zIndex - 1,
                              clipPath:
                                "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                            }}
                          />

                          {/* embellishments on first note */}
                          {noteIndex === 0 && (
                            <>
                              {/* SVG roof */}
                              <div
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  top: `${groupTopOffset - 23}px`,
                                  left: `${this.getRandomLeftPosition()}px`,
                                  zIndex: groupZIndex - 1,
                                  transform: "rotateY(20deg)",
                                }}
                              >
                                <svg
                                  viewBox="0 0 400 200"
                                  className="w-[200px] h-[100px]"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M40 130 L80 50 Q90 40,105 40 H320 Q335 40,345 60 L380 130 Z"
                                    fill="black"
                                    stroke="white"
                                    strokeWidth="3"
                                  />
                                  <text
                                    x="120"
                                    y="72"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    style={{
                                      fill: "white",
                                      fontSize: "3.5rem",
                                    }}
                                  >
                                    {firstChar}
                                  </text>
                                </svg>
                              </div>

                              {/* white header bar */}
                              <div
                                className="w-333 h-20 absolute -translate-x-1/2 -translate-y-1/2 bg-white border-2 rounded-xl"
                                style={{
                                  top: `${groupTopOffset}px`,
                                  left: "550px",
                                  zIndex: groupZIndex,
                                  clipPath:
                                    "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                                }}
                              />
                              {/* black header shadow */}
                              <div
                                className="w-334 h-20 absolute -translate-x-1/2 -translate-y-1/2 bg-black border-2 rounded-xl"
                                style={{
                                  top: `${groupTopOffset}px`,
                                  left: "550px",
                                  zIndex: groupZIndex - 1,
                                  clipPath:
                                    "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                                }}
                              />
                            </>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              );

              nextZ -= 3 + 2 * groupNotes.length;
              yCursor -= HEADER_GAP + groupNotes.length * NOTE_SPACING;

              return renderedGroup;
            })}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  console.log("Redux state:", state);
  return { notes: state.notes || [] };
};

export default connect(mapStateToProps)(FilesDraw);
