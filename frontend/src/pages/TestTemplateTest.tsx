import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/MusicExercises.css";

const TestTemplateTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const numberOfAttempts = 5;
  const [numberOfAttemptsLeft, setNumberOfAttemptsLeft] = useState(5);
  const [showPopup, setShowPopup] = useState(true);

  const [button1State, setButton1State] = useState<"normal" | "correct" | "incorrect">("normal");
  const [button2State, setButton2State] = useState<"normal" | "correct" | "incorrect">("normal");

  const testName = location.state?.testName || "Test Template";
  const question = location.state?.question || "Which option is correct?";

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );

  const correct = (button: "button1" | "button2") => {
    if (button === "button1") {
      setButton1State("correct");
      setTimeout(() => setButton1State("normal"), 1000);
    } else if (button === "button2") {
      setButton2State("correct");
      setTimeout(() => setButton2State("normal"), 1000);
    }
  };

  const incorrect = (button: "button1" | "button2") => {
    if (button === "button1") {
      setButton1State("incorrect");
      setTimeout(() => setButton1State("normal"), 1000);
    } else if (button === "button2") {
      setButton2State("incorrect");
      setTimeout(() => setButton2State("normal"), 1000);
    }
    setNumberOfAttemptsLeft((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="music-exercises-container">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{testName}</h3>
            <p>{question}</p>
            <button onClick={() => setShowPopup(false)}>Start</button>
          </div>
        </div>
      )}
      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="music-exercises-title" style={{ margin: 0 }}>{question}</h2>
        <button className="repeat-button">Repeat</button>
      </div>
      <div className="options-buttons">
        <button
          className={`button1 ${button1State}`}
          onClick={() => correct("button1")}
        >
          1
        </button>
        <button
          className={`button2 ${button2State}`}
          onClick={() => incorrect("button2")}
        >
          2
        </button>
      </div>
      <div className="hearts-row">
        {hearts.map((heart, idx) => (
          <span key={idx}>{heart}</span>
        ))}
      </div>
    </div>
  );
};

export default TestTemplateTest;