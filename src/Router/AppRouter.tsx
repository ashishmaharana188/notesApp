import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/header/HeaderPage";
import NotesDashboardPage from "../components/notesModule/NotesDashboard";
import AddNoteButton from "../components/notesModule/AddNoteButton";

function AppRouter() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/notes" element={<NotesDashboardPage />} />
          <Route path="/add" element="" />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
