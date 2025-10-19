import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as d3 from 'd3';
import '../style/TestResults.css';

interface QuestionResult {
  questionNumber: number;
  isCorrect: boolean;
  semitoneGap: number;
}

const PitchResolutionTestResults: React.FC = () => {
  const location = useLocation();
  const { wrongAnswers, totalQuestions, pitchDiscriminationThreshold, testName, questionResults } = location.state || {};
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!questionResults || questionResults.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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
      .text("Semitone Difference");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
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

  }, [questionResults]);

  return (
    <div className="test-results-container">
      <h1 className="test-results-title">Pitch Resolution Test Results</h1>
      <p className="test-summary"><strong>Test:</strong> {testName}</p>
      <p className="test-summary"><strong>Total Questions:</strong> {totalQuestions}</p>
      <p className="test-summary"><strong>Wrong Answers:</strong> {wrongAnswers?.length || 0}</p>
      <p className="test-summary"><strong>Final Pitch Discrimination Threshold:</strong> {pitchDiscriminationThreshold?.toFixed(2)} semitones</p>
      
      <div className="graph-container">
        <h2 className="graph-title">Semitone Difference Over Time</h2>
        <svg ref={svgRef} width={600} height={400}></svg>
        <p className="graph-legend">
          Green dots = Correct answers, Red dots = Incorrect answers
        </p>
      </div>

      <table className="results-table">
        <thead>
          <tr className="table-header">
            <th className="table-cell">Trial</th>
            <th className="table-cell">Semitone Difference</th>
            <th className="table-cell">Result</th>
          </tr>
        </thead>
        <tbody>
          {questionResults?.map((result: QuestionResult, index: number) => (
            <tr key={index}>
              <td className="table-cell">{result.questionNumber}</td>
              <td className="table-cell">{Number(result.semitoneGap).toFixed(3)}</td>
              <td className={`table-cell ${result.isCorrect ? 'result-correct' : 'result-incorrect'}`}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </td>
            </tr>
          )) || (
            <tr>
              <td colSpan={3} className="table-cell no-results">
                No question results available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PitchResolutionTestResults;