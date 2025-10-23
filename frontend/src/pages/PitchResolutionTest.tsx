import React from "react";
import TestCore, { useMusicTest } from "./TestCore";
import { playNotes } from "../api/notePlayback";
import { createQuestion, getSemitoneGap } from "../api/noteSelection";
import { evaluateAnswer, updatePitchIndex } from "../api/userChoice";

const PitchResolutionTest: React.FC = () => {
  const { testProps, handleAnswer, handleRepeat, handleEndTest, handleStart, handleBack } = useMusicTest({
    testName: "Pitch Resolution Test",
    question: "Which note is higher in pitch?",
    baseNotes: [45, 57, 69, 81, 93],
    defaultIndex: 34,
    correctShift: -1,
    incorrectShift: 3,
    numberOfAttempts: 5,
    questionGenerator: createQuestion,
    getSemitoneGap,
    evaluator: evaluateAnswer,
    indexUpdater: updatePitchIndex,
    player: playNotes,
  });

  return (
    <TestCore
      {...testProps}
      onStart={handleStart}
      onRepeat={handleRepeat}
      onFinish={handleEndTest}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
};

export default PitchResolutionTest;
