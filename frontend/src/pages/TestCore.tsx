import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveTestResult } from "../api/testResults";

interface MusicTestConfig {
  testName: string;
  question: string;
  baseNotes: number[];
  defaultIndex: number;
  correctShift: number;
  incorrectShift: number;
  numberOfAttempts: number;
  questionGenerator: (pitchIndex: number, baseNotes: number[]) => any;
  getSemitoneGap: (gap: number) => number;
  evaluator: (
    choiceIndex: number,
    correctButton: number,
    semitoneGap: number,
    questionNumber: number,
    results: any[]
  ) => { isCorrect: boolean; updatedResults: any[] };
  indexUpdater: (
    isCorrect: boolean,
    pitchIndex: number,
    defaultIndex: number,
    correctShift: number,
    incorrectShift: number
  ) => number;
  player: (baseNote: number, n1: number, n2: number, regenerate: () => void) => Promise<void>;
}

export const useMusicTest = (config: MusicTestConfig) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    testName,
    question,
    baseNotes,
    defaultIndex,
    correctShift,
    incorrectShift,
    numberOfAttempts,
    questionGenerator,
    getSemitoneGap,
    evaluator,
    indexUpdater,
    player,
  } = config;

  const [numberOfAttemptsLeft, setNumberOfAttemptsLeft] = useState(numberOfAttempts);
  const [showPopup, setShowPopup] = useState(true);
  const [buttonStates, setButtonStates] = useState<("normal" | "correct" | "incorrect")[]>(["normal", "normal"]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [note1, setNote1] = useState(0);
  const [note2, setNote2] = useState(0);
  const [baseNote, setBaseNote] = useState(baseNotes[0]);
  const [higherButton, setHigherButton] = useState<1 | 2>(1);
  const [currentSemitoneGap, setCurrentSemitoneGap] = useState(0);
  const [pitchIndex, setPitchIndex] = useState(defaultIndex);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [firstWrongGap, setFirstWrongGap] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState(false);

  const userId = location.state?.userId;
  const NOTE_RANGE = "A2";

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) =>
    i < numberOfAttemptsLeft ? "❤️" : "🖤"
  );
  const testOver = numberOfAttemptsLeft === 0;

  const setQuestion = () => {
    const { randomBase, noteA, noteB, higherButton, gap } = questionGenerator(pitchIndex, baseNotes);
    setBaseNote(randomBase);
    setNote1(noteA);
    setNote2(noteB);
    setHigherButton(higherButton);
    setCurrentSemitoneGap(getSemitoneGap(gap));
  };

  // Create first question on mount
  useEffect(() => {
    setQuestion();
  }, []);

  // When new question
  useEffect(() => {
    if (newQuestion) {
      setQuestion();
      setNewQuestion(false);
    }
  }, [newQuestion]);

  // On start(when popup closes)
  useEffect(() => {
    if (!showPopup) {
      setQuestion();
    }
  }, [showPopup]);

  // When question changes, play automatically
  useEffect(() => {
    if (!showPopup && !isPlaying && note1 && note2) {
      (async () => {
        setIsPlaying(true);
        await player(baseNote, note1, note2, setQuestion);
        setIsPlaying(false);
      })();
    }
  }, [note1, note2, showPopup]);

  const handleRepeat = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    await player(baseNote, note1, note2, setQuestion);
    setIsPlaying(false);
  };

  const correct = (i: number) => {
    const s = [...buttonStates];
    s[i] = "correct";
    setButtonStates(s);
    setTimeout(() => setButtonStates(["normal", "normal"]), 1000);
  };

  const incorrect = (i: number) => {
    const s = [...buttonStates];
    s[i] = "incorrect";
    setButtonStates(s);
    setTimeout(() => setButtonStates(["normal", "normal"]), 1000);
    setNumberOfAttemptsLeft((p) => Math.max(p - 1, 0));
  };

  const handleAnswer = async (i: number) => {
    if (isPlaying || buttonStates.some((s) => s !== "normal")) return;

    const { isCorrect, updatedResults } = evaluator(
      i,
      higherButton,
      currentSemitoneGap,
      questionNumber,
      questionResults
    );
    setQuestionResults(updatedResults);

    if (isCorrect) {
      correct(i);
      setPitchIndex(indexUpdater(true, pitchIndex, defaultIndex, correctShift, incorrectShift));
    } else {
      incorrect(i);
      setPitchIndex(indexUpdater(false, pitchIndex, defaultIndex, correctShift, incorrectShift));
      if (firstWrongGap === null) setFirstWrongGap(currentSemitoneGap);
      setWrongAnswers((p) => [...p, questionNumber]);
    }

    await new Promise((r) => setTimeout(r, 1500));
    if (numberOfAttemptsLeft > 0) {
      setNewQuestion(true);
      setQuestionNumber((p) => p + 1);
    }
  };

  const handleEndTest = async () => {
    setIsSaving(true);
    const gap = firstWrongGap ?? 0;
    if (userId) {
      try {
        await saveTestResult({ userId, testType: testName, gap, wrongAnswers, noteRange: NOTE_RANGE });
      } catch { }
    }
    setIsSaving(false);
    navigate("/pitch-resolution-test-results", {
      state: {
        userId,
        testName,
        wrongAnswers,
        gap,
        totalQuestions: questionNumber - 1,
        pitchDiscriminationThreshold: currentSemitoneGap,
        questionResults,
        noteRange: NOTE_RANGE,
      },
    });
  };

  const handleStart = () => setShowPopup(false);

  return {
    testProps: {
      showPopup,
      testOver,
      isSaving,
      isPlaying,
      testName,
      question,
      wrongAnswers,
      currentSemitoneGap,
      numberOfAttemptsLeft,
      numberOfAttempts,
      buttonOptions: ["1", "2"],
      buttonStates,
      hearts,
      note1,
      note2,
      pitchIndex,
      baseNote,
    },
    handleAnswer,
    handleRepeat,
    handleEndTest,
    handleStart,
    handleBack: () => navigate(-1),
  };
};


interface TestCoreProps {
  showPopup: boolean;
  testOver: boolean;
  isSaving: boolean;
  isPlaying: boolean;
  testName: string;
  question: string;
  wrongAnswers: number[];
  currentSemitoneGap: number;
  numberOfAttemptsLeft: number;
  numberOfAttempts: number;
  buttonOptions: string[];
  buttonStates: ("normal" | "correct" | "incorrect")[];
  onStart: () => void;
  onRepeat: () => void;
  onBack: () => void;
  onFinish: () => void;
  onAnswer: (i: number) => void;
  hearts: string[];
  note1: number;
  note2: number;
  pitchIndex: number;
  baseNote: number;
}

const TestCore: React.FC<TestCoreProps> = ({
  showPopup,
  testOver,
  isSaving,
  isPlaying,
  testName,
  question,
  wrongAnswers,
  currentSemitoneGap,
  numberOfAttempts,
  buttonOptions,
  buttonStates,
  onStart,
  onRepeat,
  onBack,
  onFinish,
  onAnswer,
  hearts,
  note1,
  note2,
  pitchIndex,
  baseNote,
}) => (
  <div className="music-exercises-container">
    {showPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>{testName}</h3>
          <p>{question}</p>
          <button onClick={onStart}>Start</button>
        </div>
      </div>
    )}

    {testOver && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>Test Complete!</h3>
          <p>Wrong answers: {wrongAnswers.length}</p>
          <p>Pitch Discrimination Threshold: {currentSemitoneGap.toFixed(2)}</p>
          <button onClick={onFinish} disabled={isSaving}>
            {isSaving ? "Saving..." : "Finish"}
          </button>
        </div>
      </div>
    )}

    <div className="music-exercises-title-row">
      <button className="arrow-button" aria-label="Back" onClick={onBack} disabled={testOver}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h2 className="music-exercises-title" style={{ margin: 0 }}>{question}</h2>
      <button className="repeat-button" onClick={onRepeat} disabled={isPlaying || testOver}>Repeat</button>
    </div>

    <div className={`options-buttons buttons-${buttonOptions.length}`}>
      {buttonOptions.map((text, i) => (
        <button key={i} className={`option-button ${buttonStates[i]}`} onClick={() => onAnswer(i)} disabled={testOver}>
          {text}
        </button>
      ))}
    </div>

    <div className="hearts-row">
      {hearts.map((heart, idx) => (
        <span key={idx}>{heart}</span>
      ))}
    </div>

    <div className="pitch-info">
      Note1 : {note1}, Note2 : {note2}, Pitch resolution: {currentSemitoneGap.toFixed(2)} semitones (index {pitchIndex}), Base note: {baseNote}
    </div>
  </div>
);

export default TestCore;
