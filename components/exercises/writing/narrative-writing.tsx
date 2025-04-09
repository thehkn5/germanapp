import React from 'react';
import { ExerciseProps } from '../exercise-session';

type NarrativeWritingProps = ExerciseProps & {
  prompt: string;
  wordCount?: number;
};

export const NarrativeWriting: React.FC<NarrativeWritingProps> = ({
  prompt,
  wordCount,
  onComplete,
  onProgress
}) => {
  const [story, setStory] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setStory(value);
    
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
      <div className="text-lg font-medium">{prompt}</div>
      
      {wordCount && (
        <div className="text-sm text-gray-600">
          Target: {wordCount} words
        </div>
      )}
      
      <textarea
        className="border rounded p-2 h-64"
        value={story}
        onChange={handleChange}
        placeholder="Write your story here"
      />
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!story}
      >
        Submit
      </button>
    </div>
  );
};