type QuestionResult = { questionNumber: number; isCorrect: boolean; semitoneGap: number };

const evaluateAnswer = (
  buttonClicked: number,
  higherNoteButton: number,
  currentSemitoneGap: number,
  questionNumber: number,
  questionResults: QuestionResult[]
) => {
  const isCorrect = buttonClicked + 1 === higherNoteButton;
  const existingIndex = questionResults.findIndex(r => r.questionNumber === questionNumber);
  const newResult = { questionNumber, isCorrect, semitoneGap: currentSemitoneGap };
  const updatedResults =
    existingIndex >= 0
      ? [...questionResults.slice(0, existingIndex), newResult, ...questionResults.slice(existingIndex + 1)]
      : [...questionResults, newResult];
  return { isCorrect, updatedResults };
};

const updatePitchIndex = (
  isCorrect: boolean,
  pitchIndex: number,
  defaultIndex: number,
  correctShift: number,
  incorrectShift: number
) => {
  if (isCorrect) return Math.max(pitchIndex + correctShift, 1);
  return Math.min(pitchIndex + incorrectShift, defaultIndex);
};

export { evaluateAnswer, updatePitchIndex };
