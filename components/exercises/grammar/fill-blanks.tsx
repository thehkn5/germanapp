import React from 'react';
import { ExerciseProps } from '../exercise-session';

type FillBlanksProps = ExerciseProps & {
  sentence: string;
  blanks: {
    id: string;
    correctAnswer: string;
    options?: string[];
  }[];
};

export const FillBlanks: React.FC<FillBlanksProps> = ({
  sentence,
  blanks,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});

  const handleChange = (blankId: string, value: string) => {
    const newAnswers = { ...answers, [blankId]: value };
    setAnswers(newAnswers);
    
    // Check if all blanks are filled
    const allFilled = blanks.every(blank => newAnswers[blank.id]);
    onProgress?.(allFilled ? 1 : 0.5);
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    blanks.forEach(blank => {
      const isCorrect = answers[blank.id] === blank.correctAnswer;
      newFeedback[blank.id] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    
    setFeedback(newFeedback);
    if (allCorrect) onComplete?.();
  };

  // Split sentence into parts with blanks
  const parts = sentence.split(/(\[blank\])/).filter(Boolean);
  let blankIndex = 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">
        {parts.map((part, i) => {
          if (part === '[blank]') {
            const blank = blanks[blankIndex++];
            return (
              <span key={`blank-${blank.id}`} className="inline-block mx-1">
                <select
                  className={`border rounded px-2 py-1 ${feedback[blank.id] !== undefined 
                    ? feedback[blank.id] 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-red-100 border-red-500'
                    : 'border-gray-300'}`}
                  value={answers[blank.id] || ''}
                  onChange={(e) => handleChange(blank.id, e.target.value)}
                >
                  <option value="">Select</option>
                  {(blank.options || [blank.correctAnswer]).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </span>
            );
          }
          return <span key={`text-${i}`}>{part}</span>;
        })}
      </div>
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!Object.keys(answers).length}
      >
        Check Answers
      </button>
    </div>
  );
};