import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import NotesDashboardPage from "../components/notesModule/NotesDashboard";
import NotesList from "../components/notesModule/NotesList";
import AddNoteButton from "../components/notesModule/AddNoteForm";
import MainDashboardPage from "../components/notesModule/MainDashboardPage";
import EditNotePage from "../components/notesModule/EditNoteCard";

const AttendanceDashboard = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold">Attendance Dashboard</h2>
    <p>This is the Attendance Dashboard (placeholder).</p>
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
              <div className="p-4 flex flex-col items-center">
                <p className="text-4xl text-gray-500 font-bold break-words text-center">
                  Welcome to EMP_TOOLS
                </p>
                <p className="text-9xl text-gray-500 break-words text-center mt-2">
                  Version 1.0
                </p>
              </div>
            }
          />
          <Route path="notes">
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
