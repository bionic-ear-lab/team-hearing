import React from "react";
import { useLocation } from "react-router-dom";
import TestCore from "./TestCore";
import { playNotes } from "../api/notePlayback";
import { createQuestion, getSemitoneGap } from "../api/noteSelection";
import { evaluateAnswer, updatePitchIndex } from "../api/userChoice";

const PitchResolutionTest: React.FC = () => {
  const location = useLocation();
  const userBaseNote = location.state?.baseNote ?? 45; // A2 default if none provided

  return (
    <TestCore
      testName="Pitch Resolution Test"
      question="Which note is higher in pitch?"
      baseNotes={[userBaseNote]}
      defaultIndex={34}
      correctShift={-1}
      incorrectShift={3}
      numberOfAttempts={5}
      buttonOptions={["1", "2"]}
      questionGenerator={createQuestion}
      getSemitoneGap={getSemitoneGap}
      evaluator={evaluateAnswer}
      indexUpdater={updatePitchIndex}
      player={playNotes}
    />
  );
};

export default PitchResolutionTest;
