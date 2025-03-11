import { Component } from "react";
import { connect } from "react-redux";
import "../../styles/components/notesModule/NoteCard.css";
import NoteCard from "./NotesCard";
import { NoteListProps } from "../../TS_INTERFACE/gInterface";

class NoteList extends Component<NoteListProps> {
  render() {
    return (
      <div className="mt-40 space-y-4">
        {this.props.notes.length === 0 ? (
          <p className="notes-form-title">No notes available</p>
        ) : (
          this.props.notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  notes: state.notes, // `notes` should be in your Redux store
});

export default connect(mapStateToProps)(NoteList);
