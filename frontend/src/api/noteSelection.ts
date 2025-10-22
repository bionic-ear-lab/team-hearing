const BASE_NOTES = [45, 57, 69, 81, 93, 105];
const DEFAULT_INDEX = 34;

const randomDirection = () => (Math.random() < 0.5 ? 1 : -1);
const chooseRandomBase = () => BASE_NOTES[Math.floor(Math.random() * BASE_NOTES.length)];

const createQuestion = (index: number) => {
  const randomBase = chooseRandomBase();
  const direction = randomDirection();

  const n1 = 0;
  const n2 = direction * index;

  const button1GetsFirst = Math.random() < 0.5;
  const noteA = button1GetsFirst ? n1 : n2;
  const noteB = button1GetsFirst ? n2 : n1;
  const higherButton: 1 | 2 = noteA > noteB ? 1 : 2;
  const gap = index;

  return { randomBase, noteA, noteB, higherButton, gap };
};

const getSemitoneGap = (gap: number) => Math.pow(2, -8 + (gap - 1) / 3);

export { BASE_NOTES, DEFAULT_INDEX, chooseRandomBase, createQuestion, getSemitoneGap };
