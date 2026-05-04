import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Recomandations</h1>
      <ul className="navbar-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/results">Results</Link></li>
            <li><Link to="/recommendations">Recommendations</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
