import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../style/BaseNoteSelection.css';

const NOTE_OPTIONS = [
  { name: "A2", value: 45 },
  { name: "A3", value: 57 },
  { name: "A4", value: 69 },
  { name: "A5", value: 81 },
  { name: "A6", value: 93 },
];

const BaseNoteSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedNote, setSelectedNote] = useState<number>(45); // default A2

  const nextTest = location.state?.nextTest; // which test to go to after base note selection, should be set when you navigate to this page from exercises
  useEffect(() => {
    const saved = localStorage.getItem("baseNote");
    if (saved) setSelectedNote(Number(saved));
  }, []);

  const handleStartTest = () => {
    localStorage.setItem("baseNote", String(selectedNote));
    navigate(nextTest, { state: { baseNote: selectedNote } });
  };

  return (
    <div className="note-selection-container">
      <div className="note-selection-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="note-selection-title">Which note would you like to base the test around?</h2>
      </div>
      <select
        value={selectedNote}
        onChange={(e) => setSelectedNote(Number(e.target.value))}
      >
        {NOTE_OPTIONS.map((note) => (
          <option key={note.value} value={note.value}>
            {note.name}
          </option>
        ))}
      </select>
      <button className="start-button" onClick={handleStartTest}>Start Test</button>
    </div>
  );
};

export default BaseNoteSelection;
