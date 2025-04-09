import React from 'react';
import { ExerciseProps } from '../exercise-session';

type CorrectingErrorsProps = ExerciseProps & {
  sentence: string;
  errorPositions: number[];
  correctAnswers: string[];
};

export const CorrectingErrors: React.FC<CorrectingErrorsProps> = ({
  sentence,
  errorPositions,
  correctAnswers,
  onComplete,
  onProgress
}) => {
  const [corrections, setCorrections] = React.useState<Record<number, string>>({});
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (position: number, value: string) => {
    const newCorrections = { ...corrections, [position]: value };
    setCorrections(newCorrections);
    
    // Check if all errors have corrections
    const allCorrected = errorPositions.every(pos => newCorrections[pos]);
    onProgress?.(allCorrected ? 0.8 : 0.4);
  };

  const handleSubmit = () => {
    const isCorrect = errorPositions.every(
      (pos, i) => corrections[pos]?.toLowerCase() === correctAnswers[i]?.toLowerCase()
    );
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  // Split sentence into parts with errors
  const parts = [];
  let lastPos = 0;
  
  errorPositions.forEach((pos, i) => {
    parts.push(sentence.slice(lastPos, pos));
    parts.push(`[error-${i}]`);
    lastPos = pos + 1;
  });
  
  parts.push(sentence.slice(lastPos));

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">
        {parts.map((part, i) => {
          if (part.startsWith('[error-')) {
            const errorIndex = parseInt(part.replace('[error-', '').replace(']', ''));
            const errorPos = errorPositions[errorIndex];
            return (
              <span key={`error-${i}`} className="inline-block mx-1">
                <input
                  type="text"
                  className="border rounded px-2 py-1 bg-yellow-100"
                  value={corrections[errorPos] || ''}
                  onChange={(e) => handleChange(errorPos, e.target.value)}
                  placeholder="Correct this"
                />
              </span>
            );
          }
          return <span key={`text-${i}`}>{part}</span>;
        })}
      </div>
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={Object.keys(corrections).length !== errorPositions.length}
      >
        Check Corrections
      </button>
    </div>
  );
};