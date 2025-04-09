import React from 'react';
import { ExerciseProps } from '../exercise-session';

type ConjugationDeclensionProps = ExerciseProps & {
  table: {
    headers: string[];
    rows: {
      cells: {
        correctAnswer: string;
        inputType?: 'text' | 'select';
        options?: string[];
      }[];
    }[];
  };
};

export const ConjugationDeclension: React.FC<ConjugationDeclensionProps> = ({
  table,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});

  const handleChange = (rowIndex: number, cellIndex: number, value: string) => {
    const key = `${rowIndex}-${cellIndex}`;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    // Check if all cells are filled
    const allFilled = table.rows.every((row, rIdx) => 
      row.cells.every((cell, cIdx) => {
        if (cIdx === 0) return true; // Skip header cells
        return newAnswers[`${rIdx}-${cIdx}`];
      })
    );
    onProgress?.(allFilled ? 0.8 : 0.4);
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    table.rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, cellIndex) => {
        if (cellIndex === 0) return; // Skip header cells
        
        const key = `${rowIndex}-${cellIndex}`;
        const isCorrect = answers[key] === cell.correctAnswer;
        newFeedback[key] = isCorrect;
        
        if (!isCorrect) allCorrect = false;
      });
    });
    
    setFeedback(newFeedback);
    if (allCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              {table.headers.map((header, i) => (
                <th key={i} className="border px-4 py-2 bg-gray-50">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  if (cellIndex === 0) {
                    return (
                      <td key={`${rowIndex}-${cellIndex}`} className="border px-4 py-2 bg-gray-50">
                        {cell.correctAnswer}
                      </td>
                    );
                  }
                  
                  const key = `${rowIndex}-${cellIndex}`;
                  const isCorrect = feedback[key];
                  
                  return (
                    <td key={key} className="border px-4 py-2">
                      {cell.inputType === 'select' ? (
                        <select
                          className={`w-full p-1 ${isCorrect !== undefined 
                            ? isCorrect 
                              ? 'bg-green-100 border-green-500' 
                              : 'bg-red-100 border-red-500'
                            : 'border-gray-300'}`}
                          value={answers[key] || ''}
                          onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value)}
                        >
                          <option value="">Select</option>
                          {(cell.options || [cell.correctAnswer]).map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className={`w-full p-1 ${isCorrect !== undefined 
                            ? isCorrect 
                              ? 'bg-green-100 border-green-500' 
                              : 'bg-red-100 border-red-500'
                            : 'border-gray-300'}`}
                          value={answers[key] || ''}
                          onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value)}
                          placeholder="Fill in"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={Object.keys(answers).length === 0}
      >
        Check Answers
      </button>
    </div>
  );
};