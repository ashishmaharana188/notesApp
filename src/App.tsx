import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NotesDashboardPage from "./components/notesModule/NotesDashboard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/notes-dashboard">Go to Notes Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/notes-dashboard" element={<NotesDashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
