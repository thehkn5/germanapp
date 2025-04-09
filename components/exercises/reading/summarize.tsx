import React from 'react';
import { ExerciseProps } from '../exercise-session';

type SummarizeProps = ExerciseProps & {
  text: string;
  correctAnswer: string;
};

export const Summarize: React.FC<SummarizeProps> = ({
  text,
  correctAnswer,
  onComplete,
  onProgress
}) => {
  const [summary, setSummary] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSummary(value);
    onProgress?.(value ? 0.5 : 0);
  };

  const handleSubmit = () => {
    const isCorrect = summary.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">{text}</div>
      <div className="text-sm text-gray-600">Write a brief summary of the main points:</div>
      
      <textarea
        className="border rounded p-2 h-24"
        value={summary}
        onChange={handleChange}
        placeholder="Write your summary here"
      />
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!summary}
      >
        Check Answer
      </button>
    </div>
  );
};