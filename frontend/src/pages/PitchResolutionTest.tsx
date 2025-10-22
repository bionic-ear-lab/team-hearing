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
  const [currentSemitoneGap, setCurrentSemitoneGap] = useState(0.0);

  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [firstWrongAnswerGap, setFirstWrongAnswerGap] = useState<number | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);

  // Add new state to track answers for each question
  const [questionResults, setQuestionResults] = useState<Array<{
    questionNumber: number;
    isCorrect: boolean;
    semitoneGap: number;
  }>>([]);

  const testName = location.state?.testName || "Pitch Resolution Test";
  const question = location.state?.question || "Which note is higher in pitch?";
  const userId = location.state?.userId;

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );


  // CHOOSING NOTES

  const DEFAULT_INDEX = 34; // 8 semitones
  const [pitchIndex, setPitchIndex] = useState(DEFAULT_INDEX);

  const randomDirection = () => (Math.random() < 0.5 ? 1 : -1);

  const createQuestion = (index: number) => {
    const direction = randomDirection();
    const n1 = 0;
    const n2 = direction * index;

    const button1GetsFirst = Math.random() < 0.5;
    const noteA = button1GetsFirst ? n1 : n2;
    const noteB = button1GetsFirst ? n2 : n1;
    const higherButton: 1 | 2 = noteA > noteB ? 1 : 2;
    const gap = index;

    return { noteA, noteB, higherButton, gap };
  };

  const setQuestion = () => {
    const { noteA, noteB, higherButton, gap } = createQuestion(pitchIndex);
    setNote1(noteA);
    setNote2(noteB);
    setHigherNoteButton(higherButton);

    const semitone_gap = Math.pow(2, -8 + (gap - 1) / 3);
    setCurrentSemitoneGap(semitone_gap);
  };


  // PLAYING NOTES

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
    const MAX_AUDIO_RETRY_ATTEMPTS = 10;

    while (!success && attempts < MAX_AUDIO_RETRY_ATTEMPTS) {
      attempts++;
      try {
        await tryPlayNotes(note1, note2);
        success = true;
      } catch (error) {
        console.warn(`Attempt ${attempts}: missing audio file(s), regenerating question.`);
        setQuestion();
        await new Promise(resolve => setTimeout(resolve, 100));
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
    if (!showPopup && note1 !== null && note2 !== null) {
      playNotes();
    }
  }, [showPopup]);

  // play new question when there is a new question
  useEffect(() => {
    if (newQuestion) {
      setQuestion();
    }
  }, [newQuestion]);

  // ensure playback happens only after note state updates
  const [playedThisQuestion, setPlayedThisQuestion] = useState(false);

  useEffect(() => {
    if (!showPopup && newQuestion && !playedThisQuestion && note1 !== null && note2 !== null) {
      setPlayedThisQuestion(true);
      playNotes().then(() => setPlayedThisQuestion(false));
      setNewQuestion(false);
    }
  }, [note1, note2]);

  const handleRepeat = () => {
    playNotes();
  };


  // DEALING WITH USER CHOICE 

  const handleAnswer = async (buttonClicked: number) => {
    if (isPlaying || buttonStates[0] !== "normal" || buttonStates[1] !== "normal") return;

    const isCorrect = (buttonClicked + 1) === higherNoteButton;

    const CORRECT_SHIFT = -1;
    const INCORRECT_SHIFT = 3;

    // Record the result for this question - use a callback to ensure proper state update
    setQuestionResults(prev => {
      // Check if this question number already exists to prevent duplicates
      const existingIndex = prev.findIndex(result => result.questionNumber === questionNumber);
      const newResult = {
        questionNumber,
        isCorrect,
        semitoneGap: currentSemitoneGap
      };

      if (existingIndex >= 0) {
        // Replace existing entry
        const updated = [...prev];
        updated[existingIndex] = newResult;
        return updated;
      } else {
        // Add new entry
        return [...prev, newResult];
      }
    });

    if (isCorrect) {
      correct(buttonClicked);
      if ((pitchIndex + CORRECT_SHIFT) > 0) {
        setPitchIndex(pitchIndex - 1);
      }
    } else {
      incorrect(buttonClicked);
      setPitchIndex(Math.min(pitchIndex + INCORRECT_SHIFT, DEFAULT_INDEX));
      if (firstWrongAnswerGap === null) {
        setFirstWrongAnswerGap(currentSemitoneGap);
      }
      setWrongAnswers(prev => [...prev, questionNumber]);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (numberOfAttemptsLeft > 0) {
      setNewQuestion(true);
      setQuestionNumber(prev => prev + 1);
    }
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

  const NOTE_RANGE = 'A2'; // TODO: change to calculate actual note range, hardcoded for now

  const handleEndTest = async () => {
    setIsSaving(true);

    const gap = firstWrongAnswerGap ?? 0;

    if (userId) {
      try {
        await saveTestResult({
          userId,
          testType: testName,
          gap,
          wrongAnswers,
          noteRange: NOTE_RANGE,
        });
        console.log('Test result saved successfully');
      } catch (error) {
        console.error('Failed to save test result:', error);
      }
    } else {
      console.warn('No userId provided - test result not saved');
    }

    setIsSaving(false);

    // Navigate to results page with question results
    navigate('/pitch-resolution-test-results', {
      state: {
        userId,
        testName,
        wrongAnswers,
        gap,
        totalQuestions: questionNumber - 1,
        pitchDiscriminationThreshold: currentSemitoneGap,
        questionResults, // Add the detailed question results
        noteRange: NOTE_RANGE
      }
    });
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

      {testOver && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Test Complete!</h3>
            <p>Wrong answers: {wrongAnswers.length}</p>
            <p>Pitch Discrimination Threshold: {currentSemitoneGap.toFixed(2)}</p>
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
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="pitch-info">
        Note1 : {note1}, Note2 : {note2}, Pitch resolution: {currentSemitoneGap.toFixed(2)} semitones (index {pitchIndex})
      </div>
    </div>
  );
};

export default PitchResolutionTest;
