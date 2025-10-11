import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/MusicExercises.css";

const TestTemplateTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const numberOfAttempts = 5;
  const [numberOfAttemptsLeft, setNumberOfAttemptsLeft] = useState(5);
  const [showPopup, setShowPopup] = useState(true);

  // Configurable button options array
  const buttonOptions = ["1", "2"];
  const numberOfButtons = buttonOptions.length; 

  const [buttonStates, setButtonStates] = useState<("normal" | "correct" | "incorrect")[]>(
    Array(numberOfButtons).fill("normal")
  );

  const testName = location.state?.testName || "Test Template";
  const question = location.state?.question || "Which option is correct?";

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );

  const correct = (buttonIndex: number) => {
    const newStates = [...buttonStates];
    newStates[buttonIndex] = "correct";
    setButtonStates(newStates);
    
    setTimeout(() => {
      setButtonStates(prevStates => {
        const resetStates = [...prevStates];
        resetStates[buttonIndex] = "normal";
        return resetStates;
      });
    }, 1000);
  };

  const incorrect = (buttonIndex: number) => {
    const newStates = [...buttonStates];
    newStates[buttonIndex] = "incorrect";
    setButtonStates(newStates);
    
    setTimeout(() => {
      setButtonStates(prevStates => {
        const resetStates = [...prevStates];
        resetStates[buttonIndex] = "normal";
        return resetStates;
      });
    }, 1000);
    
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
      <div className={`options-buttons buttons-${numberOfButtons}`}>
        {buttonOptions.map((buttonText, i) => (
          <button
            key={i}
            className={`option-button ${buttonStates[i]}`}
            onClick={() => i === 0 ? correct(i) : incorrect(i)} 
          >
            {buttonText}
          </button>
        ))}
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