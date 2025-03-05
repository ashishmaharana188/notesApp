import AddNoteButton from "./AddNoteButton";
import NoteList from "./NotesList";
import "../../styles/components/notesModule/NoteDashboard.css";
const NotesDashboardPage = () => {
  return (
    <div>
      <p className="mt-10 ml-250 text-[3rem]">Dashboard!</p>
      <div>
        <NoteList />
        <AddNoteButton />
      </div>
    </div>
  );
};
export default NotesDashboardPage;
