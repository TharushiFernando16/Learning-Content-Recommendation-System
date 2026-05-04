import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Profile from "./Profile";
import Recommendations from "./Recommendations";
import Results from "./Results";
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/recommendations" element={<ProtectedRoute element={<Recommendations />} />} />
        <Route path="/results" element={<ProtectedRoute element={<Results />} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
