import React from "react";
import moment, { Moment } from "moment";
import { NotesFormProp, NotesFormState } from "../../TS_INTERFACE/gInterface";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Navigate } from "react-router-dom";

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
  handleCancel = () => {
    this.setState({ redirect: true }); // ✅ Trigger navigation
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
      return <Navigate to="/notes" />; // Redirect when state is true
    }
    return (
      <Paper elevation={4} sx={{ maxWidth: 600, mx: "auto", p: 3, mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          {this.state.id ? "Edit Note" : "New Note"}
        </Typography>

        {/* Title Input */}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={this.state.title}
          onChange={this.onTitleChange}
          sx={{ mb: 2 }}
        />

        {/* Snippet Input */}
        <TextField
          label="Snippet"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={this.state.noteSnippet}
          onChange={this.onNoteSnippetChange}
          sx={{ mb: 2 }}
        />

        {/* Tags Input */}
        <TextField
          label="Tags"
          variant="outlined"
          fullWidth
          value={this.state.tags}
          onChange={this.onTagsChange}
          sx={{ mb: 2 }}
        />

        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Select Date"
            value={this.state.date}
            onChange={this.onDateChange}
          />
        </LocalizationProvider>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={this.onSubmit}
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {this.state.id ? "Save Changes" : "Add Note"}
          </Button>
        </Box>
      </Paper>
    );
  }
}
