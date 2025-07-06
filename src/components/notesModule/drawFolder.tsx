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
                className="relative bg-black rounded-xl  border w-full h-full pl-220 pr-220 pt-400 z-0"
              >
                <div>
                  <div
                    className="text-3xl text-center w-333 bg-white border rounded-xl h-20 absolute top-290 left-220 -translate-x-1/2 -translate-y-1/2 z-1"
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                    }}
                  >
                    {note.title}
                  </div>
                  <div>
                    <div className="text-2xl bg-black text-white text-center w-50 h-20 rounded-xl border absolute top-292 left-105 -translate-x-1/2 -translate-y-1/2 z-1">
                      edge
                    </div>
                    <div
                      className="text-4xl text-center  bg-white rounded-xl w-333 border-t-2 h-20 absolute top-300 left-220 -translate-x-1/2 -translate-y-1/2  z-1"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 99% 100%, 1% 100%)",
                      }}
                    >
                      {note.title.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute rounded-xl  bg-white left-50 bottom-74 w-1 h-300"></div>
                  <div className="absolute rounded-xl  bg-white right-50 bottom-74 w-1 h-300"></div>
                  <div className="absolute rounded-xl border bg-white right-21.5 bottom-34 w-2 h-40 rotate-5 "></div>
                  <div className="absolute rounded-sm border w-400 bottom-70 left-20 bg-white h-4 z-1"></div>
                  <div className="absolute rounded-xl border bg-white left-21.5 bottom-34 w-2 h-40 -rotate-5"></div>
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
