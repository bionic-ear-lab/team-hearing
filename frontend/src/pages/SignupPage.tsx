
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    noSpaces: true
  });

  // Validate password in real-time
  const validatePassword = (pwd: string) => {
    setPasswordValidation({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      noSpaces: !/\s/.test(pwd)
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  // Check if password is valid
  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(v => v === true);
  };

  // Check if passwords match
  const doPasswordsMatch = () => {
    return password === confirmPassword && confirmPassword !== "";
  };

  const handleSignup = async () => {
    // Validation checks
    if (!username || !email || !password || !birthdate || !gender) {
      alert("Please fill in all fields");
      return;
    }

    if (!isPasswordValid()) {
      alert("Please ensure your password meets all security requirements");
      return;
    }

    if (!doPasswordsMatch()) {
      alert("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await signup(username, email, password, birthdate, gender);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      setUser(response);
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
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        
        {/* Password input with show/hide toggle */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            className="signup-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* Password strength indicator */}
        {(passwordFocused || password) && (
          <div className="password-requirements" style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "8px",
            fontSize: "13px"
          }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#495057" }}>
              Password Requirements:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <PasswordRequirement
                met={passwordValidation.minLength}
                text="At least 8 characters"
              />
              <PasswordRequirement
                met={passwordValidation.hasUpperCase}
                text="One uppercase letter (A-Z)"
              />
              <PasswordRequirement
                met={passwordValidation.hasLowerCase}
                text="One lowercase letter (a-z)"
              />
              <PasswordRequirement
                met={passwordValidation.hasNumber}
                text="One number (0-9)"
              />
              <PasswordRequirement
                met={passwordValidation.hasSpecialChar}
                text="One special character (!@#$%^&*)"
              />
              <PasswordRequirement
                met={passwordValidation.noSpaces}
                text="No spaces"
              />
            </div>
          </div>
        )}

        {/* Confirm password */}
        <input
          className="signup-input"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        {/* Password match indicator */}
        {confirmPassword && (
          <div style={{
            fontSize: "13px",
            marginTop: "4px",
            color: doPasswordsMatch() ? "#28a745" : "#dc3545"
          }}>
            {doPasswordsMatch() ? "✓ Passwords match" : "✗ Passwords do not match"}
          </div>
        )}

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
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <p className="login-link" style={{ color: "black" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "#000000ff"
            }}
          >
            Log In!
          </span>
        </p>
        <button
          className="signup-button"
          onClick={handleSignup}
          disabled={!isPasswordValid() || !doPasswordsMatch()}
          style={{
            opacity: (!isPasswordValid() || !doPasswordsMatch()) ? 0.6 : 1,
            cursor: (!isPasswordValid() || !doPasswordsMatch()) ? "not-allowed" : "pointer"
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

// Helper component for password requirements
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: met ? "#28a745" : "#6c757d"
    }}>
      <span style={{ fontSize: "16px" }}>
        {met ? "✓" : "○"}
      </span>
      <span style={{ textDecoration: met ? "line-through" : "none" }}>
        {text}
      </span>
    </div>
  );
}