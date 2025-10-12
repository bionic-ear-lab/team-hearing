import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/MusicExercises.css";
import { playPianoNote } from '../api/audio';
import { saveTestResult } from '../api/testResults';

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
  const [isSaving, setIsSaving] = useState(false);

  const [note1, setNote1] = useState(0);
  const [note2, setNote2] = useState(0);
  const [higherNoteButton, setHigherNoteButton] = useState<1 | 2>(1);

  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [firstWrongAnswerGap, setFirstWrongAnswerGap] = useState<number | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);

  const testName = location.state?.testName || "Pitch Resolution Test";
  const question = location.state?.question || "Which note is higher in pitch?";
  const userId = location.state?.userId;

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );

  const generateQuestion = () => {
    const minGap = 1;
    const maxGap = 7;
    const minNoteNumber = 12;
    const maxNoteNumber = 108;

    const lowerNote = minNoteNumber + Math.floor(Math.random() * ((maxNoteNumber - maxGap) - minNoteNumber + 1));
    const gap = minGap + Math.floor(Math.random() * (maxGap - minGap + 1));
    const higherNote = lowerNote + gap;

    const higherIsButton1 = Math.random() < 0.5;
    if (higherIsButton1) {
      setNote1(higherNote);
      setNote2(lowerNote);
      setHigherNoteButton(1);
    } else {
      setNote1(lowerNote);
      setNote2(higherNote);
      setHigherNoteButton(2);
    }

    return gap;
  }

  const playNotes = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playPianoNote(note1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    playPianoNote(note2);
    setIsPlaying(false);
  }

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (!showPopup && note1 && note2) {
      playNotes();
    }
  }, [showPopup]);

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
    } else {
      incorrect(buttonClicked);
      if (firstWrongAnswerGap === null) {
        // sets gap
        setFirstWrongAnswerGap(note1 > note2 ? note1 - note2 : note2 - note1);
      }
      setWrongAnswers(prev => [...prev, questionNumber]);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setQuestionNumber(prev => prev + 1);
    generateQuestion();
    setNewQuestion(true);
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

  // test completion
  const handleEndTest = async () => {
    setIsSaving(true);
    
    // Use first wrong answer gap
    const gap = firstWrongAnswerGap ?? 0;

    // Only save if userId is available
    if (userId) {
      try {
        await saveTestResult({
          userId,
          testType: testName,
          gap,
          wrongAnswers,
        });
        console.log('Test result saved successfully');
      } catch (error) {
        console.error('Failed to save test result:', error);
      }
    } else {
      console.warn('No userId provided - test result not saved');
    }

    setIsSaving(false);
    navigate(-1);
  };

  const testOver = numberOfAttemptsLeft === 0;

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

      {/* Test completion popup */}
      {testOver && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Test Complete!</h3>
            <p>Wrong answers: {wrongAnswers.length}</p>
            <p>First wrong answer gap: {firstWrongAnswerGap ?? 'No mistakes!'}</p>
            <button onClick={handleEndTest} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Finish'}
            </button>
          </div>
        </div>
      )}

      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          disabled={testOver}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="music-exercises-title" style={{ margin: 0 }}>{question}</h2>
        <button className="repeat-button" onClick={handleRepeat} disabled={isPlaying || testOver}>Repeat</button>
      </div>

      <div className={`options-buttons buttons-${numberOfButtons}`}>
        {buttonOptions.map((buttonText, i) => (
          <button
            key={i}
            className={`option-button ${buttonStates[i]}`}
            onClick={() => handleAnswer(i)}
            disabled={testOver}
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