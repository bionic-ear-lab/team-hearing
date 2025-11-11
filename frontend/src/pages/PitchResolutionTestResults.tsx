import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import '../style/MusicExercises.css';

interface QuestionResult {
  questionNumber: number;
  isCorrect: boolean;
  semitoneGap: number;
}

const PitchResolutionTestResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wrongAnswers, totalQuestions, pitchDiscriminationThreshold, testName, questionResults, noteRange } = location.state || {};
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 40; 
      const width = Math.min(containerWidth, 800); 
      const height = Math.max(300, width * 0.5); 
      setDimensions({ width, height });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!questionResults || questionResults.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(questionResults, (d: QuestionResult) => Number(d.questionNumber));
    const yExtent = d3.extent(questionResults, (d: QuestionResult) => Number(d.semitoneGap));

    const xDomain: [number, number] = [
      xExtent[0] ?? 1,
      xExtent[1] ?? questionResults.length
    ];

    const yDomain: [number, number] = [
      yExtent[0] ?? 0,
      yExtent[1] ?? 1
    ];

    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .nice()
      .range([height, 0]);

    const line = d3.line<QuestionResult>()
      .x((d: QuestionResult) => xScale(Number(d.questionNumber)))
      .y((d: QuestionResult) => yScale(Number(d.semitoneGap)));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    g.append("g")
      .call(d3.axisLeft(yScale));

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#222")
      .text("Semitone Difference");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("fill", "#222")
      .text("Trial Number");

    // Add the line
    g.append("path")
      .datum(questionResults)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots for each data point
    g.selectAll(".dot")
      .data<QuestionResult>(questionResults)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d: QuestionResult) => xScale(Number(d.questionNumber)))
      .attr("cy", (d: QuestionResult) => yScale(Number(d.semitoneGap)))
      .attr("r", 4)
      .attr("fill", (d: QuestionResult) => d.isCorrect ? "green" : "red");

  }, [questionResults, dimensions]);

  return (
    <div className="results-container">
      {/* Header with back button, title, and retake button */}
      <div className="music-exercises-title-row results-title-row">
        <button
          className="arrow-button"
          aria-label="Back"
          onClick={() => navigate('/exercise/Pitch%20Resolution')}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M18 7L11 14L18 21" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="music-exercises-title results-title">
          {testName || 'Pitch Resolution Test'} Results
        </h2>
        <button
          className="retake-button"
          onClick={() => navigate('/pitch-resolution-test')}
        >
          Retake Test
        </button>
      </div>

      {/* Scrollable content area */}
      <div className="results-content-area">
        {/* Single white box containing all content */}
        <div ref={containerRef} className="results-white-box">
          {/* Graph section */}
          <div className="results-graph-section">
            <h3 className="results-graph-title">Semitone Difference Over Time</h3>
            <div className="results-graph-container">
              <svg 
                ref={svgRef} 
                width={dimensions.width} 
                height={dimensions.height} 
                className="results-graph-svg"
              />
            </div>
            <p className="results-graph-legend">
              Green dots = Correct answers, Red dots = Incorrect answers
            </p>
          </div>

          {/* Test Summary section with box */}
          <div className="results-summary-section">
            <h3 className="results-summary-title">Test Summary</h3>
            <p className="results-summary-text"><strong>Note Range:</strong> {noteRange || 'A2'}</p>
            <p className="results-summary-text"><strong>Total Questions:</strong> {totalQuestions || 0}</p>
            <p className="results-summary-text"><strong>Wrong Answers:</strong> {wrongAnswers?.length || 0}</p>
            <p className="results-summary-text"><strong>Final Pitch Discrimination Threshold:</strong> {pitchDiscriminationThreshold?.toFixed(3) || '0.000'} semitones</p>
          </div>

          {/* Trial Details section */}
          <div>
            <h3 className="results-summary-title">Trial Details</h3>
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr className="results-table-header">
                    <th className="results-table-header-cell">Trial</th>
                    <th className="results-table-header-cell">Semitone Difference</th>
                    <th className="results-table-header-cell">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {questionResults?.map((result: QuestionResult, index: number) => (
                    <tr key={index}>
                      <td className="results-table-cell">{result.questionNumber}</td>
                      <td className="results-table-cell">{Number(result.semitoneGap).toFixed(3)}</td>
                      <td className={`results-table-cell ${result.isCorrect ? 'results-table-cell-correct' : 'results-table-cell-incorrect'}`}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} className="results-table-cell results-table-cell-no-data">
                        No question results available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Buttons below the white box */}
        <div className="results-bottom-buttons">
          <button
            className="results-button"
            onClick={() => navigate('/pitch-resolution-results')}
          >
            See All Results
          </button>
          <button
            className="results-button"
            onClick={() => navigate('/exercises')}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PitchResolutionTestResults;