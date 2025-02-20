import React from "react";
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
      date: props.notes?.date || "",
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
  onDateChange = (e: any) => {
    const date = e.target.value;
    this.setState(() => ({ date }));
  };

  onSubmit = (e: any) => {
    e.preventDefault();
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
