'use client';

import React, { useState } from 'react';
import { ExplainItProps, EvaluationResults } from '../types/ExplainItGameTypes';

export default function ExplainIt({
  question = 'Can you explain photosynthesis?',
}: ExplainItProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<EvaluationResults | null>(null);

  function handleSubmit() {
    if (!answer.trim()) return;

    // Simulated evaluation
    const words = answer.trim().toLowerCase().split(/\s+/);

    // Points: number of keywords found
    const keywords = ['light', 'chlorophyll', 'water', 'co2', 'oxygen', 'plants'];
    const found = words.filter((w) => keywords.includes(w));
    const points = Math.min(found.length * 10, 100);

    // Detected errors (random incorrect words)
    const errors = words
      .filter((w) => !keywords.includes(w))
      .slice(0, 5);

    // Missing
    const missing = keywords.filter((kw) => !words.includes(kw));

    // Simulated AI response
    const aiResponse = `Photosynthesis is the process by which plants convert sunlight into chemical energy, using water and CO2 to produce oxygen and glucose.`;

    // Feedback
    let feedback = '';
    if (points >= 70) feedback = 'Excellent! You identified most key concepts.';
    else if (points >= 40) feedback = 'Good, but some important concepts are missing.';
    else feedback = 'You should review the topic in more detail.';

    setResults({ points, errors, missing, aiResponse, feedback });
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 gap-4">
      {/* Question */}
      <div className="bg-indigo-100 p-4 rounded-lg w-full text-left">
        <p className="text-lg font-semibold">{question}</p>
      </div>

      {/* Answer */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        disabled={submitted}
      />

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      )}

      {/* Results */}
      {submitted && results && (
        <div className="w-full bg-gray-50 p-4 rounded-lg shadow space-y-3">
          <div>
            <strong>Score:</strong> {results.points}/100
          </div>
          <div>
            <strong>Detected errors:</strong>{' '}
            {results.errors.length > 0 ? results.errors.join(', ') : 'None'}
          </div>
          <div>
            <strong>Missing:</strong>{' '}
            {results.missing.length > 0 ? results.missing.join(', ') : 'Nothing'}
          </div>
          <div>
            <strong>AI response:</strong> {results.aiResponse}
          </div>
          <div className="bg-green-100 p-2 rounded">
            <strong>Feedback:</strong> {results.feedback}
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswer('');
              setResults(null);
            }}
            className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}