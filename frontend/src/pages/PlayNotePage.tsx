import React from 'react';
import PianoKey from '../api/PlayPianoNoteButton';

function App() {
  return (
    <div>
      <PianoKey noteNumber={60} label="Play Middle C" />
    </div>
  );
}

export default App;