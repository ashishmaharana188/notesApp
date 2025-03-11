import { useSelector } from "react-redux";
import { RootState } from "../../TS_INTERFACE/gInterface";
import NoteCard from "./NotesCard";
import { ResponsiveContainer } from "recharts";

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

const NoteCardPlot = () => {
  const notes = useSelector((state: RootState) => state.notes || []);

  // Transform notes into data points
  const data = notes.map((note: any) => ({
    x: new Date(note.date).getTime(), // Extract time from date
    y: convertTagsToSeverity(note.tags || "low"), // Convert tags to severity
    note, // Store the whole note object
  }));

  // Find the earliest note date to use as the starting point
  const earliestDate = Math.min(...data.map((point) => point.x));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {data.map((point, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${
                ((point.x - earliestDate) / (Date.now() - earliestDate)) * 100
              }%`, // Scale x position
              bottom: `${(point.y / 4) * 100}%`, // Scale y position (assuming max severity is 4)
              transform: "translate(-50%, 0)", // Center the card
            }}
          >
            <NoteCard note={point.note} />
          </div>
        ))}
      </div>
    </ResponsiveContainer>
  );
};

export default NoteCardPlot;
