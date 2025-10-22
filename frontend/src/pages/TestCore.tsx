import React from "react";

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
  numberOfAttemptsLeft,
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
  baseNote
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
