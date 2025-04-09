import React from 'react';
import { ExerciseProps } from '../exercise-session';

type IdentifyingErrorsProps = ExerciseProps & {
  sentence: string;
  errorPositions: number[];
};

export const IdentifyingErrors: React.FC<IdentifyingErrorsProps> = ({
  sentence,
  errorPositions,
  onComplete,
  onProgress
}) => {
  const [selectedPositions, setSelectedPositions] = React.useState<number[]>([]);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleClick = (position: number) => {
    const newPositions = selectedPositions.includes(position)
      ? selectedPositions.filter(p => p !== position)
      : [...selectedPositions, position];
    
    setSelectedPositions(newPositions);
    onProgress?.(newPositions.length ? 0.5 : 0);
  };

  const handleSubmit = () => {
    const isCorrect = 
      selectedPositions.length === errorPositions.length &&
      errorPositions.every(pos => selectedPositions.includes(pos));
    
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">
        {sentence.split('').map((char, i) => (
          <span 
            key={i}
            onClick={() => handleClick(i)}
            className={`cursor-pointer ${selectedPositions.includes(i) ? 'bg-yellow-200' : ''}`}
          >
            {char}
          </span>
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        Click on the words or letters you think contain errors.
      </div>
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!selectedPositions.length}
      >
        Check Answer
      </button>
    </div>
  );
};