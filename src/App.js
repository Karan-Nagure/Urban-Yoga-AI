import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { YogaProvider } from "./YogaContext";
import { AuthProvider, useAuth } from "./AuthContext";

import Home       from "./pages/Home/Home";
import Yoga       from "./pages/Yoga/Yoga";
import YogaCanvas from "./pages/Yoga/YogaCanvas";
import About      from "./pages/About/About";
import Tutorials  from "./pages/Tutorials/Tutorials";
import Login      from "./pages/Auth/Login";
import Register   from "./pages/Auth/Register";
import Profile    from "./pages/Profile/Profile";

import "./App.css";

// Redirect to /login if not authenticated
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <YogaProvider>
        <Router>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/start"       element={<Protected><Yoga /></Protected>} />
            <Route path="/yoga"        element={<Protected><YogaCanvas /></Protected>} />
            <Route path="/about"       element={<About />} />
            <Route path="/tutorials"   element={<Tutorials />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/profile"     element={<Protected><Profile /></Protected>} />
            <Route path="/profile/edit" element={<Protected><Profile /></Protected>} />
          </Routes>
        </Router>
      </YogaProvider>
    </AuthProvider>
  );
}
