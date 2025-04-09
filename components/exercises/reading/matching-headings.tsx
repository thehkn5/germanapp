import React from 'react';
import { ExerciseProps } from '../exercise-session';

type MatchingHeadingsProps = ExerciseProps & {
  paragraphs: string[];
  headings: string[];
  correctMatches: Record<number, number>; // paragraph index to heading index
};

export const MatchingHeadings: React.FC<MatchingHeadingsProps> = ({
  paragraphs,
  headings,
  correctMatches,
  onComplete,
  onProgress
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<number, number>>({});
  const [feedback, setFeedback] = React.useState<Record<number, boolean>>({});

  const handleChange = (paragraphIndex: number, headingIndex: number) => {
    const newSelections = { ...selectedOptions, [paragraphIndex]: headingIndex };
    setSelectedOptions(newSelections);
    
    // Check if all paragraphs have a selection
    const allSelected = paragraphs.every((_, i) => newSelections[i] !== undefined);
    onProgress?.(allSelected ? 1 : 0.5);
  };

  const handleSubmit = () => {
    const newFeedback: Record<number, boolean> = {};
    let allCorrect = true;
    
    Object.entries(selectedOptions).forEach(([pIndex, hIndex]) => {
      const isCorrect = correctMatches[Number(pIndex)] === hIndex;
      newFeedback[Number(pIndex)] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    
    setFeedback(newFeedback);
    if (allCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph, pIndex) => (
        <div key={`p-${pIndex}`} className="space-y-2">
          <div className="text-lg">{paragraph}</div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Select the correct heading:</label>
            <select
              className={`border rounded p-2 ${feedback[pIndex] !== undefined 
                ? feedback[pIndex] 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-red-100 border-red-500'
                : 'border-gray-300'}`}
              value={selectedOptions[pIndex] ?? ''}
              onChange={(e) => handleChange(pIndex, Number(e.target.value))}
            >
              <option value="">Select heading</option>
              {headings.map((heading, hIndex) => (
                <option key={`h-${hIndex}`} value={hIndex}>{heading}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={Object.keys(selectedOptions).length !== paragraphs.length}
      >
        Check Answers
      </button>
    </div>
  );
};