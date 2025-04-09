import React from 'react';
import { ExerciseProps } from '../exercise-session';

type CombiningSentencesProps = ExerciseProps & {
  sentences: string[];
  conjunctions: string[];
  correctAnswer: string;
};

export const CombiningSentences: React.FC<CombiningSentencesProps> = ({
  sentences,
  conjunctions,
  correctAnswer,
  onComplete,
  onProgress
}) => {
  const [selectedConjunction, setSelectedConjunction] = React.useState('');
  const [combinedSentence, setCombinedSentence] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleConjunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedConjunction(value);
    onProgress?.(value ? 0.3 : 0);
  };

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCombinedSentence(value);
    onProgress?.(value ? 0.6 : (selectedConjunction ? 0.3 : 0));
  };

  const handleSubmit = () => {
    const isCorrect = combinedSentence.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        {sentences.map((sentence, i) => (
          <div key={i} className="text-lg">{sentence}</div>
        ))}
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Select a conjunction:</label>
        <select
          className="border rounded p-2"
          value={selectedConjunction}
          onChange={handleConjunctionChange}
        >
          <option value="">Select conjunction</option>
          {conjunctions.map(conj => (
            <option key={conj} value={conj}>{conj}</option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Write your combined sentence:</label>
        <input
          type="text"
          className="border rounded p-2"
          value={combinedSentence}
          onChange={handleSentenceChange}
          placeholder="Combine the sentences here"
        />
      </div>
      
      {feedback && (
        <div className={`text-sm ${feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!selectedConjunction || !combinedSentence}
      >
        Check Answer
      </button>
    </div>
  );
};