import React from 'react';
import { ExerciseProps } from '../exercise-session';

type RewritingStructuresProps = ExerciseProps & {
  originalSentence: string;
  structure: string;
  correctAnswer: string;
};

export const RewritingStructures: React.FC<RewritingStructuresProps> = ({
  originalSentence,
  structure,
  correctAnswer,
  onComplete,
  onProgress
}) => {
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <div className="text-lg font-medium">{originalSentence}</div>
      <div className="text-sm text-gray-600">Rewrite using: {structure}</div>
      
      <textarea
        className="border rounded p-2 h-24"
        value={answer}
        onChange={handleChange}
        placeholder="Write your rewritten sentence here"
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