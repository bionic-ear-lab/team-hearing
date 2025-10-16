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
  const [currentGap, setCurrentGap] = useState(0);
  
  const [currentSemitoneGap, setCurrentSemitoneGap] = useState(0.0);

  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [firstWrongAnswerGap, setFirstWrongAnswerGap] = useState<number | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);

  const testName = location.state?.testName || "Pitch Resolution Test";
  const question = location.state?.question || "Which note is higher in pitch?";
  const userId = location.state?.userId;

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );

  // Use this to make the test adaptive
  const DEFAULT_MIN_GAP = 34; // 8 semitones
  const [minGap, setMinGap] = useState(DEFAULT_MIN_GAP);

  const randomInRange = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const createQuestion = (minGap: number) => {
    const minNoteNumber = -37;
    const maxNoteNumber = 37;

    let n1 = randomInRange(minNoteNumber, maxNoteNumber - minGap);
    let n2 = n1 + minGap;

    const button1GetsFirst = Math.random() < 0.5;
    const noteA = button1GetsFirst ? n1 : n2;
    const noteB = button1GetsFirst ? n2 : n1;
    const higherButton: 1 | 2 = noteA > noteB ? 1 : 2;
    const gap = Math.abs(noteA - noteB);

    return { noteA, noteB, higherButton, gap };
  };

  const setQuestion = () => {
    const { noteA, noteB, higherButton, gap } = createQuestion(minGap);
    setNote1(noteA);
    setNote2(noteB);
    setHigherNoteButton(higherButton);
    setCurrentGap(gap);

    //const semitone_gap = 8.0;
    const semitone_gap = Math.sign(gap) * Math.pow(2, (-8 + (Math.abs(gap) - 1) / 3.0));
    setCurrentSemitoneGap(semitone_gap)
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
    if (!showPopup && note1 && note2) {
      playNotes();
    }
  }, [showPopup]);

  // play new question when there is a new question
  useEffect(() => {
    if (newQuestion) {
      setQuestion();
      setNewQuestion(false);
    }
  }, [newQuestion]);

  // play notes whenever note1 or note2 changes (but not on initial mount)
  useEffect(() => {
    if (note1 !== 0 && note2 !== 0 && !showPopup && numberOfAttemptsLeft > 0) {
      playNotes();
    }
  }, [note1, note2]);

  const handleRepeat = () => {
    playNotes();
  };

  const handleAnswer = async (buttonClicked: number) => {
    if (isPlaying || buttonStates[0] !== "normal" || buttonStates[1] !== "normal") return;

    const isCorrect = (buttonClicked + 1) === higherNoteButton;

    if (isCorrect) {
      correct(buttonClicked);
      if ((minGap - 1) > 0) {
        setMinGap(minGap - 1);
      }
    } else {
      incorrect(buttonClicked);
      if ((minGap + 3) < DEFAULT_MIN_GAP) {
        setMinGap(minGap + 3);
      } else {
        setMinGap(DEFAULT_MIN_GAP);
      }
      if (firstWrongAnswerGap === null) {
        setFirstWrongAnswerGap(currentGap);
      }
      setWrongAnswers(prev => [...prev, questionNumber]);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (numberOfAttemptsLeft > 0) {
      //setQuestion();
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
        Note1 : {note1}, Note2 : {note2}, Pitch resolution: {currentSemitoneGap.toFixed(2)} semitones
      </div>
    </div>
  );
};

export default PitchResolutionTest;