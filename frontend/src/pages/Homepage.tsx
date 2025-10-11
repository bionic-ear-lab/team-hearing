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
          >
            Audiometry
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Environmental Sounds')}
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
          >
            Psychophysics
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Seeing and Hearing Speech')}
          >
            Seeing and Hearing Speech
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Speech Recognition')}
          >
            Speech Recognition
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;