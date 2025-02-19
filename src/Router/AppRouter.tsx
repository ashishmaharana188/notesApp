import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/header/HeaderPage";
import NotesDashboardPage from "../components/notesModule/NotesDashboard";

function AppRouter() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/notes" element={<NotesDashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
