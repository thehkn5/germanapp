import React from 'react';
import { ExerciseProps } from '../exercise-session';

type DefinitionsProps = ExerciseProps & {
  words: {
    id: string;
    word: string;
    definition: string;
  }[];
};

export const Definitions: React.FC<DefinitionsProps> = ({
  words,
  onComplete,
  onProgress
}) => {
  const [userDefinitions, setUserDefinitions] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});

  const handleChange = (wordId: string, value: string) => {
    const newDefinitions = { ...userDefinitions, [wordId]: value };
    setUserDefinitions(newDefinitions);
    
    // Check if all words have definitions
    const allDefined = words.every(word => newDefinitions[word.id]);
    onProgress?.(allDefined ? 1 : 0.5);
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    words.forEach(word => {
      const isCorrect = userDefinitions[word.id]?.toLowerCase().trim() === word.definition.toLowerCase().trim();
      newFeedback[word.id] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    
    setFeedback(newFeedback);
    if (allCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Write Definitions</h2>
        
        <div className="space-y-4">
          {words.map(word => (
            <div key={word.id} className="space-y-2">
              <div className="font-medium">{word.word}</div>
              <textarea
                value={userDefinitions[word.id] || ''}
                onChange={(e) => handleChange(word.id, e.target.value)}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Write your definition here..."
              />
              {feedback[word.id] !== undefined && (
                <div className={`text-sm ${feedback[word.id] ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback[word.id] ? 'Correct!' : `Expected: ${word.definition}`}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={Object.keys(userDefinitions).length !== words.length}
          >
            Check Answers
          </button>
        </div>
      </div>
    </div>
  );
};