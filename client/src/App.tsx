import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Tickets } from "./pages/Tickets";
import { Admin } from "./pages/Admin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;