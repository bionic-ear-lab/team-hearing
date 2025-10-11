import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/MusicExercises.css";
import { playPianoNote } from '../api/audio';

const PitchResolutionTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const numberOfAttempts = 5;
  const [numberOfAttemptsLeft, setNumberOfAttemptsLeft] = useState(5);
  const [showPopup, setShowPopup] = useState(true);
  
  const buttonOptions = ["1", "2"];
  const numberOfButtons = buttonOptions.length;
  const [buttonStates, setButtonStates] = useState<("normal" | "correct" | "incorrect")[]>(
    Array(numberOfButtons).fill("normal")
  );

  const [isPlaying, setIsPlaying] = useState(false);

  const [newQuestion, setNewQuestion] = useState(false);

  const [note1, setNote1] = useState(0);
  const [note2, setNote2] = useState(0);
  const [higherNoteButton, setHigherNoteButton] = useState<1 | 2>(1);

  const testName = location.state?.testName || "Pitch Resolution Test";
  const question = location.state?.question || "Which note is higher in pitch?";

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );

  const generateQuestion = () => {
    // I think this function will have to change a lot when we implement the semitone stuff so please change everything if u need
    const minGap = 1;
    const maxGap = 7;
    const minNoteNumber = 12;
    const maxNoteNumber = 108;

    const lowerNote = minNoteNumber + Math.floor(Math.random() * ((maxNoteNumber - maxGap) - minNoteNumber + 1));
    const gap = minGap + Math.floor(Math.random() * (maxGap - minGap + 1));
    const higherNote = lowerNote + gap;

    const higherIsButton1 = Math.random() < 0.5; // randomly assigning which button plays which note
    if (higherIsButton1) {
      setNote1(higherNote);
      setNote2(lowerNote);
      setHigherNoteButton(1);
    } else {
      setNote1(lowerNote);
      setNote2(higherNote);
      setHigherNoteButton(2);
    }
  }

  const playNotes = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playPianoNote(note1);
    await new Promise(resolve => setTimeout(resolve, 1000)); // pause between notes
    playPianoNote(note2);
    setIsPlaying(false);
  }

  // initialize first question
  useEffect(() => {
    generateQuestion();
  }, []);

  // play first question when popup closes
  useEffect(() => {
    if (!showPopup && note1 && note2) {
      playNotes();
    }
  }, [showPopup]);

  // play new question when there is a new question
  useEffect(() => {
    if (newQuestion && note1 && note2) {
      playNotes();
      setNewQuestion(false);
    }
  }, [newQuestion, note1, note2]);

  const handleRepeat = () => {
    playNotes();
  };

  const handleAnswer = async (buttonClicked : number) => {
    if (isPlaying || buttonStates[0] !== "normal" || buttonStates[1] !== "normal") return;
    
    const isCorrect = (buttonClicked + 1) === higherNoteButton;
    
    if (isCorrect) {
      correct(buttonClicked);
    } else { // incorrect
      incorrect(buttonClicked);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for animation to finish
    generateQuestion(); // new question
    setNewQuestion(true); // play new question!!
  };

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
        <button className="repeat-button" onClick={handleRepeat} disabled={isPlaying} >Repeat</button>
      </div>
      <div className={`options-buttons buttons-${numberOfButtons}`}>
        {buttonOptions.map((buttonText, i) => (
          <button
            key={i}
            className={`option-button ${buttonStates[i]}`}
            onClick={() => handleAnswer(i)} 
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

export default PitchResolutionTest;