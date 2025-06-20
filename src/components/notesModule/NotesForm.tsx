import React from "react";
import moment, { Moment } from "moment";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { NotesFormProp, NotesFormState } from "../../TS_INTERFACE/gInterface";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

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
      time: props.note?.time ? moment(props.note.time) : moment(),
      redirect: false,
      openDatePicker: false,
      openTimePicker: false,
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
  onTimeChange = (newTime: any) => {
    if (newTime && newTime.isValid()) {
      this.setState({
        time: moment(this.state.time).set({
          hour: newTime.hour(),
          minute: newTime.minute(),
        }),
      });
    }
  };
  onTagsChange = (e: any) => {
    this.setState({ tags: e.target.value });
  };
  handleCancel = () => {
    this.setState({
      redirect: false,
      openDatePicker: false,
      openTimePicker: false,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onDateTimeInputChange = (e: any) => {
    const input = e.target.value;
    const parsed = moment(input, "MM/DD/YYYY hh:mm A", true);
    if (parsed.isValid()) {
      this.setState({
        date: parsed,
        time: parsed,
      });
    }
  };

  togglePicker = (type: "date" | "time" | "both") => {
    if (type === "both") {
      const newState = !this.state.openDatePicker && !this.state.openTimePicker;
      this.setState({
        openDatePicker: newState,
        openTimePicker: newState,
      });
    } else if (type === "date") {
      this.toggleDatePicker();
    } else if (type === "time") {
      this.toggleTimePicker();
    }
  };

  toggleDatePicker = () => {
    this.setState({
      openDatePicker: !this.state.openDatePicker,
      openTimePicker: false,
    });
  };

  toggleTimePicker = () => {
    const currentTime = moment(); // Set to current time when opening
    this.setState({
      openTimePicker: !this.state.openTimePicker,
      openDatePicker: false,
      time: currentTime,
    });
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    this.setState({ openDatePicker: false, openTimePicker: false });
    if (this.props.onSubmit) {
      this.props.onSubmit({
        id: this.state.id,
        title: this.state.title,
        noteSnippet: this.state.noteSnippet,
        tags: this.state.tags,
        date: this.state.date.valueOf(),
        time: this.state.time.valueOf(),
      });
    }
  };

  handleFormClick = () => {
    this.setState({ openDatePicker: false, openTimePicker: false });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/notes" />;
    }
    const isBothOpen = this.state.openDatePicker && this.state.openTimePicker;
    return (
      <motion.div
        className="fixed top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-150 h-200 bg-white border border-gray-300 rounded-md shadow-md p-4"
        animate={{
          left:
            this.state.openDatePicker && this.state.openTimePicker
              ? "46%"
              : "50%", // Direct left shift
        }}
        transition={{ duration: 0.25, ease: [0.05, 0.05, 0.01, 0.01] }}
        onClick={this.handleFormClick}
      >
        <div className="bg-[#525b28] text-white p-2 text-3xl rounded-t-md text-center mb-5">
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-transparent border-none text-white text-center focus:outline-none focus:placeholder-transparent"
            value={this.state.title}
            onChange={this.onTitleChange}
          />
        </div>
        <div className="mb-2">
          <textarea
            className="w-full h-125 p-2 bg-gray-100 border resize-none  border-gray-300 text-3xl rounded-md focus:placeholder-transparent  focus:outline-none"
            value={this.state.noteSnippet}
            onChange={this.onNoteSnippetChange}
            placeholder="Write your note here..."
          ></textarea>
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Tags"
            className="w-full p-2 text-2xl bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:placeholder-transparent"
            value={this.state.tags}
            onChange={this.onTagsChange}
          />
        </div>
        <div
          className="mb-2 flex items-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 border-gray-300 rounded-md">
            {this.state.openDatePicker && (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={this.state.date}
                  onChange={this.onDateChange}
                  open={this.state.openDatePicker}
                  onOpen={() => this.setState({ openDatePicker: true })}
                  onClose={() => {}}
                  onAccept={() => {}}
                  slotProps={{
                    textField: {
                      size: "small",
                      style: { width: "100%", display: "none", opacity: 0 },

                      InputProps: {
                        style: {
                          paddingLeft: "50px",
                        },
                        endAdornment: null,
                      },
                    },
                    layout: {
                      sx: {
                        alignContent: "center",
                      },
                    },
                    popper: {
                      sx: {
                        left: isBothOpen ? "61% !important" : "65% !important",
                        top: "390px !important",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
            {this.state.openTimePicker && (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                  value={this.state.time}
                  onChange={this.onTimeChange}
                  open={this.state.openTimePicker}
                  onOpen={() => this.setState({ openTimePicker: true })}
                  onClose={() => {}}
                  onAccept={() => {}}
                  slotProps={{
                    textField: {
                      size: "small",
                      style: { width: "100%", display: "none" },

                      InputProps: {
                        style: {
                          paddingLeft: "50px",
                        },
                        endAdornment: null,
                      },
                    },
                    layout: {
                      sx: {
                        alignContent: "center",
                      },
                    },

                    popper: {
                      sx: {
                        "& .MuiPickersLayout-root": {
                          "& .MuiPickersLayout-contentWrapper": {
                            "& .MuiMultiSectionDigitalClockSection-root": {
                              scrollbarWidth: "none",
                              "-ms-overflow-style": "none",
                              "&::-webkit-scrollbar": {
                                display: "none",
                              },
                              height: "200px", // Increased height for better centering
                              padding: "0", // Remove default padding
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center", // Center vertically
                              alignItems: "center", // Center horizontally
                              "& .MuiMultiSectionDigitalClockSection-item": {
                                scrollBehavior: "smooth",
                                height: "30px", // Fixed height for items
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:focus": {
                                  scrollSnapAlign: "center",
                                },
                                "&.Mui-selected": {
                                  scrollSnapAlign: "center",
                                  scrollBehavior: "smooth",
                                  position: "relative",
                                  transform: "translateY(0)",
                                  borderRadius: "4px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                },
                              },
                            },
                          },
                        },
                        left: isBothOpen ? "85% !important" : "65% !important",
                        top: "50% !important",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          </div>

          <input
            type="text"
            className="flex-1 p-3 text-center text-3xl rounded-md focus:outline-none focus:border-[#525b28]"
            value={
              this.state.date.format("MM/DD/YYYY") +
              " " +
              this.state.time.format("hh:mm A")
            }
            onChange={this.onDateTimeInputChange}
            onClick={() => this.togglePicker("both")}
          />

          <IconButton
            onClick={() => this.togglePicker("date")}
            className="z-10"
          >
            <CalendarTodayIcon
              color={this.state.openDatePicker ? "primary" : "inherit"}
            />
          </IconButton>
          <IconButton
            onClick={() => this.togglePicker("time")}
            className="z-10"
          >
            <AccessTimeIcon
              color={this.state.openTimePicker ? "primary" : "inherit"}
            />
          </IconButton>
        </div>
        <div
          className="flex justify-center gap-4 border-t pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="bg-[#525b28] text-white px-4 py-2 mt-1 text-2xl  rounded-md hover:bg-[#525b28]/80 hover:text-white hover:shadow-md"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#525b28] text-white px-4 py-2 mt-1 text-2xl rounded-md hover:bg-[#525b28]/80 hover:text-white hover:shadow-md"
            onClick={this.onSubmit}
          >
            {this.state.id ? "Save Changes" : "Add Note"}
          </button>
        </div>
      </motion.div>
    );
  }
}
