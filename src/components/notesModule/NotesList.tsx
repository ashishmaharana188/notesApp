import { Component } from "react";
import { connect } from "react-redux";
import NoteCard from "./NotesCard";
import { NoteListProps } from "../../TS_INTERFACE/gInterface";

class NoteList extends Component<NoteListProps> {
  render() {
    const { notes } = this.props; // Destructure notes from props

    return (
      <div className="mt-40 space-y-4">
        {notes.length === 0 ? (
          <p className="text-6xl">No notes available</p>
        ) : (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({
  notes: state.notes, // `notes` should be in your Redux store
});

export default connect(mapStateToProps)(NoteList);
