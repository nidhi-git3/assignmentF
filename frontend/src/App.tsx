import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
import AdminPage from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
