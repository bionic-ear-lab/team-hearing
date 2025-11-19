import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Homepage.css';

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === 'Music Exercises') {
      navigate('/music-exercises');
    } else {
      console.log(`${buttonName} button clicked`);
    }
  };

  return (
    <div className="homepage-container">
      <div className="button-grid">
        <div className="top-row">
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Audiometry')}
            disabled
          >
            Audiometry
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Environmental Sounds')}
            disabled
          >
            Environmental Sounds
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Music Exercises')}
          >
            Music Exercises
          </button>
        </div>
        <div className="bottom-row">
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Psychophysics')}
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Psychophysics
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Seeing and Hearing Speech')}
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Seeing and Hearing Speech
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Speech Recognition')}
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Speech Recognition
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;