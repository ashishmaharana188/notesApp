import { Component } from "react";
import { connect } from "react-redux";
import { NoteListProps } from "../../TS_INTERFACE/gInterface";
import { notesReducerIntf } from "../../TS_INTERFACE/gInterface";

class FilesDraw extends Component<NoteListProps> {
  render() {
    const { notes } = this.props;
    console.log("Notes data:", notes); // Log notes data

    return (
      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div className="relative bg-whitesmoke rounded-xl w-full h-full pl-220 pr-220 pt-400 z-0">
            <div className="absolute rounded-xl border-2 bg-white left-49 bottom-140 w-1 h-300"></div>
            <div className="absolute rounded-xl border-2 bg-white right-49 bottom-140 w-1 h-300"></div>
            <div className="absolute rounded-xl border-3 bg-white right-21.5 bottom-100 w-2 h-40 rotate-5"></div>
            <div className="absolute rounded-sm border-3 w-400 bottom-136 left-20 bg-white h-4 z-52"></div>
            <div className="absolute rounded-xl border-3 bg-white left-21.5 bottom-100 w-2 h-40 -rotate-5"></div>
            {notes.map((note: notesReducerIntf, index: number) => {
              const topOffset = 610 - index * 20;
              const zIndex = notes.length - index;
              console.log(`Rendering note ${index}:`, note); // Log each note
              return (
                <div>
                  <div key={index}>
                    <div
                      className="text-3xl text-black text-center font-bold w-333 bg-white border-2 rounded-xl h-20 absolute left-220 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: `${topOffset}px`,
                        zIndex: zIndex,
                        clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                        transformOrigin: "center",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        key={note.id}
                        style={{
                          display: "inline-block",
                          transform: "skewX(-5deg)",
                          marginTop: "10px",
                        }}
                      >
                        {note.title.toUpperCase() || "Default Title"}
                      </span>
                    </div>
                    <div
                      className="text-3xl text-black text-center font-bold w-334 bg-black border-2 rounded-xl h-20 absolute left-220 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: `${topOffset}px`,
                        zIndex: zIndex - 1,
                        clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                        transformOrigin: "center",
                        overflow: "hidden",
                      }}
                    ></div>

                    <div>
                      <div
                        className="top-242 left-100 absolute -translate-x-1/2 -translate-y-1/2 z-49"
                        style={{ transform: "rotateY(20deg)" }} // Fixed to rotateY
                      >
                        <svg
                          viewBox="0 0 400 200"
                          className="w-[200px] h-[100px]"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="
              M 60 130
              L 100 50
              Q 110 40, 125 40
              H 280
              Q 295 40, 305 60
              L 341 130
              Z
            "
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
                            {note.title.charAt(0).toUpperCase() || "A"}
                          </text>
                        </svg>
                      </div>
                      <div
                        className="text-3xl text-center w-333 bg-white border-2 rounded-xl  h-20 absolute top-253 left-220 -translate-x-1/2 -translate-y-1/2 z-50" // Fixed w-340 to w-333
                        style={{
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                          transformOrigin: "center",
                          overflow: "hidden",
                        }}
                      ></div>
                      <div
                        className="text-3xl text-center w-334 bg-black border-2 rounded-xl  h-20 absolute top-253 left-220 -translate-x-1/2 -translate-y-1/2 z-49" // Fixed w-340 to w-333
                        style={{
                          clipPath:
                            "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                          transformOrigin: "center",
                          overflow: "hidden",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  console.log("Redux state:", state); // Log entire state
  return {
    notes: state.notes || [], // Fallback to empty array if undefined
  };
};

export default connect(mapStateToProps)(FilesDraw);
