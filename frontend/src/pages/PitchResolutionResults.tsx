import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/MusicExercises.css';

const PitchResolutionResults: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="music-exercises-container">
      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate('/exercise/Pitch%20Resolution')}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="music-exercises-title">
          Pitch Resolution Test Results
        </h2>
      </div>
    </div>
  );
};

export default PitchResolutionResults;