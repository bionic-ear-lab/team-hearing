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
      console.log("Signup response:", response);  
      console.log("User ID:", response.id, "Type:", typeof response.id);  

      // Store the ID as a string
      localStorage.setItem('authToken', String(response.id));  
      console.log("Stored token:", localStorage.getItem('authToken')); 

      setUser(response);
      alert("Signup successful!");
      navigate("/homepage");
    } catch (err) {
      console.error("Signup error:", err);  
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
        <div className="password-input-container">
          <input
            className="signup-input password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-button"
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {(passwordFocused || password) && (
          <div className="password-requirements">
            <p className="password-requirements-title">
              Password Requirements:
            </p>
            <div className="password-requirements-list">
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
          <div className={`password-match-indicator ${doPasswordsMatch() ? 'match' : 'no-match'}`}>
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
        <p className="login-link-text">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="login-link-span"
          >
            Log In!
          </span>
        </p>
        <button
          className={`signup-button ${(!isPasswordValid() || !doPasswordsMatch()) ? 'disabled' : ''}`}
          onClick={handleSignup}
          disabled={!isPasswordValid() || !doPasswordsMatch()}
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
    <div className={`password-requirement ${met ? 'met' : 'not-met'}`}>
      <span className="password-requirement-icon">
        {met ? "✓" : "○"}
      </span>
      <span className={`password-requirement-text ${met ? 'met' : ''}`}>
        {text}
      </span>
    </div>
  );
}