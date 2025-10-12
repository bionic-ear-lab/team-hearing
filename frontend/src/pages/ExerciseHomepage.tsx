import { useParams, useNavigate } from "react-router-dom";
import "../style/MusicExercises.css";
import React from "react";

const ExerciseHomepage: React.FC = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();

  const handleTestClick = () => {
    if (exerciseName && decodeURIComponent(exerciseName) === "Test Template") {
      navigate("/test-template-test");
    } else if (exerciseName && decodeURIComponent(exerciseName) === "Pitch Resolution") {
      navigate("/pitch-resolution-test");
    } else {
      // Add more conditions for other exercises as needed
      alert("No test page configured for this exercise.");
    }
  };

  return (
    <div className="music-exercises-container">
      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate("/music-exercises")}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="music-exercises-title">
          {exerciseName ? decodeURIComponent(exerciseName) : "Exercise"}
        </h2>
      </div>
      <div className="options-buttons buttons-2">
        <button className="option-button" onClick={handleTestClick}>Test</button>
        <button className="option-button">Results</button>
      </div>
    </div>
  );
};

export default ExerciseHomepage;