import React from 'react';
import { ExerciseProps } from '../exercise-session';

type OpenEndedProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  questions: Array<{
    question: string;
    sampleAnswer?: string;
  }>;
};

export const OpenEnded: React.FC<OpenEndedProps> = ({
  audioSrc,
  transcript,
  questions,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleChange = (questionIndex: number, value: string) => {
    const newAnswers = { ...answers, [questionIndex]: value };
    setAnswers(newAnswers);
    
    // Calculate progress based on answered questions
    const answered = Object.keys(newAnswers).length;
    onProgress?.(answered / questions.length);
  };

  const handleSubmit = () => {
    // In open-ended questions, we consider completion when all questions are answered
    // Actual correctness would need to be evaluated by teacher/API
    onComplete?.();
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <audio ref={audioRef} src={audioSrc} />
        <div className="text-sm text-gray-600">Listen to the audio and answer the questions</div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Transcript:</h3>
        <p className="text-sm">{transcript}</p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-medium">{question.question}</h3>
            <textarea
              className="border rounded p-2 w-full min-h-[100px]"
              value={answers[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Type your answer here..."
            />
            {question.sampleAnswer && (
              <details className="text-sm text-gray-600">
                <summary>Sample Answer</summary>
                <p className="mt-1">{question.sampleAnswer}</p>
              </details>
            )}
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!allAnswered}
      >
        Submit Answers
      </button>
    </div>
  );
};