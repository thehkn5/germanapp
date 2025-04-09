import React from 'react';
import { ExerciseProps } from '../exercise-session';

type WordSearchProps = ExerciseProps & {
  words: string[];
  grid: string[][];
};

export const WordSearch: React.FC<WordSearchProps> = ({
  words,
  grid,
  onComplete,
  onProgress
}) => {
  const [foundWords, setFoundWords] = React.useState<string[]>([]);

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      
      const progress = newFoundWords.length / words.length;
      onProgress?.(progress);
      
      if (newFoundWords.length === words.length) {
        onComplete?.();
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Word Search</h2>
        
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
              {grid.map((row, rowIndex) => (
                row.map((letter, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className="flex items-center justify-center p-2 border border-gray-300 bg-white"
                  >
                    {letter}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {words.map(word => (
              <span 
                key={word}
                className={`px-2 py-1 rounded ${foundWords.includes(word) ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};