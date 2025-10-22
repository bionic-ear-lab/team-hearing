import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/MusicExercises.css";
import TestCore from "./TestCore";
import { playNotes } from "../api/notePlayback";
import { createQuestion, getSemitoneGap } from "../api/noteSelection";
import { evaluateAnswer, updatePitchIndex } from "../api/userChoice";
import { saveTestResult } from "../api/testResults";

const PitchResolutionTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const BASE_NOTES = [45, 57, 69, 81, 93, 105];
  const DEFAULT_INDEX = 34;

  const CORRECT_SHIFT = -1;
  const INCORRECT_SHIFT = 3;

  const numberOfAttempts = 5;
  const [numberOfAttemptsLeft, setNumberOfAttemptsLeft] = useState(5);

  const [showPopup, setShowPopup] = useState(true);

  const buttonOptions = ["1", "2"];
  const [buttonStates, setButtonStates] = useState<("normal" | "correct" | "incorrect")[]>(Array(2).fill("normal"));

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [note1, setNote1] = useState(0);
  const [note2, setNote2] = useState(0);
  const [baseNote, setBaseNote] = useState(45);

  const [higherNoteButton, setHigherNoteButton] = useState<1 | 2>(1);
  const [currentSemitoneGap, setCurrentSemitoneGap] = useState(0);

  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [firstWrongAnswerGap, setFirstWrongAnswerGap] = useState<number | null>(null);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [pitchIndex, setPitchIndex] = useState(DEFAULT_INDEX);
  const [newQuestion, setNewQuestion] = useState(false);
  const [questionResults, setQuestionResults] = useState<{ questionNumber: number; isCorrect: boolean; semitoneGap: number; }[]>([]);

  const testName = location.state?.testName || "Pitch Resolution Test";
  const question = location.state?.question || "Which note is higher in pitch?";

  const userId = location.state?.userId;
  const NOTE_RANGE = "A2"; // TODO: change to calculate actual note range, hardcoded for now

  const hearts = Array.from({ length: numberOfAttempts }, (_, i) => i < numberOfAttemptsLeft ? "❤️" : "🖤");
  const testOver = numberOfAttemptsLeft === 0;


  const setQuestion = () => {
    const { randomBase, noteA, noteB, higherButton, gap } = createQuestion(pitchIndex, BASE_NOTES);
    setBaseNote(randomBase);
    setNote1(noteA);
    setNote2(noteB);
    setHigherNoteButton(higherButton);
    setCurrentSemitoneGap(getSemitoneGap(gap));
  };

  useEffect(() => {
    setQuestion();
  }, []);

  useEffect(() => {
    if (newQuestion) {
      setQuestion();
      setNewQuestion(false);
    }
  }, [newQuestion]);

  const handleRepeat = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    await playNotes(baseNote, note1, note2, setQuestion);
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
    setNumberOfAttemptsLeft(p => Math.max(p - 1, 0));
  };

  const handleAnswer = async (i: number) => {
    if (isPlaying || buttonStates.some(s => s !== "normal")) return;
    const { isCorrect, updatedResults } = evaluateAnswer(i, higherNoteButton, currentSemitoneGap, questionNumber, questionResults);
    setQuestionResults(updatedResults);
    if (isCorrect) {
      correct(i);
      setPitchIndex(updatePitchIndex(true, pitchIndex, DEFAULT_INDEX, CORRECT_SHIFT, INCORRECT_SHIFT));
    } else {
      incorrect(i);
      setPitchIndex(updatePitchIndex(false, pitchIndex, DEFAULT_INDEX, CORRECT_SHIFT, INCORRECT_SHIFT));
      if (firstWrongAnswerGap === null) setFirstWrongAnswerGap(currentSemitoneGap);
      setWrongAnswers(p => [...p, questionNumber]);
    }
    await new Promise(r => setTimeout(r, 1500));
    if (numberOfAttemptsLeft > 0) {
      setNewQuestion(true);
      setQuestionNumber(p => p + 1);
    }
  };

  const handleEndTest = async () => {
    setIsSaving(true);
    const gap = firstWrongAnswerGap ?? 0;
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
        noteRange: NOTE_RANGE
      }
    });
  };

  return (
    <TestCore
      showPopup={showPopup}
      testOver={testOver}
      isSaving={isSaving}
      isPlaying={isPlaying}
      testName={testName}
      question={question}
      wrongAnswers={wrongAnswers}
      currentSemitoneGap={currentSemitoneGap}
      numberOfAttemptsLeft={numberOfAttemptsLeft}
      numberOfAttempts={numberOfAttempts}
      buttonOptions={buttonOptions}
      buttonStates={buttonStates}
      onStart={() => setShowPopup(false)}
      onRepeat={handleRepeat}
      onBack={() => navigate(-1)}
      onFinish={handleEndTest}
      onAnswer={handleAnswer}
      hearts={hearts}
      note1={note1}
      note2={note2}
      pitchIndex={pitchIndex}
      baseNote={baseNote}
    />
  );
};

export default PitchResolutionTest;
