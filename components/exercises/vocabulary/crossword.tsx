import React from 'react';
import { ExerciseProps } from '../exercise-session';

type CrosswordProps = ExerciseProps & {
  words: {
    word: string;
    clue: string;
    startRow: number;
    startCol: number;
    direction: 'across' | 'down';
  }[];
  gridSize: number;
};

export const Crossword: React.FC<CrosswordProps> = ({
  words,
  gridSize,
  onComplete,
  onProgress
}) => {
  const [grid, setGrid] = React.useState<string[][]>(
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))
  );
  const [completedWords, setCompletedWords] = React.useState<string[]>([]);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);
    
    // Check for completed words
    const newlyCompleted = words.filter(word => {
      if (completedWords.includes(word.word)) return false;
      
      const { startRow, startCol, direction, word: targetWord } = word;
      const letters: string[] = [];
      
      for (let i = 0; i < targetWord.length; i++) {
        const r = direction === 'across' ? startRow : startRow + i;
        const c = direction === 'across' ? startCol + i : startCol;
        letters.push(newGrid[r]?.[c] || '');
      }
      
      return letters.join('') === targetWord.toUpperCase();
    }).map(word => word.word);
    
    if (newlyCompleted.length > 0) {
      const newCompleted = [...completedWords, ...newlyCompleted];
      setCompletedWords(newCompleted);
      
      const progress = newCompleted.length / words.length;
      onProgress?.(progress);
      
      if (newCompleted.length === words.length) {
        onComplete?.();
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Crossword Puzzle</h2>
        
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className="relative">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      maxLength={1}
                      className="w-full h-10 text-center border border-gray-300"
                    />
                  </div>
                ))
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Clues</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Across</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {words
                    .filter(word => word.direction === 'across')
                    .map(word => (
                      <li key={`across-${word.word}`} className={completedWords.includes(word.word) ? 'line-through text-gray-500' : ''}>
                        {word.clue}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Down</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {words
                    .filter(word => word.direction === 'down')
                    .map(word => (
                      <li key={`down-${word.word}`} className={completedWords.includes(word.word) ? 'line-through text-gray-500' : ''}>
                        {word.clue}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};