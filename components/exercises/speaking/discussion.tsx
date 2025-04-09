import React from 'react';
import { ExerciseProps } from '../exercise-session';

type DiscussionProps = ExerciseProps & {
  topic: string;
  discussionPoints: string[];
  minResponseLength: number;
};

export const Discussion: React.FC<DiscussionProps> = ({
  topic,
  discussionPoints,
  minResponseLength,
  onComplete,
  onProgress
}) => {
  const [currentPointIndex, setCurrentPointIndex] = React.useState(0);
  const [userResponses, setUserResponses] = React.useState<Record<number, string>>({});

  const handleResponseChange = (value: string) => {
    setUserResponses(prev => ({
      ...prev,
      [currentPointIndex]: value
    }));
    
    // Calculate progress based on response length
    const progress = value.length >= minResponseLength ? 
      0.3 + (0.7 * (currentPointIndex + 1) / discussionPoints.length) :
      0.3 + (0.7 * currentPointIndex / discussionPoints.length);
    onProgress?.(progress);
  };

  const handleNextPoint = () => {
    if (currentPointIndex < discussionPoints.length - 1) {
      setCurrentPointIndex(prev => prev + 1);
    } else {
      onComplete?.();
      onProgress?.(1);
    }
  };

  const currentResponse = userResponses[currentPointIndex] || '';
  const isComplete = currentResponse.length >= minResponseLength;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Discussion Topic:</h2>
        <p className="text-sm">{topic}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Point {currentPointIndex + 1}:</h3>
        <p className="text-sm">{discussionPoints[currentPointIndex]}</p>
        
        <div className="space-y-2">
          <textarea
            className="border rounded p-2 w-full min-h-[100px]"
            value={currentResponse}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Share your thoughts on this point..."
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {currentResponse.length}/{minResponseLength} characters
            </span>
            <button
              onClick={handleNextPoint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!isComplete}
            >
              {currentPointIndex < discussionPoints.length - 1 ? 'Next' : 'Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};