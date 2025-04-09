import React from 'react';
import { ExerciseProps } from '../exercise-session';

type InterviewProps = ExerciseProps & {
  scenario: string;
  questions: string[];
  minResponseLength: number;
};

export const Interview: React.FC<InterviewProps> = ({
  scenario,
  questions,
  minResponseLength,
  onComplete,
  onProgress
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [userResponses, setUserResponses] = React.useState<Record<number, string>>({});

  const handleResponseChange = (value: string) => {
    setUserResponses(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
    
    // Calculate progress based on response length
    const progress = value.length >= minResponseLength ? 
      0.3 + (0.7 * (currentQuestionIndex + 1) / questions.length) :
      0.3 + (0.7 * currentQuestionIndex / questions.length);
    onProgress?.(progress);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete?.();
      onProgress?.(1);
    }
  };

  const currentResponse = userResponses[currentQuestionIndex] || '';
  const isComplete = currentResponse.length >= minResponseLength;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Interview Scenario:</h2>
        <p className="text-sm">{scenario}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Question {currentQuestionIndex + 1}:</h3>
        <p className="text-sm">{questions[currentQuestionIndex]}</p>
        
        <div className="space-y-2">
          <textarea
            className="border rounded p-2 w-full min-h-[100px]"
            value={currentResponse}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Type your response here..."
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {currentResponse.length}/{minResponseLength} characters
            </span>
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!isComplete}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};