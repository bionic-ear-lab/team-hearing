import { playPianoNote } from './audio';

const tryPlayNotes = async (baseNote: number, n1: number, n2: number, volume: number = 1.0) => {
  await playPianoNote(baseNote, n1, volume);
  await new Promise(resolve => setTimeout(resolve, 1000));
  await playPianoNote(baseNote, n2, volume);
};

const playNotes = async (baseNote: number, n1: number, n2: number, regenerateQuestion: () => void, volume: number = 1.0) => {
  let success = false;
  let attempts = 0;
  const MAX_AUDIO_RETRY_ATTEMPTS = 10;

  while (!success && attempts < MAX_AUDIO_RETRY_ATTEMPTS) {
    attempts++;
    try {
      console.log(`Attempt ${attempts} to play notes`);
      await tryPlayNotes(baseNote, n1, n2, volume);
      success = true;
    } catch {
      regenerateQuestion();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

export { tryPlayNotes, playNotes };
