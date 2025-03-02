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
        <div className="notes-form-title">
          <input
            type="text"
            placeholder="Title"
            className="notes-form-input-title"
            value={this.state.title}
            onChange={this.onTitleChange}
          />
        </div>
        <div className="notes-form-row textarea">
          <textarea
            className="notes-form-textarea"
            value={this.state.noteSnippet}
            onChange={this.onNoteSnippetChange}
          ></textarea>
        </div>

        <div className="notes-form-row">
          <input
            type="text"
            placeholder="Tags"
            className="notes-form-tags"
            value={this.state.tags}
            onChange={this.onTagsChange}
          />
        </div>
        <div className="notes-form-row">
          <div className="notes-form-datepicker">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                value={this.state.date}
                onChange={this.onDateChange}
                className="notes-form-datepicker"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined", // Ensures a full box
                    InputProps: {
                      sx: {
                        fontSize: "1.5rem",
                        height: "4rem",
                        borderRadius: "1rem", // Ensures box looks closed
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
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
