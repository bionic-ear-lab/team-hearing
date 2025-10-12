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

  // Use this to make the test adaptive
  const [minGap, setMinGap] = useState(30);

  const randomInRange = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const createQuestion = (minGap: number) => {
    const minNoteNumber = -37;
    const maxNoteNumber = 37;

    let n1 = randomInRange(minNoteNumber, maxNoteNumber);
    let n2 = randomInRange(minNoteNumber, maxNoteNumber);
    while (Math.abs(n2 - n1) < minGap) {
      n2 = randomInRange(minNoteNumber, maxNoteNumber);
    }

    const button1GetsFirst = Math.random() < 0.5;
    const noteA = button1GetsFirst ? n1 : n2;
    const noteB = button1GetsFirst ? n2 : n1;
    const higherButton = noteA > noteB ? 1 : 2;

    return { noteA, noteB, higherButton };
  };

  const setQuestion = () => {
    const { noteA, noteB, higherButton } = createQuestion(minGap);
    setNote1(noteA);
    setNote2(noteB);
    setHigherNoteButton(higherButton);
  };

  const tryPlayNotes = async (n1: number, n2: number) => {
    await playPianoNote(n1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await playPianoNote(n2);
  };

  const playNotes = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    let success = false;
    let attempts = 0;
    let attemptsLimit = 10;

    while (!success && attempts < attemptsLimit) {
      attempts++;
      try {
        await tryPlayNotes(note1, note2);
        success = true;
      } catch (error) {
        console.warn(`Attempt ${attempts}: missing audio file(s), regenerating question.`);
        setQuestion();
        await new Promise(resolve => setTimeout(resolve, 100)); // small delay before retry
      }
    }

    if (!success) {
      console.error("Failed to find valid audio files after multiple attempts.");
    }

    setIsPlaying(false);
  };

  // initialize first question
  useEffect(() => {
    setQuestion();
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

  const handleAnswer = async (buttonClicked: number) => {
    if (isPlaying || buttonStates[0] !== "normal" || buttonStates[1] !== "normal") return;

    const isCorrect = (buttonClicked + 1) === higherNoteButton;

    if (isCorrect) {
      correct(buttonClicked);
    } else { // incorrect
      incorrect(buttonClicked);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for animation to finish
    setQuestion(); // new question
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
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
