import { Component } from "react";
import NotesForm from "./NotesForm";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { addNote } from "../../actions/AddNote";
import { NotesFormProp } from "../../TS_INTERFACE/gInterface";

class AddNoteForm extends Component<NotesFormProp & { dispatch?: Dispatch }> {
  handleSubmit = (note: any) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(note);
    }
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    return (
      <div>
        <NotesForm onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onSubmit: (note: any) => dispatch(addNote(note)),
  };
};
export default connect(undefined, mapDispatchToProps)(AddNoteForm);
