import { Component } from "react";
import AddNoteForm from "./AddNoteForm";

type AddNoteButtonState = {
  isFormVisible: boolean;
};

class AddNoteButton extends Component<{}, AddNoteButtonState> {
  state: AddNoteButtonState = {
    isFormVisible: false,
  };

  handleOpen = () => {
    this.setState({ isFormVisible: true }, () => {});
  };
  handleClose = () => {
    this.setState({ isFormVisible: false }, () => {});
  };

  render() {
    return (
      <div>
        <button
          className="fixed bottom-6 right-4 h-13 w-50 ml-500 border-none outline-none bg-gray-800 text-white text-sm px-3 py-2 cursor-pointer rounded-md mt-12 mb-12"
          onClick={this.handleOpen}
        >
          Add Note
        </button>
        {this.state.isFormVisible && <AddNoteForm onClose={this.handleClose} />}
      </div>
    );
  }
}

export default AddNoteButton;
