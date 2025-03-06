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
    console.log("Opening form...");
    this.setState({ isFormVisible: true }, () => {
      console.log("isFormVisible:", this.state.isFormVisible);
    });
  };
  handleClose = () => {
    console.log("Closing form...");
    this.setState({ isFormVisible: false }, () => {
      console.log("isFormVisible:", this.state.isFormVisible);
    });
  };

  render() {
    return (
      <div>
        <button
          className="fixed bottom-4 right-4 h-13 w-50 ml-500 border-none outline-none bg-gray-800 text-white text-sm px-3 py-2 cursor-pointer rounded-md mt-12 mb-12"
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
