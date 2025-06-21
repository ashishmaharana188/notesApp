import React, { useRef, useState } from "react";
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

const NotesForm: React.FC<NotesFormProp> = ({ note, onClose, onSubmit }) => {
  const [state, setState] = useState<NotesFormState>({
    id: note?.id || "",
    title: note?.title || "",
    noteSnippet: note?.noteSnippet || "",
    tags: note?.tags || "",
    date: note?.date ? moment(note.date) : moment(),
    time: note?.time ? moment(note.time) : moment(),
    redirect: false,
    openDatePicker: false,
    openTimePicker: false,
  });
  const anchorDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({ ...prev, title: e.target.value }));
  const onNoteSnippetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setState((prev) => ({ ...prev, noteSnippet: e.target.value }));
  const onDateChange = (newDate: Moment | null) =>
    newDate?.isValid() && setState((prev) => ({ ...prev, date: newDate }));
  const onTimeChange = (newTime: Moment | null) =>
    newTime?.isValid() &&
    setState((prev) => ({
      ...prev,
      time: moment(prev.time).set({
        hour: newTime.hour(),
        minute: newTime.minute(),
      }),
    }));
  const onTagsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({ ...prev, tags: e.target.value }));
  const handleCancel = () => {
    setState((prev) => ({
      ...prev,
      redirect: false,
      openDatePicker: false,
      openTimePicker: false,
    }));
    onClose?.();
  };

  const onDateTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = moment(e.target.value, "MM/DD/YYYY hh:mm A", true);
    parsed.isValid() &&
      setState((prev) => ({ ...prev, date: parsed, time: parsed }));
  };

  const togglePicker = (type: "date" | "time" | "both") => {
    if (type === "both") {
      const newState = !state.openDatePicker && !state.openTimePicker;
      setState((prev) => ({
        ...prev,
        openDatePicker: newState,
        openTimePicker: newState,
      }));
    } else if (type === "date") {
      setState((prev) => ({
        ...prev,
        openDatePicker: !prev.openDatePicker,
        openTimePicker: false,
      }));
    } else if (type === "time") {
      setState((prev) => ({
        ...prev,
        openTimePicker: !prev.openTimePicker,
        openDatePicker: false,
        time: moment(),
      }));
    }
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      openDatePicker: false,
      openTimePicker: false,
    }));
    onSubmit?.({
      id: state.id,
      title: state.title,
      noteSnippet: state.noteSnippet,
      tags: state.tags,
      date: state.date.valueOf(),
      time: state.time.valueOf(),
    });
  };

  const isBothOpen = state.openDatePicker && state.openTimePicker;

  if (state.redirect) return <Navigate to="/notes" />;

  return (
    <motion.div
      className="fixed top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-150 h-200 bg-white border border-gray-300 rounded-md shadow-md p-4"
      animate={{ left: isBothOpen ? "46%" : "50%" }}
      transition={{ duration: 0.25, ease: [0.05, 0.05, 0.01, 0.01] }}
      onClick={() =>
        setState((prev) => ({
          ...prev,
          openDatePicker: false,
          openTimePicker: false,
        }))
      }
    >
      <div className="bg-[#525b28] text-white p-2 text-3xl rounded-t-md text-center mb-5">
        <input
          type="text"
          placeholder="Title"
          className="w-full bg-transparent border-none text-white text-center focus:outline-none focus:placeholder-transparent"
          value={state.title}
          onChange={onTitleChange}
        />
      </div>
      <div className="mb-2">
        <textarea
          className="w-full h-125 p-2 bg-gray-100 border resize-none border-gray-300 text-3xl rounded-md focus:placeholder-transparent focus:outline-none"
          value={state.noteSnippet}
          onChange={onNoteSnippetChange}
          placeholder="Write your note here..."
        ></textarea>
      </div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Tags"
          className="w-full p-2 text-2xl bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:placeholder-transparent"
          value={state.tags}
          onChange={onTagsChange}
        />
      </div>
      <div
        className="mb-2 flex items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 border-gray-300 rounded-md">
          {state.openDatePicker && (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                value={state.date}
                onChange={onDateChange}
                open={state.openDatePicker}
                onOpen={() =>
                  setState((prev) => ({ ...prev, openDatePicker: true }))
                }
                onClose={() => {}}
                onAccept={() => {}}
                slotProps={{
                  textField: {
                    size: "small",
                    style: { width: "100%", display: "none", opacity: 0 },
                    InputProps: {
                      style: { paddingLeft: "50px" },
                      endAdornment: null,
                    },
                  },
                  layout: { sx: { alignContent: "center" } },
                  popper: {
                    sx: {
                      left: isBothOpen ? "61% !important" : "65% !important",
                      top: "390px !important",
                    },
                    anchorEl: anchorDivRef.current,
                  },
                }}
              />
            </LocalizationProvider>
          )}

          {state.openTimePicker && (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                value={state.time}
                onChange={onTimeChange}
                open={state.openTimePicker}
                onOpen={() =>
                  setState((prev) => ({ ...prev, openTimePicker: true }))
                }
                onClose={() => {}}
                onAccept={() => {
                  console.log("OK clicked");
                  if (state.openDatePicker && state.openTimePicker) {
                    setState((prev) => ({
                      ...prev,
                      openDatePicker: false,
                      openTimePicker: false,
                    }));
                  } else if (state.openTimePicker) {
                    setState((prev) => ({ ...prev, openTimePicker: false }));
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    style: { width: "100%", display: "none" },
                    InputProps: {
                      style: { paddingLeft: "50px" },
                      endAdornment: null,
                    },
                  },
                  layout: { sx: { alignContent: "center" } },
                  popper: {
                    sx: {
                      "& .MuiPickersLayout-root": {
                        "& .MuiPickersLayout-contentWrapper": {
                          "& .MuiMultiSectionDigitalClockSection-root": {
                            scrollbarWidth: "none",
                            "-ms-overflow-style": "none",
                            "&::-webkit-scrollbar": { display: "none" },
                            height: "200px",
                            padding: "0",
                            display: "flex",
                            flexDirection: "column",
                            "& .MuiMultiSectionDigitalClockSection-item": {
                              scrollBehavior: "smooth",
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "&:focus": { scrollSnapAlign: "center" },
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
                    anchorEl: anchorDivRef.current,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-3 text-center text-3xl rounded-md focus:outline-none focus:border-[#525b28]"
          value={
            state.date.format("MM/DD/YYYY") + " " + state.time.format("hh:mm A")
          }
          onChange={onDateTimeInputChange}
          onClick={() => togglePicker("both")}
        />
        <IconButton onClick={() => togglePicker("date")} className="z-10">
          <CalendarTodayIcon
            color={state.openDatePicker ? "primary" : "inherit"}
          />
        </IconButton>
        <IconButton onClick={() => togglePicker("time")} className="z-10">
          <AccessTimeIcon
            color={state.openTimePicker ? "primary" : "inherit"}
          />
        </IconButton>
      </div>
      <div
        className="flex justify-center gap-4 border-t pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="bg-[#525b28] text-white px-4 py-2 mt-1 text-2xl rounded-md hover:bg-[#525b28]/80 hover:text-white hover:shadow-md"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="bg-[#525b28] text-white px-4 py-2 mt-1 text-2xl rounded-md hover:bg-[#525b28]/80 hover:text-white hover:shadow-md"
          onClick={onSubmitHandler}
        >
          {state.id ? "Save Changes" : "Add Note"}
        </button>
      </div>
    </motion.div>
  );
};

export default NotesForm;
