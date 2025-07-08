import { Component } from "react";
import { connect } from "react-redux";
import { NoteListProps } from "../../TS_INTERFACE/gInterface";
import { notesReducerIntf } from "../../TS_INTERFACE/gInterface";

class FilesDraw extends Component<NoteListProps> {
  render() {
    const { notes } = this.props; // Destructure notes from props

    return (
      <div>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div>
            {notes.map((note: notesReducerIntf, index: number) => (
              <div
                key={index}
                className="relative bg-whitesmoke rounded-xl w-full h-full pl-220 pr-220 pt-400 z-0"
              >
                <div>
                  <div
                    className="text-3xl text-center w-333 bg-white border-2 rounded-xl w-333 h-20 absolute top-310 left-220 -translate-x-1/2 -translate-y-1/2 z-1"
                    style={{ transform: "skewX(0deg)", overflow: "hidden" }}
                  >
                    {note.title}
                  </div>

                  <div>
                    <div
                      className="top-310 left-100 absolute -translate-x-1/2 -translate-y-1/2 z-1"
                      style={{ transform: "rotatey(20deg)" }}
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
            L 330 105
            Z
          "
                          fill="black"
                          stroke="white"
                          strokeWidth="3"
                        />
                        <text
                          x="200"
                          y="70"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white text-6xl"
                        >
                          {note.title.charAt(0)}
                        </text>
                      </svg>
                    </div>
                    <div
                      className="text-3xl text-center w-333 bg-white border-2 rounded-xl w-333 h-20 absolute top-320 left-220 -translate-x-1/2 -translate-y-1/2 z-1"
                      style={{ transform: "skewX(0deg)", overflow: "hidden" }}
                    ></div>
                  </div>
                  <div className="absolute rounded-xl border-2 bg-white left-50 bottom-74 w-1 h-300"></div>
                  <div className="absolute rounded-xl  border-2 bg-white right-50 bottom-74 w-1 h-300"></div>
                  <div className="absolute rounded-xl border-3 bg-white right-21.5 bottom-34 w-2 h-40 rotate-5 "></div>
                  <div className="absolute rounded-sm border-3 w-400 bottom-70 left-20 bg-white h-4 z-2"></div>
                  <div className="absolute rounded-xl border-3 bg-white left-21.5 bottom-34 w-2 h-40 -rotate-5"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  notes: state.notes, // `notes` should be in your Redux store
});

export default connect(mapStateToProps)(FilesDraw);
