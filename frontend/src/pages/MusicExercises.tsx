import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/MusicExercises.css";

const MusicExercises: React.FC = () => {
  const navigate = useNavigate();

  const handleExerciseClick = (exerciseName: string) => {
    navigate(`/exercise/${encodeURIComponent(exerciseName)}`);
  };

  return (
    <div className="music-exercises-container">
      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate("/homepage")}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="music-exercises-title">Music Exercises</h2>
      </div>
      <div className="music-exercises-buttons">
        <button
          className="music-exercise-button"
          onClick={() => handleExerciseClick("Pitch Resolution")}
        >
          Pitch Resolution
        </button>
        <button
          className="music-exercise-button"
          onClick={() => handleExerciseClick("Test Template")}
        >
          Test Template
        </button>
        {/* Add more buttons here as needed */}
      </div>
    </div>
  );
};

export default MusicExercises;