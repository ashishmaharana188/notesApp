import { Component } from "react";
import NotesForm from "./NotesForm";

class AddNoteForm extends Component<NotesForm> {
  handleSubmit = (expense: any) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(expense);
      console.log("Submitted", expense);
    }
  };

  render() {
    return (
      <div>
        <NotesForm
          onSubmit={this.handleSubmit}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}
