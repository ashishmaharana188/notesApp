import React from "react";
import moment, { Moment } from "moment";
import { NotesFormProp, NotesFormState } from "../../TS_INTERFACE/gInterface";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Navigate } from "react-router-dom";

export default class NotesForm extends React.Component<
  NotesFormProp,
  NotesFormState
> {
  constructor(props: NotesFormProp) {
    super(props);
    this.state = {
      id: props.note?.id || "",
      title: props.note?.title || "",
      noteSnippet: props.note?.noteSnippet || "",
      tags: props.note?.tags || "",
      date: props.note?.date ? moment(props.note.date) : moment(),
      redirect: false,
    };
  }

  onTitleChange = (e: any) => {
    this.setState({ title: e.target.value });
  };
  onNoteSnippetChange = (e: any) => {
    this.setState({ noteSnippet: e.target.value });
  };
  onDateChange = (newDate: Moment | null) => {
    if (newDate && newDate.isValid()) {
      this.setState({ date: newDate });
    }
  };
  onTagsChange = (e: any) => {
    this.setState({ tags: e.target.value });
  };
  handleCancel = () => {
    this.setState({ redirect: false });
    console.log("NotesForm: Cancel button clicked");
    if (this.props.onClose) {
      console.log("NotesForm: Calling onClose...");
      this.props.onClose();
    } else {
      console.log("NotesForm: onClose is undefined!");
    }
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit({
        id: this.state.id,
        title: this.state.title,
        noteSnippet: this.state.noteSnippet,
        tags: this.state.tags,
        date: this.state.date.valueOf(),
      });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/notes" />;
    }
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white border border-gray-300 rounded-md shadow-md p-4">
        <div className="bg-gray-800 text-white p-2 text-lg rounded-t-md text-center">
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-transparent border-none text-white text-lg text-center focus:outline-none"
            value={this.state.title}
            onChange={this.onTitleChange}
          />
        </div>
        <div className="mb-2">
          <textarea
            className="w-full h-72 p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
            value={this.state.noteSnippet}
            onChange={this.onNoteSnippetChange}
            placeholder="Write your note here..."
          ></textarea>
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Tags"
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
            value={this.state.tags}
            onChange={this.onTagsChange}
          />
        </div>
        <div className="mb-2">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              value={this.state.date}
              onChange={this.onDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  InputProps: {
                    sx: {
                      fontSize: "1rem",
                      height: "3rem",
                      borderRadius: "0.5rem",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <div className="flex justify-center gap-4 border-t pt-2">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black hover:text-white hover:shadow-md"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black hover:text-white hover:shadow-md"
            onClick={this.onSubmit}
          >
            {this.state.id ? "Save Changes" : "Add Note"}
          </button>
        </div>
      </div>
    );
  }
}
