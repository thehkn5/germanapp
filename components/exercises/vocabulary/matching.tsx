import React from 'react';
import { ExerciseProps } from '../exercise-session';

type MatchingProps = ExerciseProps & {
  items: {
    id: string;
    term: string;
    definition: string;
  }[];
};

export const Matching: React.FC<MatchingProps> = ({
  items,
  onComplete,
  onProgress
}) => {
  const [selectedPairs, setSelectedPairs] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});

  const handleMatch = (termId: string, definitionId: string) => {
    const newPairs = { ...selectedPairs, [termId]: definitionId };
    setSelectedPairs(newPairs);
    
    // Check if all items are matched
    const allMatched = items.every(item => newPairs[item.id]);
    onProgress?.(allMatched ? 1 : 0.5);
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    items.forEach(item => {
      const isCorrect = selectedPairs[item.id] === item.id;
      newFeedback[item.id] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    
    setFeedback(newFeedback);
    if (allCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Match the Terms</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Terms</h3>
            {items.map(item => (
              <div 
                key={`term-${item.id}`}
                className={`p-2 rounded cursor-pointer ${selectedPairs[item.id] 
                  ? feedback[item.id] 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                  : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => {
                  // Implement matching logic here
                }}
              >
                {item.term}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Definitions</h3>
            {items.map(item => (
              <div 
                key={`def-${item.id}`}
                className={`p-2 rounded cursor-pointer ${Object.values(selectedPairs).includes(item.id)
                  ? feedback[Object.keys(selectedPairs).find(key => selectedPairs[key] === item.id) || '']
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                  : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => {
                  // Implement matching logic here
                }}
              >
                {item.definition}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={Object.keys(selectedPairs).length !== items.length}
          >
            Check Answers
          </button>
        </div>
      </div>
    </div>
  );
};