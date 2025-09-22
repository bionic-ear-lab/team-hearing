import React, { useState } from "react";
import { signup } from "../api/auth";

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
    <div>
      <h2>Signup</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
