import React from 'react';
import { ExerciseProps } from '../exercise-session';

type DialogueWritingProps = ExerciseProps & {
  scenario: string;
  participants: string[];
  minimumLines?: number;
};

export const DialogueWriting: React.FC<DialogueWritingProps> = ({
  scenario,
  participants,
  minimumLines,
  onComplete,
  onProgress
}) => {
  const [dialogue, setDialogue] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDialogue(value);
    
    // Calculate progress based on line count if specified
    if (minimumLines) {
      const lines = value.trim().split('\n').filter(Boolean).length;
      onProgress?.(Math.min(lines / minimumLines, 1));
    } else {
      onProgress?.(value ? 0.5 : 0);
    }
  };

  const handleSubmit = () => {
    setFeedback('Submitted!');
    onComplete?.();
  };

  const meetsMinimumLines = !minimumLines || 
    dialogue.trim().split('\n').filter(Boolean).length >= minimumLines;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{scenario}</div>
      
      <div className="text-sm text-gray-600">
        Participants: {participants.join(', ')}
        {minimumLines && ` (Minimum ${minimumLines} lines)`}
      </div>
      
      <textarea
        className="border rounded p-2 h-64 font-mono"
        value={dialogue}
        onChange={handleChange}
        placeholder={`Format:\n${participants[0]}: ...\n${participants[1]}: ...`}
      />
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!dialogue || !meetsMinimumLines}
      >
        Submit
      </button>
    </div>
  );
};