import React from 'react';
import { ExerciseProps } from '../exercise-session';

type GapFillProps = ExerciseProps & {
  text: string;
  gaps: number;
  minAccuracy: number;
};

export const GapFill: React.FC<GapFillProps> = ({
  text,
  gaps,
  minAccuracy,
  onComplete,
  onProgress
}) => {
  const [userAnswers, setUserAnswers] = React.useState<string[]>(Array(gaps).fill(''));
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
    
    // Calculate progress based on filled gaps
    const filled = newAnswers.filter(a => a.trim().length > 0).length;
    const progress = filled / gaps;
    onProgress?.(progress);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // TODO: Implement accuracy check logic
    onComplete?.();
    onProgress?.(1);
  };

  // Split text into parts with gaps
  const textParts = text.split('___');
  
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Fill in the Blanks</h2>
        
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm">
              {textParts.map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < textParts.length - 1 && (
                    <input
                      type="text"
                      value={userAnswers[i]}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      className="border-b-2 border-blue-500 mx-1 w-24"
                      disabled={isSubmitted}
                    />
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={userAnswers.some(a => !a.trim()) || isSubmitted}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};