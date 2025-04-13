import React from "react";
import { FormControl, Select, MenuItem, Switch } from "@mui/material";
import { NotesTimelineFilterProps } from "../../TS_INTERFACE/gInterface";

const NotesTimelineFilter: React.FC<NotesTimelineFilterProps> = ({
  interval,
  setInterval,
  selectedAMPM,
  setSelectedAMPM,
  sortOrder,
  setSortOrder,
  is24Hour,
  setIs24Hour,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg ">
      {/* Interval Filter */}
      <div className="mr-5">
        <FormControl size="small">
          <Select
            value={interval}
            MenuProps={{
              disableScrollLock: true, // 👈 disables the scroll lock behavior
            }}
            onChange={(e) =>
              setInterval(e.target.value as "6h" | "12h" | "24h")
            }
          >
            <MenuItem value="6h">6 Hours</MenuItem>
            <MenuItem value="12h">12 Hours</MenuItem>
            <MenuItem value="24h">24 Hours</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* AM/PM Filter */}
      <div className="mr-5">
        <FormControl size="small">
          <Select
            value={selectedAMPM}
            MenuProps={{
              disableScrollLock: true, // 👈 disables the scroll lock behavior
            }}
            onChange={(e) => setSelectedAMPM(e.target.value as "AM" | "PM")}
          >
            <MenuItem value="AM">AM</MenuItem>
            <MenuItem value="PM">PM</MenuItem>
            <MenuItem value="null">None</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Sort Order */}
      <div className="mr-5">
        <FormControl size="small">
          <Select
            value={sortOrder}
            MenuProps={{
              disableScrollLock: true, // 👈 disables the scroll lock behavior
            }}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* 12h/24h Switch */}
      <div className="flex items-center">
        <span className="text-gray-600 mr-2">12H</span>
        <Switch checked={is24Hour} onChange={() => setIs24Hour(!is24Hour)} />
        <span className="text-gray-600 ml-2">24H</span>
      </div>
    </div>
  );
};

export default NotesTimelineFilter;
