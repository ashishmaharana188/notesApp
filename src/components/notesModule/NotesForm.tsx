import React from "react";
import moment, { Moment } from "moment";
import { NotesFormProp, NotesFormState } from "../../TS_INTERFACE/gInterface";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Navigate } from "react-router-dom";
import "../../styles/components/notesModule/NoteForm.css"; // Import CSS file

export default class NotesForm extends React.Component<
  NotesFormProp,
  NotesFormState
> {
  constructor(props: NotesFormProp) {
    super(props);
    console.log("🆕 NotesForm Mounted with Note:", props.note);
    console.log("Received Props in NotesForm:", props.note);
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
    this.setState({ redirect: true });
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
      <div className="notes-form-container">
        <h2 className="notes-form-title">
          {this.state.id ? "Edit Note" : "New Note"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="notes-form-input"
          value={this.state.title}
          onChange={this.onTitleChange}
        />

        <textarea
          placeholder="Snippet"
          className="notes-form-input notes-form-textarea"
          value={this.state.noteSnippet}
          onChange={this.onNoteSnippetChange}
        ></textarea>

        <input
          type="text"
          placeholder="Tags"
          className="notes-form-input"
          value={this.state.tags}
          onChange={this.onTagsChange}
        />

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Select Date"
            value={this.state.date}
            onChange={this.onDateChange}
            className="notes-form-datepicker"
          />
        </LocalizationProvider>

        <div className="notes-form-buttons">
          <button className="notes-form-cancel" onClick={this.handleCancel}>
            Cancel
          </button>
          <button className="notes-form-submit" onClick={this.onSubmit}>
            {this.state.id ? "Save Changes" : "Add Note"}
          </button>
        </div>
      </div>
    );
  }
}
