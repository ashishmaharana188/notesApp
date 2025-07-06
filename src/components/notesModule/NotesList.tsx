import { Component } from "react";
import { connect } from "react-redux";
import { NoteListProps } from "../../TS_INTERFACE/gInterface";
import FilesDraw from "./drawFolder";

class NoteList extends Component<NoteListProps> {
  render() {
    const { notes } = this.props; // Destructure notes from props

    return (
      <div className="mt-40 space-y-4">
        {notes.length === 0 ? (
          <p className="mt-60 ml-330 font-bold text-7xl">No notes available</p>
        ) : (
          <FilesDraw />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({
  notes: state.notes, // `notes` should be in your Redux store
});

export default connect(mapStateToProps)(NoteList);
