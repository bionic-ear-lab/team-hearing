const audioContext = new window.AudioContext();

export async function playAudio(fileUrl: string): Promise<void> {
  console.log("Playing file:", fileUrl);

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

// File naming follows MIDI notes (12-108)
// All files are pitch shifted versions of the A2 piano note
// A2 = 45 (Lowest A on a standard piano)
export async function playPianoNote(noteShiftNumber: number): Promise<void> {
  let file_name = "piano_45_";
  const absNoteShiftNumber = Math.abs(noteShiftNumber);
  if (noteShiftNumber < 0) {
    file_name += `${absNoteShiftNumber}_n`;
  }
  else {
    file_name += `${absNoteShiftNumber}`;
  }
  const filePath = '/musescore/library/piano/pitchshifted/' + file_name + '.mp4';

  try {
    const response = await fetch(filePath, { method: "HEAD" });
    if (!response.ok) {
      console.warn("Missing audio file:", filePath);
      throw new Error("File not found");
    }
  } catch (err) {
    console.error("Audio file unavailable:", filePath);
    throw err; // signal back to the caller to regenerate question
  }

  playAudio(filePath);
}