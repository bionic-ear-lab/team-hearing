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
            <div>
              <div>Audiometry</div>
              <div className="coming-soon">Coming soon...</div>
            </div>
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Environmental Sounds')}
            disabled
          >
            <div>
            <div>Environmental Sounds</div>
            <div className="coming-soon">Coming soon...</div>
            </div>
            
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
          >
            <div>
            <div>Psychophysics</div>
            <div className="coming-soon">Coming soon...</div>
            </div>
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Seeing and Hearing Speech')}
            disabled
          >
            <div>
            <div>Seeing and Hearing Speech</div>
            <div className="coming-soon">Coming soon...</div>
            </div>
          </button>
          <button
            className="exercise-button"
            onClick={() => handleButtonClick('Speech Recognition')}
            disabled
          >
            <div>
            <div>Speech Recognition</div>
            <div className="coming-soon">Coming soon...</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;