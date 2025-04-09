import React from 'react';
import { ExerciseProps } from '../exercise-session';

type SentenceWritingProps = ExerciseProps & {
  prompt: string;
  vocabulary?: string[];
  correctAnswers?: string[];
};

export const SentenceWriting: React.FC<SentenceWritingProps> = ({
  prompt,
  vocabulary,
  correctAnswers,
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
    if (!correctAnswers) {
      // No validation needed
      setFeedback('Submitted!');
      onComplete?.();
      return;
    }
    
    const isCorrect = correctAnswers.some(correct => 
      answer.trim().toLowerCase().includes(correct.toLowerCase())
    );
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{prompt}</div>
      
      {vocabulary && (
        <div className="text-sm text-gray-600">
          Vocabulary: {vocabulary.join(', ')}
        </div>
      )}
      
      <textarea
        className="border rounded p-2 h-24"
        value={answer}
        onChange={handleChange}
        placeholder="Write your sentence here"
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
        {correctAnswers ? 'Check Answer' : 'Submit'}
      </button>
    </div>
  );
};