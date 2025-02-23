import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import NotesDashboardPage from "../components/notesModule/NotesDashboard";
import AddNoteButton from "../components/notesModule/AddNoteForm";
import MainDashboardPage from "../components/notesModule/MainDashboardPage";
import EditNotePage from "../components/notesModule/EditNoteCard";

function RedirectOnReload() {
  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.location.replace("/"); // Forces reload to /home
    }
  }, []);

  return null; // Doesn't render anything
}
function AppRouter() {
  return (
    <BrowserRouter>
      <RedirectOnReload />
      <Routes>
        <Route path="/" element={<MainDashboardPage />} />
        <Route path="/notes" element={<NotesDashboardPage />} />
        <Route path="/add" element={<AddNoteButton />} />
        <Route path="/edit/:id" element={<EditNotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
