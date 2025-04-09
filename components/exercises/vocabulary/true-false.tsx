import React from 'react';
import { ExerciseProps } from '../exercise-session';

type TrueFalseProps = ExerciseProps & {
  statement: string;
  correctAnswer: boolean;
};

export const TrueFalse: React.FC<TrueFalseProps> = ({
  statement,
  correctAnswer,
  onComplete,
  onProgress
}) => {
  const [selectedOption, setSelectedOption] = React.useState<boolean | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (value: boolean) => {
    setSelectedOption(value);
    onProgress?.(0.5);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === correctAnswer;
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{statement}</div>
      
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="true-false"
            checked={selectedOption === true}
            onChange={() => handleChange(true)}
            className="h-4 w-4"
          />
          <span>True</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="true-false"
            checked={selectedOption === false}
            onChange={() => handleChange(false)}
            className="h-4 w-4"
          />
          <span>False</span>
        </label>
      </div>
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={selectedOption === null}
      >
        Check Answer
      </button>
    </div>
  );
};