import React from 'react';
import { ExerciseProps } from '../exercise-session';

type SpecificInfoProps = ExerciseProps & {
  text: string;
  question: string;
  correctAnswer: string;
};

export const SpecificInfo: React.FC<SpecificInfoProps> = ({
  text,
  question,
  correctAnswer,
  onComplete,
  onProgress
}) => {
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    onProgress?.(value ? 0.5 : 0);
  };

  const handleSubmit = () => {
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">{text}</div>
      <div className="text-lg font-medium">{question}</div>
      
      <input
        type="text"
        className="border rounded p-2"
        value={answer}
        onChange={handleChange}
        placeholder="Write your answer here"
      />
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!answer}
      >
        Check Answer
      </button>
    </div>
  );
};