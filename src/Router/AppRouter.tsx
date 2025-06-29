import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import NotesDashboardPage from "../components/notesModule/NotesDashboard";
import NotesList from "../components/notesModule/NotesList";
import AddNoteButton from "../components/notesModule/AddNoteForm";
import MainDashboardPage from "../components/notesModule/MainDashboardPage";
import EditNotePage from "../components/notesModule/EditNoteCard";

const AttendanceDashboard = () => (
  <div className="p-4">
    <h2 className="mt-100 ml-350 text-7xl font-bold">Attendance Dashboard</h2>
    <p className="text-2xl ml-350 font-bold">
      This is the Attendance Dashboard (placeholder).
    </p>
  </div>
);

function RedirectOnReload() {
  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.location.replace("/");
    }
  }, []);

  return null;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <RedirectOnReload />
      <Routes>
        <Route path="/" element={<MainDashboardPage />}>
          <Route
            index
            element={
              <div className="mt-100 ml-400 p-4 flex flex-col">
                <p className="text-8xl font-bold text-black-200 break-words mt-2">
                  Version 1.0
                </p>
                <p className="text-end text-4xl font-bold text-black-200 font-bold break-words">
                  Files Draw
                </p>
              </div>
            }
          />
          <Route path="notes">
            <Route index element={<NotesDashboardPage />} />
            <Route path="timeline" element={<NotesDashboardPage />} />
            <Route path="list" element={<NotesList />} />
          </Route>
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="add" element={<AddNoteButton />} />
          <Route path="edit/:id" element={<EditNotePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
