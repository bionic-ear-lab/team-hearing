import { useParams, useNavigate } from "react-router-dom";
import "../style/MusicExercises.css";

const ExerciseHomepage: React.FC = () => {
  const { exerciseName } = useParams<{ exerciseName: string }>();
  const navigate = useNavigate();

  return (
    <div className="music-exercises-container">
      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate("/music-exercises")}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="music-exercises-title">
          {exerciseName ? decodeURIComponent(exerciseName) : "Exercise"}
        </h2>
      </div>
      <div className="options-buttons">
        <button className="test-button">Test</button>
        <button className="results-button">Results</button>
      </div>
    </div>
  );
};

export default ExerciseHomepage;