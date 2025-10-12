import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import "../style/SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    if (!birthdate || !gender || !username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await signup(username, email, password, birthdate, gender);
      localStorage.setItem('authToken', response.id); // Store user ID as token
      setUser(response); // Update context with user data
      alert("Signup successful!");
      navigate("/homepage");
    } catch (err) {
      alert("Signup failed: " + (err as Error).message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="signup-box">
        <input
          className="signup-input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="signup-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          className="signup-input"
          type="date"
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
        />
        <select
          className="signup-input"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer-not-to-say">Prefer Not to Say</option>
        </select>
        <p className="login-link" style={{ color: "black" }}>
        Already have an account? <span onClick={() => navigate("/login")} style={{ textDecoration: "underline", cursor: "pointer", color: "#000000ff" }}>Log In!</span>
        </p>
        <button className="signup-button" onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
}