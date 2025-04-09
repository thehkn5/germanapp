import React from 'react';
import { ExerciseProps } from '../exercise-session';

type SeparatingSentencesProps = ExerciseProps & {
  complexSentence: string;
  correctAnswers: string[];
};

export const SeparatingSentences: React.FC<SeparatingSentencesProps> = ({
  complexSentence,
  correctAnswers,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<string[]>(['', '']);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    
    // Check if all answers are filled
    const allFilled = newAnswers.every(answer => answer.trim());
    onProgress?.(allFilled ? 0.8 : 0.4);
  };

  const handleSubmit = () => {
    const isCorrect = answers.every((answer, i) => 
      answer.trim().toLowerCase() === correctAnswers[i].trim().toLowerCase()
    );
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-medium">{complexSentence}</div>
      
      <div className="space-y-2">
        {answers.map((answer, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label className="text-sm">Sentence {i + 1}:</label>
            <input
              type="text"
              className="border rounded p-2"
              value={answer}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={`Write sentence ${i + 1} here`}
            />
          </div>
        ))}
      </div>
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!answers.every(answer => answer.trim())}
      >
        Check Answer
      </button>
    </div>
  );
};