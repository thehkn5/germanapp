import React from 'react';
import { ExerciseProps } from '../exercise-session';

type ParagraphWritingProps = ExerciseProps & {
  topic: string;
  instructions?: string;
  wordCount?: number;
};

export const ParagraphWriting: React.FC<ParagraphWritingProps> = ({
  topic,
  instructions,
  wordCount,
  onComplete,
  onProgress
}) => {
  const [answer, setAnswer] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAnswer(value);
    
    // Calculate progress based on word count if specified
    if (wordCount) {
      const words = value.trim().split(/\s+/).filter(Boolean).length;
      onProgress?.(Math.min(words / wordCount, 1));
    } else {
      onProgress?.(value ? 0.5 : 0);
    }
  };

  const handleSubmit = () => {
    setFeedback('Submitted!');
    onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{topic}</div>
      
      {instructions && (
        <div className="text-sm text-gray-600">
          {instructions}
        </div>
      )}
      
      {wordCount && (
        <div className="text-sm text-gray-600">
          Target: {wordCount} words
        </div>
      )}
      
      <textarea
        className="border rounded p-2 h-48"
        value={answer}
        onChange={handleChange}
        placeholder="Write your paragraph here"
      />
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!answer}
      >
        Submit
      </button>
    </div>
  );
};