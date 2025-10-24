const randomDirection = () => (Math.random() < 0.5 ? 1 : -1);

const createQuestion = (index: number, baseNotes: number[]) => {
  console.log("Creating question with index:", index);
  const randomBase = baseNotes[Math.floor(Math.random() * baseNotes.length)];
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

export { createQuestion, getSemitoneGap };
