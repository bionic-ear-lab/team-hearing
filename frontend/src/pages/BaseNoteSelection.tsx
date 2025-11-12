import React, { useState, useEffect } from "react";
import '../style/BaseNoteSelection.css';

const NOTE_OPTIONS = [
  { name: "A2", value: 45 },
  { name: "A3", value: 57 },
  { name: "A4", value: 69 },
  { name: "A5", value: 81 },
  { name: "A6", value: 93 },
];

interface BaseNoteSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: (baseNote: number) => void;
}

const BaseNoteSelection: React.FC<BaseNoteSelectionProps> = ({ 
  isOpen, 
  onClose, 
  onStartTest 
}) => {
  const [selectedNote, setSelectedNote] = useState<number>(45); // default A2

  useEffect(() => {
    const saved = localStorage.getItem("baseNote");
    if (saved) setSelectedNote(Number(saved));
  }, []);

  const handleStartTest = () => {
    localStorage.setItem("baseNote", String(selectedNote));
    onStartTest(selectedNote);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="note-selection-overlay" onClick={handleOverlayClick}>
      <div className="note-selection-popup">
        <h2 className="note-selection-title">
          Which note would you like to base the test around?
        </h2>
        
        <select
          className="note-selection-dropdown"
          value={selectedNote}
          onChange={(e) => setSelectedNote(Number(e.target.value))}
        >
          {NOTE_OPTIONS.map((note) => (
            <option key={note.value} value={note.value}>
              {note.name}
            </option>
          ))}
        </select>
        
        <div className="note-selection-buttons">
          <button 
            className="note-selection-cancel-button" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="note-selection-start-button" 
            onClick={handleStartTest}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaseNoteSelection;
