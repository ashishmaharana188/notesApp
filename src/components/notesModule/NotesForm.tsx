import React from "react";
import moment, { Moment } from "moment";
import { NotesFormProp, NotesFormState } from "../../TS_INTERFACE/gInterface";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export default class NotesForm extends React.Component<
  NotesFormProp,
  NotesFormState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: props.notes?.title || "",
      noteSnippet: props.notes?.noteSnippet || "",
      date: props.notes?.date ? moment(props.notes.date) : moment(),
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

  onSubmit = (e: any) => {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit({
        title: this.state.title,
        noteSnippet: this.state.noteSnippet,
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
            autoFocus
            value={this.state.noteSnippet}
            onChange={this.onNoteSnippetChange}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker value={this.state.date} onChange={this.onDateChange} />
          </LocalizationProvider>
          <button>Add Expense</button>
        </form>
      </div>
    );
  }
}
