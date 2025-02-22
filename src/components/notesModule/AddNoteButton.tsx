import { Component } from "react";
import AddNoteForm from "./AddNoteForm";

class AddNoteButton extends Component {
  state = { isFormVisible: false };

  handleOpen = () => this.setState({ isFormVisible: true });
  handleClose = () => this.setState({ isFormVisible: false });

  render() {
    return (
      <div>
        <button onClick={this.handleOpen}>Add Note</button>
        {this.state.isFormVisible && <AddNoteForm onClose={this.handleClose} />}
      </div>
    );
  }
}

export default AddNoteButton;
