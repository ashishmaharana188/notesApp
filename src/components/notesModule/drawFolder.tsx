import { Component } from "react";
import { connect } from "react-redux";
import { NoteListProps, notesReducerIntf } from "../../TS_INTERFACE/gInterface";

/**
 * FilesDraw – renders grouped notes as "folders" stacked on top of each other.
 *
 * 𝗩𝗲𝗿𝘁𝗶𝗰𝗮𝗹 𝗹𝗮𝘆𝗼𝘂𝘁 (⏬ y‑axis):
 *   • A group header (white+black+SVG) occupies 20 px.
 *   • The first note starts 20 px **above** that header (so top‑offset − 20).
 *   • Each additional note climbs a further 20 px.
 *   • Therefore the total height consumed by a group = 20 (header‑gap)
 *     + 20 × notes.length.
 *   • We keep a running y‑cursor that walks upward so that the next group’s
 *     header begins immediately after the last note of the previous group –
 *     no 100 px fixed gap any more.
 */
class FilesDraw extends Component<NoteListProps> {
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
                          {/* white note bar */}
                          <div
                            className="text-3xl text-black text-center font-bold w-333 bg-white border-2 rounded-xl h-20 absolute left-220 -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: `${topOffset}px`,
                              zIndex: zIndex,
                              clipPath:
                                "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                transform: "skewX(-2deg)",
                                marginTop: "4px",
                              }}
                            >
                              {note.title.toUpperCase() || "DEFAULT TITLE"}
                            </span>
                          </div>

                          {/* black shadow under note */}
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
                                  top: `${groupTopOffset - 20}px`,
                                  left: "250px",
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
                                    d="M60 130 L100 50 Q110 40,125 40 H280 Q295 40,305 60 L341 130 Z"
                                    fill="black"
                                    stroke="white"
                                    strokeWidth="3"
                                  />
                                  <text
                                    x="200"
                                    y="80"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    style={{ fill: "white", fontSize: "4rem" }}
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

              /* 4️⃣  Advance both z‑cursor and y‑cursor for the next group */
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
