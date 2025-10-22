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
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await login(username, password);
      console.log("Login response:", response);  
      console.log("User ID:", response.id, "Type:", typeof response.id);  

      // Store the ID as a string
      localStorage.setItem('authToken', String(response.id));  
      console.log("Stored token:", localStorage.getItem('authToken')); 

      setUser(response);
      alert("Login successful!");
      navigate("/homepage");
    } catch (err) {
      console.error("Login error:", err);
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
        <p className="login-link">
          Don't have an account? <span className="login-link-action" onClick={() => navigate("/signup")}>Sign Up!</span>
        </p>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}