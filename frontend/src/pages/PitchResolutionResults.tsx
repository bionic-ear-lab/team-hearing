import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getTestHistory } from '../api/testResults';
import * as d3 from 'd3';
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
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user || !user.id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const allTests = await getTestHistory(user.id);
        
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

  useEffect(() => {
    if (!testResults || testResults.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 120, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const validResults = testResults
      .filter(d => d.timeLogged && !isNaN(new Date(d.timeLogged).getTime()))
      .sort((a, b) => new Date(a.timeLogged).getTime() - new Date(b.timeLogged).getTime());

    if (validResults.length === 0) return;

    const dataByNoteRange = d3.group(validResults, d => d.noteRange || 'Unknown');

    const noteRanges = Array.from(dataByNoteRange.keys()).sort();
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(noteRanges);

  
    const xExtent = d3.extent(validResults, d => new Date(d.timeLogged));
    const yExtent = d3.extent(validResults, d => d.gap);

    const xScale = d3.scaleTime()
      .domain(xExtent as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(yExtent as [number, number])
      .nice()
      .range([height, 0]);

    const line = d3.line<TestResult>()
      .x(d => xScale(new Date(d.timeLogged)))
      .y(d => yScale(d.gap))
      .curve(d3.curveMonotoneX);


    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%m/%d/%y") as any));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#222")
      .text("Gap (Semitones)");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("fill", "#222")
      .text("Date");

    let dotCounter = 0;
    dataByNoteRange.forEach((data, noteRange) => {
      const sortedData = data.sort((a, b) => new Date(a.timeLogged).getTime() - new Date(b.timeLogged).getTime());
      
      g.append("path")
        .datum(sortedData)
        .attr("fill", "none")
        .attr("stroke", colorScale(noteRange))
        .attr("stroke-width", 2)
        .attr("d", line);

      sortedData.forEach((d, i) => {
        g.append("circle")
          .attr("class", `dot-${noteRange}-${dotCounter++}`)
          .attr("cx", xScale(new Date(d.timeLogged)))
          .attr("cy", yScale(d.gap))
          .attr("r", 4)
          .attr("fill", colorScale(noteRange))
          .append("title")
          .text(`${noteRange}: ${d.gap.toFixed(3)} semitones\n${formatDate(d.timeLogged)}`);
      });
    });

    const legend = svg.append("g")
      .attr("transform", `translate(${width + margin.left + 10}, ${margin.top})`);

    noteRanges.forEach((noteRange, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colorScale(noteRange));

      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 9)
        .attr("dy", "0.32em")
        .style("font-size", "12px")
        .style("fill", "#222")
        .text(noteRange);
    });

  }, [testResults]);

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
    <div style={{ 
      backgroundColor: '#f5f5f5',
      color: '#222',
      minHeight: '100vh',
      position: 'fixed', 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: '80px', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="music-exercises-title-row" style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#f5f5f5',
        zIndex: 1000,
        padding: '10px 20px 5px 20px'
      }}>
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate('/exercise/Pitch%20Resolution')}
          style={{
            backgroundColor: '#fff',
            borderColor: '#ccc'
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="music-exercises-title" style={{ 
          color: '#222',
          margin: '0', 
          marginBottom: '0' 
        }}>
          Pitch Resolution Test Results
        </h2>
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '80px' 
      }}>
        {loading && <p style={{ padding: '20px', color: '#222' }}>Loading test results...</p>}
        
        {error && <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>}
        
        {!loading && !error && testResults.length === 0 && (
          <p style={{ padding: '20px', color: '#222' }}>No Pitch Resolution test results found.</p>
        )}
        
        {!loading && !error && testResults.length > 0 && (
          <>
            <div style={{ 
              padding: '20px',
              backgroundColor: '#fff',
              margin: '5px 20px 20px 20px', 
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}>
              <h3 style={{ color: '#222', marginBottom: '20px' }}>Gap Threshold Over Time</h3>
              <svg ref={svgRef} width={800} height={400} style={{ display: 'block', margin: '0 auto' }}></svg>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '0 20px 20px 20px'
            }}>
              <h3 style={{ color: '#222' }}>Your Test History:</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label 
                  htmlFor="sort-select" 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#222'
                  }}
                >
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
                    transition: 'border-color 0.2s',
                    color: '#222'
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
            
            <div style={{ padding: '0 20px 50px 20px' }}> 
              {sortedResults.map((result, index) => (
                <div key={result.id} style={{ 
                  border: '1px solid #ccc', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '10px',
                  backgroundColor: '#fff',
                  color: '#222'
                }}>
                  <p style={{ color: '#222' }}><strong>Date:</strong> {formatDate(result.timeLogged)}</p>
                  <p style={{ color: '#222' }}><strong>Gap:</strong> {result.gap.toFixed(3)} semitones</p>
                  <p style={{ color: '#222' }}><strong>Wrong Answers:</strong> {getWrongAnswersCount(result.wrongAnswers)}</p>
                  <p style={{ color: '#222' }}><strong>Wrong Answer Questions:</strong> {formatWrongAnswers(result.wrongAnswers)}</p>
                  {result.noteRange && <p style={{ color: '#222' }}><strong>Note Range:</strong> {result.noteRange}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PitchResolutionResults;