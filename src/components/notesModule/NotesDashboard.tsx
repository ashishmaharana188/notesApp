import NoteCard from "./NotesForm";

const NotesDashboardPage = () => {
  return (
    <div>
      <p>Welcome to your Notes Dashboard!</p>
      <div>
        <h1>
          <NoteCard />
        </h1>
      </div>
    </div>
  );
};
export default NotesDashboardPage;
