import AddNoteButton from "./AddNoteButton";
import NoteList from "./NotesList";
import "../../styles/components/notesModule/NoteDashboard.css";
const NotesDashboardPage = () => {
  return (
    <div>
      <p className="noteDashboard-intro">Welcome to your Notes Dashboard!</p>
      <div>
        <NoteList />
        <AddNoteButton />
      </div>
    </div>
  );
};
export default NotesDashboardPage;
