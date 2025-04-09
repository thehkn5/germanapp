import React from 'react';
import { ExerciseProps } from '../exercise-session';

type MultipleChoiceProps = ExerciseProps & {
  question: string;
  options: string[];
  correctAnswer: string;
};

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  options,
  correctAnswer,
  onComplete,
  onProgress
}) => {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    onProgress?.(value ? 0.5 : 0);
  };

  const handleSubmit = () => {
    const isCorrect = selectedOption === correctAnswer;
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{question}</div>
      
      <div className="space-y-2">
        {options.map((option, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="multiple-choice"
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>{option}</span>
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
        disabled={!selectedOption}
      >
        Check Answer
      </button>
    </div>
  );
};