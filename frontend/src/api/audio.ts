const audioContext = new window.AudioContext();

export async function playAudio(fileUrl: string): Promise<void> {
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Could not fetch audio file: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = decodedBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error(`Error playing audio from ${fileUrl}:`, error);
  }
}

// noteNumber follows MIDI notes (12-108)
// C4 = 60 (Middle C)
export function playPianoNote(noteNumber: number): void {
  const filePath = `/musescore/library/piano/original/piano_${noteNumber}.wav`;
  playAudio(filePath);
}