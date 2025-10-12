import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import "../style/LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // Get setUser from context

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const user = await login(username, password); // Returns User object
      setUser(user); // Save user to context
      localStorage.setItem('authToken', JSON.stringify(user)); 
      alert("Login successful");
      navigate("/homepage");
    } catch (err) {
      alert("Login failed: " + (err as Error).message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-box">
        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <p className="login-link" style={{ color: "black" }}>
        Don't have an account? <span onClick={() => navigate("/signup")} style={{ textDecoration: "underline", cursor: "pointer", color: "#000000ff" }}>Sign Up!</span>
        </p>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}