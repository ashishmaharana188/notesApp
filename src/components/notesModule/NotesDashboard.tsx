import AddNoteButton from "./AddNoteButton";
import NoteList from "./NotesFilterList";
const NotesDashboardPage = () => {
  return (
    <div>
      <p>Welcome to your Notes Dashboard!</p>
      <div>
        <NoteList />
        <AddNoteButton />
      </div>
    </div>
  );
};
export default NotesDashboardPage;
