import React from 'react';
import { playPianoNote } from '../api/audio';

interface PianoKeyProps {
  noteNumber: number;
  label: string;
}


const PianoKey: React.FC<PianoKeyProps> = ({ noteNumber, label }) => {

  const handleClick = () => {
    playPianoNote(noteNumber);
  };

  return (
    <button onClick={handleClick}>
      {label}
    </button>
  );
};

export default PianoKey;