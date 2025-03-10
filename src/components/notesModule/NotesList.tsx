import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../../TS_INTERFACE/gInterface";
import NoteCard from "./NotesCard";

// Function to convert tags (text) into a numerical severity level
const convertTagsToSeverity = (tags: string): number => {
  const severityMap: { [key: string]: number } = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return severityMap[tags.toLowerCase()] || 1; // Default to 1 if unknown tag
};

const NoteList = () => {
  const notes = useSelector((state: RootState) => state.notes || []);

  // Transform notes into scatter plot data points
  const data = notes.map((note: any) => ({
    x: new Date(note.date).getTime(), // Extract time from date
    y: convertTagsToSeverity(note.tags || "low"), // Convert tags to severity
    note, // Store the whole note object
  }));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ScatterChart>
        {/* X-Axis (Time) */}
        <XAxis
          type="number"
          dataKey="x"
          domain={["auto", "auto"]}
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} // Format time
          name="Time"
        />

        {/* Y-Axis (Severity Level) */}
        <YAxis
          type="number"
          dataKey="y"
          name="Severity"
          ticks={[1, 2, 3, 4]} // Define fixed severity levels
          tickFormatter={(tick) =>
            ["Low", "Medium", "High", "Critical"][tick - 1]
          } // Label severity
        />

        {/* Scatter Points */}
        <Scatter data={data} fill="blue" />

        {/* Custom Tooltip to show NoteCard */}
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const note = payload[0].payload.note;
              return <NoteCard note={note} />;
            }
            return null;
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default NoteList;
