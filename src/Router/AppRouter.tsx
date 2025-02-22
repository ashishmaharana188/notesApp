import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import NotesDashboardPage from "../components/notesModule/NotesDashboard";
import AddNoteButton from "../components/notesModule/AddNoteForm";
import MainDashboardPage from "../components/notesModule/MainDashboardPage";

function RedirectOnReload() {
  useEffect(() => {
    if (window.location.pathname !== "/home") {
      window.location.replace("/home"); // Forces reload to /home
    }
  }, []);

  return null; // Doesn't render anything
}
function AppRouter() {
  return (
    <BrowserRouter>
      <RedirectOnReload />
      <Routes>
        <Route path="/home" element={<MainDashboardPage />} />
        <Route path="/notes" element={<NotesDashboardPage />} />
        <Route path="/add" element={<AddNoteButton />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
