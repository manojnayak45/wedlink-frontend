import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";
import AddEventPage from "./pages/AddEventPage";

// 🛡️ Wrapper for checking auth before rendering nested routes
function ProtectedLayout() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-6">Checking authentication...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected routes with layout */}
        <Route element={<ProtectedLayout />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/add-event" element={<AddEventPage />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
