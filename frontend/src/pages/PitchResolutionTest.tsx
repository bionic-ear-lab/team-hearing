import React from "react";
import TestCore from "./TestCore";
import { playNotes } from "../api/notePlayback";
import { createQuestion, getSemitoneGap } from "../api/noteSelection";
import { evaluateAnswer, updatePitchIndex } from "../api/userChoice";

const PitchResolutionTest: React.FC = () => (
  <TestCore
    testName="Pitch Resolution Test"
    question="Which note is higher in pitch?"
    baseNotes={[45, 57, 69, 81, 93]}
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

export default PitchResolutionTest;
