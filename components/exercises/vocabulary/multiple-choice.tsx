import React from 'react';
import { ExerciseProps } from '../exercise-session';

type MultipleChoiceProps = ExerciseProps & {
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  options,
  onComplete,
  onProgress
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (optionId: string) => {
    setSelectedOption(optionId);
    onProgress?.(0.5);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const selected = options.find(opt => opt.id === selectedOption);
    const isCorrect = selected?.isCorrect || false;
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{question}</div>
      
      <div className="space-y-2">
        {options.map(option => (
          <label key={option.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="multiple-choice"
              checked={selectedOption === option.id}
              onChange={() => handleChange(option.id)}
              className="h-4 w-4"
            />
            <span>{option.text}</span>
          </label>
        ))}
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