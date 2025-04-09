import React from 'react';
import { ExerciseProps } from '../exercise-session';

type OrderingWordsProps = ExerciseProps & {
  words: string[];
  correctOrder: number[];
};

export const OrderingWords: React.FC<OrderingWordsProps> = ({
  words,
  correctOrder,
  onComplete,
  onProgress
}) => {
  const [selectedOrder, setSelectedOrder] = React.useState<number[]>([]);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleWordClick = (index: number) => {
    if (selectedOrder.includes(index)) {
      setSelectedOrder(selectedOrder.filter(i => i !== index));
    } else {
      setSelectedOrder([...selectedOrder, index]);
    }
    onProgress?.(selectedOrder.length ? 0.5 : 0);
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(correctOrder);
    setFeedback(isCorrect ? 'Correct!' : 'Try again!');
    if (isCorrect) onComplete?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">
        {selectedOrder.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedOrder.map((wordIndex, i) => (
              <span 
                key={`selected-${i}`} 
                className="bg-blue-100 px-3 py-1 rounded"
              >
                {words[wordIndex]}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">Click words to build your sentence</div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {words.map((word, i) => (
          <button
            key={i}
            onClick={() => handleWordClick(i)}
            disabled={selectedOrder.includes(i)}
            className={`px-3 py-1 rounded ${selectedOrder.includes(i) 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-blue-50 hover:bg-blue-100'}`}
          >
            {word}
          </button>
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
        disabled={!selectedOrder.length}
      >
        Check Sentence
      </button>
    </div>
  );
};