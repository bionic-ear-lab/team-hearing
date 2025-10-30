import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTestHistory } from '../api/testResults';
import '../style/MusicExercises.css';

interface TestResult {
  id: number;
  userId: number;
  testType: string;
  subuser?: string;
  gap: number;
  wrongAnswers: number[] | string;
  noteRange?: string;
  timeLogged: string;
}

type SortOption = 'date-newest' | 'date-oldest' | 'gap-low' | 'gap-high' | 'note-range';

const PitchResolutionResults: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [sortedResults, setSortedResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');

  useEffect(() => {
    const fetchResults = async () => {
      if (!user || !user.id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const allTests = await getTestHistory(user.id);
        
        // Filter for only Pitch Resolution tests
        const pitchResolutionTests = allTests.filter((test: TestResult) => 
          test.testType === 'Pitch Resolution Test'
        );
        
        setTestResults(pitchResolutionTests);
      } catch (error) {
        console.error('Error fetching test results:', error);
        setError('Failed to load test results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  // Sort results whenever testResults or sortBy changes
  useEffect(() => {
    const sortResults = () => {
      const sorted = [...testResults].sort((a, b) => {
        switch (sortBy) {
          case 'date-newest':
            return new Date(b.timeLogged).getTime() - new Date(a.timeLogged).getTime();
          case 'date-oldest':
            return new Date(a.timeLogged).getTime() - new Date(b.timeLogged).getTime();
          case 'gap-low':
            return a.gap - b.gap;
          case 'gap-high':
            return b.gap - a.gap;
          case 'note-range':
            const noteOrder = ['A2', 'A3', 'A4', 'A5', 'A6'];
            const aIndex = a.noteRange ? noteOrder.indexOf(a.noteRange) : -1;
            const bIndex = b.noteRange ? noteOrder.indexOf(b.noteRange) : -1;
            
            // Handle cases where noteRange might not be in the order array
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            
            return aIndex - bIndex;
          default:
            return 0;
        }
      });
      setSortedResults(sorted);
    };

    sortResults();
  }, [testResults, sortBy]);

  // Helper function to safely handle wrongAnswers
  const formatWrongAnswers = (wrongAnswers: number[] | string): string => {
    if (Array.isArray(wrongAnswers)) {
      return wrongAnswers.length > 0 ? wrongAnswers.join(', ') : 'None';
    }
    if (typeof wrongAnswers === 'string') {
      try {
        const parsed = JSON.parse(wrongAnswers);
        if (Array.isArray(parsed)) {
          return parsed.length > 0 ? parsed.join(', ') : 'None';
        }
      } catch {
        return wrongAnswers || 'None';
      }
    }
    return 'None';
  };

  const getWrongAnswersCount = (wrongAnswers: number[] | string): number => {
    if (Array.isArray(wrongAnswers)) {
      return wrongAnswers.length;
    }
    if (typeof wrongAnswers === 'string') {
      try {
        const parsed = JSON.parse(wrongAnswers);
        if (Array.isArray(parsed)) {
          return parsed.length;
        }
      } catch {
        return wrongAnswers ? wrongAnswers.split(',').length : 0;
      }
    }
    return 0;
  };

  const formatDate = (timeLogged: string): string => {
    if (!timeLogged) {
      return 'No Date Available';
    }
    
    try {
      const date = new Date(timeLogged);
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error parsing date:', timeLogged, error);
      return 'Parse Error';
    }
  };

  return (
    <div className="music-exercises-container">
      <div className="music-exercises-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate('/exercise/Pitch%20Resolution')}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="music-exercises-title">
          Pitch Resolution Test Results
        </h2>
      </div>

      <div style={{ padding: '20px', width: '100%' }}>
        {loading && <p>Loading test results...</p>}
        
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {!loading && !error && testResults.length === 0 && (
          <p>No Pitch Resolution test results found.</p>
        )}
        
        {!loading && !error && testResults.length > 0 && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3>Your Test History:</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="sort-select" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #ccc',
                    borderRadius: '6px',
                    background: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#888'}
                  onBlur={(e) => e.target.style.borderColor = '#ccc'}
                >
                  <option value="date-newest">Date (Newest First)</option>
                  <option value="date-oldest">Date (Oldest First)</option>
                  <option value="gap-low">Gap (Low to High)</option>
                  <option value="gap-high">Gap (High to Low)</option>
                  <option value="note-range">Note Range (A2-A6)</option>
                </select>
              </div>
            </div>
            
            {sortedResults.map((result, index) => (
              <div key={result.id} style={{ 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                padding: '15px', 
                marginBottom: '10px',
                backgroundColor: '#fff'
              }}>
                <p><strong>Test #{index + 1}</strong></p>
                <p><strong>Date:</strong> {formatDate(result.timeLogged)}</p>
                <p><strong>Gap:</strong> {result.gap.toFixed(3)} semitones</p>
                <p><strong>Wrong Answers:</strong> {getWrongAnswersCount(result.wrongAnswers)}</p>
                <p><strong>Wrong Answer Questions:</strong> {formatWrongAnswers(result.wrongAnswers)}</p>
                {result.noteRange && <p><strong>Note Range:</strong> {result.noteRange}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchResolutionResults;