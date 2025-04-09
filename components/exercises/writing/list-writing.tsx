import React from 'react';
import { ExerciseProps } from '../exercise-session';

type ListWritingProps = ExerciseProps & {
  topic: string;
  minimumItems?: number;
};

export const ListWriting: React.FC<ListWritingProps> = ({
  topic,
  minimumItems,
  onComplete,
  onProgress
}) => {
  const [items, setItems] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setItems(value);
    
    // Calculate progress based on item count if specified
    if (minimumItems) {
      const itemCount = value.trim().split('\n').filter(Boolean).length;
      onProgress?.(Math.min(itemCount / minimumItems, 1));
    } else {
      onProgress?.(value ? 0.5 : 0);
    }
  };

  const handleSubmit = () => {
    setFeedback('Submitted!');
    onComplete?.();
  };

  const meetsMinimumItems = !minimumItems || 
    items.trim().split('\n').filter(Boolean).length >= minimumItems;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">List items about: {topic}</div>
      
      {minimumItems && (
        <div className="text-sm text-gray-600">
          Minimum {minimumItems} items
        </div>
      )}
      
      <textarea
        className="border rounded p-2 h-48 font-mono"
        value={items}
        onChange={handleChange}
        placeholder="Enter one item per line"
      />
      
      {feedback && (
        <div className="text-sm text-blue-600">
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!items || !meetsMinimumItems}
      >
        Submit
      </button>
    </div>
  );
};