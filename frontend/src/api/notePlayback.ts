import { playPianoNote } from './audio';

const tryPlayNotes = async (baseNote: number, n1: number, n2: number) => {
  await playPianoNote(baseNote, n1);
  await new Promise(resolve => setTimeout(resolve, 1000));
  await playPianoNote(baseNote, n2);
};

const playNotes = async (baseNote: number, n1: number, n2: number, regenerateQuestion: () => void) => {
  let success = false;
  let attempts = 0;
  const MAX_AUDIO_RETRY_ATTEMPTS = 10;

  while (!success && attempts < MAX_AUDIO_RETRY_ATTEMPTS) {
    attempts++;
    try {
      await tryPlayNotes(baseNote, n1, n2);
      success = true;
    } catch {
      regenerateQuestion();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

export { tryPlayNotes, playNotes };
