import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { useContext, useState } from "react";
import "../style/MusicExercises.css";
import React from "react";
import BaseNoteSelection from "./BaseNoteSelection";

const ExerciseHomepage: React.FC = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showNoteSelection, setShowNoteSelection] = useState(false);

  const handleTestClick = () => {
    if (!user || !user.id) {
      alert("User not logged in");
      return;
    }

    const userId = user.id; // Get userID from logged in user
    if (exerciseName && decodeURIComponent(exerciseName) === "Test Template") {
      navigate("/test-template-test", { state: { userId } });
    } else if (exerciseName && decodeURIComponent(exerciseName) === "Pitch Resolution") {
      // Show the note selection popup instead of navigating
      setShowNoteSelection(true);
    } else {
      alert("No test page configured for this exercise.");
    }
  };

  const handleResultsClick = () => {
    if (!user || !user.id) {
      alert("User not logged in");
      return;
    }

    const userId = user.id;
    if (exerciseName && decodeURIComponent(exerciseName) === "Test Template") {
      // Navigate to test template results page (you'll need to create this)
      navigate("/test-template-results", { state: { userId } });
    } else if (exerciseName && decodeURIComponent(exerciseName) === "Pitch Resolution") {
      navigate("/pitch-resolution-results", { state: { userId } });
    } else {
      alert("No results page configured for this exercise.");
    }
  };

  const handleCloseNoteSelection = () => {
    setShowNoteSelection(false);
  };

  const handleStartTest = (baseNote: number) => {
    setShowNoteSelection(false);
    const userId = user?.id;
    navigate("/pitch-resolution-test", { state: { userId, baseNote } });
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
        <button className="option-button" onClick={handleResultsClick}>Results</button>
      </div>

      <BaseNoteSelection
        isOpen={showNoteSelection}
        onClose={handleCloseNoteSelection}
        onStartTest={handleStartTest}
      />
    </div>
  );
};

export default ExerciseHomepage;