import React, { useState } from "react";
import { signup } from "../api/auth";
import "../style/SignupPage.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const user = await signup(username, email, password);
      alert("Signup successful: " + JSON.stringify(user));
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
        <button className="signup-button" onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
}