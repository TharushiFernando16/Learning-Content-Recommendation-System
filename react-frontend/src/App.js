import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

axios.defaults.withCredentials = true;

function App() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!formData.username || !formData.password) {
      setMessage("Please enter a username and password.");
      return;
    }

    try {
      setMessage("");
      const res = await axios.post("http://localhost:5000/signup", formData);
      setMessage(res.data.message);
      setIsSignup(false);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error signing up.");
    }
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
        setMessage("Please enter a username and password.");
        return;
    }

    try {
        setMessage("");
        const res = await axios.post("http://localhost:5000/login", formData);
        console.log("Login API Response:", res.data);

        if (res.data.user_id) {
            localStorage.setItem("user_id", res.data.user_id); // Storing in localStorage
            localStorage.setItem("username", formData.username);
            navigate("/home");
        } else {
            setMessage("Invalid credentials!");
        }
    } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        setMessage(err.response?.data?.message || "Error logging in.");
    }
};
  return (
    <div className="login-background">
      <div className="container">
        <div className="header">
          <h1>{isSignup ? "Create an Account" : "Welcome Back!"}</h1>
          <p>
            {isSignup
              ? "Join us to get started."
              : "Log in to access your account."}
          </p>
        </div>
        <div className="form">
          <input
            type="text"
            name="username"
            placeholder="Email"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {isSignup ? (
            <button onClick={handleSignup}>Sign Up</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
          {message && <p className="message">{message}</p>}
        </div>
        <div className="footer">
          <p>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Log In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;