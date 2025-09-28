import React from 'react';
import '../style/Homepage.css';

const Homepage: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked`);
    // Add navigation logic here later
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