import React, { useState, useEffect, useRef } from "react";
import moment from "moment";

const Timeline = ({ startTime }: { startTime: Date }) => {
  const [timeRange, setTimeRange] = useState({
    start: moment(startTime),
    end: moment(startTime).add(1, "hour"),
  });

  const timelineRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const scrollWidth = e.currentTarget.scrollWidth;
    const clientWidth = e.currentTarget.clientWidth;

    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      setTimeRange((prev) => ({
        start: prev.start.clone().add(15, "minutes"),
        end: prev.end.clone().add(15, "minutes"),
      }));
    } else if (scrollLeft <= 50) {
      setTimeRange((prev) => ({
        start: prev.start.clone().subtract(15, "minutes"),
        end: prev.end.clone().subtract(15, "minutes"),
      }));
    }
  };

  const generateTimeIntervals = () => {
    const intervals = [];
    let currentTime = timeRange.start.clone();

    while (currentTime.isBefore(timeRange.end)) {
      intervals.push(currentTime.format("HH:mm"));
      currentTime.add(15, "minutes");
    }

    return intervals;
  };

  return (
    <div className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <div
        className="flex space-x-4 overflow-x-auto p-2"
        onScroll={handleScroll}
        ref={timelineRef}
      >
        {generateTimeIntervals().map((time, index) => (
          <div
            key={index}
            className="px-4 py-2 border border-gray-300 bg-gray-200 rounded-lg text-center text-sm font-semibold"
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
