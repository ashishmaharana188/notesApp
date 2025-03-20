import React from "react";
import { TimelineFilterProps } from "./../../TS_INTERFACE/gInterface";

const TimelineFilter: React.FC<TimelineFilterProps> = ({
  onIntervalChange,
  onSortOrderChange,
  onAMPMChange,
  currentInterval,
  currentSortOrder,
  currentAMPM,
}) => {
  return (
    <div className="timeline-filter">
      <div>
        <label>
          Interval:
          <select
            value={currentInterval}
            onChange={(e) =>
              onIntervalChange(e.target.value as "6h" | "12h" | "24h")
            }
          >
            <option value="6h">6 Hour</option>
            <option value="12h">12 Hour</option>
            <option value="24h">24 Hour</option>
          </select>
        </label>
        <label>
          Sort Order:
          <select
            value={currentSortOrder}
            onChange={(e) =>
              onSortOrderChange(e.target.value as "asc" | "desc")
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        {currentInterval === "12h" && (
          <label>
            AM/PM:
            <select
              value={currentAMPM}
              onChange={(e) => onAMPMChange(e.target.value as "AM" | "PM")}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </label>
        )}
      </div>
    </div>
  );
};

export default TimelineFilter;
