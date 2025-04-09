import React from 'react';
import { ExerciseProps } from '../exercise-session';

type TranslationProps = ExerciseProps & {
  sourceText: string;
  targetLanguage: string;
  minAccuracy: number;
};

export const Translation: React.FC<TranslationProps> = ({
  sourceText,
  targetLanguage,
  minAccuracy,
  onComplete,
  onProgress
}) => {
  const [userTranslation, setUserTranslation] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleTranslationChange = (value: string) => {
    setUserTranslation(value);
    
    // Calculate progress based on translation length
    const progress = value.length > 0 ? 0.5 : 0;
    onProgress?.(progress);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // TODO: Implement accuracy check logic
    onComplete?.();
    onProgress?.(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Translate to {targetLanguage}</h2>
        
        <div className="space-y-2">
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm">{sourceText}</p>
          </div>
          
          <textarea
            className="border rounded p-2 w-full min-h-[150px]"
            value={userTranslation}
            onChange={(e) => handleTranslationChange(e.target.value)}
            placeholder={`Write your ${targetLanguage} translation here...`}
            disabled={isSubmitted}
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={!userTranslation || isSubmitted}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};