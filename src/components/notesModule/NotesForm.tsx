import React from "react";
import moment, { Moment } from "moment";
import { NotesFormProp, NotesFormState } from "../../TS_INTERFACE/gInterface";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
    };
  }

  onTitleChange = (e: any) => {
    const title = e.target.value;
    this.setState(() => ({ title }));
  };
  onNoteSnippetChange = (e: any) => {
    const noteSnippet = e.target.value;
    this.setState(() => ({ noteSnippet }));
  };
  onDateChange = (newDate: Moment | null) => {
    if (newDate && newDate.isValid()) {
      this.setState({ date: newDate });
    }
  };
  onTagsChange = (e: any) => {
    const tags = e.target.value;
    this.setState(() => ({ tags }));
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
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            placeholder="Title"
            autoFocus
            value={this.state.title}
            onChange={this.onTitleChange}
          />
          <textarea
            placeholder="Snippet"
            value={this.state.noteSnippet}
            onChange={this.onNoteSnippetChange}
          />
          <input
            type="text"
            placeholder="Tags"
            value={this.state.tags}
            onChange={this.onTagsChange}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker value={this.state.date} onChange={this.onDateChange} />
          </LocalizationProvider>
          <button type="submit">
            {this.state.id ? "Save Changes" : "Add Note"}
          </button>
        </form>
      </div>
    );
  }
}
