import React from 'react';
import { ExerciseProps } from '../exercise-session';

type TrueFalseProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  statements: Array<{
    statement: string;
    isTrue: boolean;
  }>;
};

export const TrueFalse: React.FC<TrueFalseProps> = ({
  audioSrc,
  transcript,
  statements,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleChange = (statementIndex: number, value: boolean) => {
    const newAnswers = { ...answers, [statementIndex]: value };
    setAnswers(newAnswers);
    
    // Calculate progress based on answered statements
    const answered = Object.keys(newAnswers).length;
    onProgress?.(answered / statements.length);
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    statements.forEach((statement, index) => {
      const isCorrect = answers[index] === statement.isTrue;
      newFeedback[index] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });
    
    setFeedback(newFeedback);
    if (allCorrect) onComplete?.();
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

  const allAnswered = Object.keys(answers).length === statements.length;

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
        <div className="text-sm text-gray-600">Listen to the audio and mark statements as true or false</div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Transcript:</h3>
        <p className="text-sm">{transcript}</p>
      </div>

      <div className="space-y-4">
        {statements.map((statement, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded">
            <span>{statement.statement}</span>
            <div className="flex gap-4">
              <button
                onClick={() => handleChange(index, true)}
                className={`px-3 py-1 rounded ${answers[index] === true 
                  ? feedback[index] !== undefined 
                    ? feedback[index] 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-200'}`}
              >
                True
              </button>
              <button
                onClick={() => handleChange(index, false)}
                className={`px-3 py-1 rounded ${answers[index] === false 
                  ? feedback[index] !== undefined 
                    ? feedback[index] 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-200'}`}
              >
                False
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!allAnswered}
      >
        Check Answers
      </button>
    </div>
  );
};