import React from 'react';
import { ExerciseProps } from '../exercise-session';

type EssayWritingProps = ExerciseProps & {
  topic: string;
  instructions?: string;
  wordCount?: number;
};

export const EssayWriting: React.FC<EssayWritingProps> = ({
  topic,
  instructions,
  wordCount,
  onComplete,
  onProgress
}) => {
  const [introduction, setIntroduction] = React.useState('');
  const [body, setBody] = React.useState('');
  const [conclusion, setConclusion] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (section: string, value: string) => {
    if (section === 'introduction') setIntroduction(value);
    if (section === 'body') setBody(value);
    if (section === 'conclusion') setConclusion(value);
    
    // Calculate progress based on word count if specified
    if (wordCount) {
      const totalWords = [introduction, body, conclusion]
        .join(' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;
      onProgress?.(Math.min(totalWords / wordCount, 1));
    } else {
      const hasContent = introduction || body || conclusion;
      onProgress?.(hasContent ? 0.5 : 0);
    }
  };

  const handleSubmit = () => {
    setFeedback('Submitted!');
    onComplete?.();
  };

  const allSectionsFilled = introduction && body && conclusion;

  return (
    <div className="flex flex-col gap-6">
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
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Introduction</label>
          <textarea
            className="border rounded p-2 w-full h-32"
            value={introduction}
            onChange={(e) => handleChange('introduction', e.target.value)}
            placeholder="Write your introduction here"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea
            className="border rounded p-2 w-full h-48"
            value={body}
            onChange={(e) => handleChange('body', e.target.value)}
            placeholder="Write your body paragraphs here"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Conclusion</label>
          <textarea
            className="border rounded p-2 w-full h-32"
            value={conclusion}
            onChange={(e) => handleChange('conclusion', e.target.value)}
            placeholder="Write your conclusion here"
          />
        </div>
      </div>
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!allSectionsFilled}
      >
        Submit
      </button>
    </div>
  );
};