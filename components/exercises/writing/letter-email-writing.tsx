import React from 'react';
import { ExerciseProps } from '../exercise-session';

type LetterEmailWritingProps = ExerciseProps & {
  scenario: string;
  type: 'formal' | 'informal';
  recipient?: string;
  subject?: string;
};

export const LetterEmailWriting: React.FC<LetterEmailWritingProps> = ({
  scenario,
  type,
  recipient,
  subject,
  onComplete,
  onProgress
}) => {
  const [content, setContent] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    onProgress?.(value ? 0.5 : 0);
  };

  const handleSubmit = () => {
    setFeedback('Submitted!');
    onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{scenario}</div>
      
      <div className="text-sm text-gray-600">
        Write a {type} {recipient ? 'letter' : 'email'}
        {recipient && ` to ${recipient}`}
        {subject && ` with subject "${subject}"`}
      </div>
      
      {type === 'formal' && (
        <div className="text-xs text-gray-500">
          Remember to include proper salutation and closing for a formal {recipient ? 'letter' : 'email'}.
        </div>
      )}
      
      <textarea
        className="border rounded p-2 h-64"
        value={content}
        onChange={handleChange}
        placeholder={`Write your ${type} ${recipient ? 'letter' : 'email'} here`}
      />
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!content}
      >
        Submit
      </button>
    </div>
  );
};