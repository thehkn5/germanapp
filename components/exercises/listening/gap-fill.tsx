import React from 'react';
import { ExerciseProps } from '../exercise-session';

type GapFillProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  gaps: Array<{
    position: number;
    correctAnswer: string;
    options?: string[];
  }>;
};

export const GapFill: React.FC<GapFillProps> = ({
  audioSrc,
  transcript,
  gaps,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleChange = (gapId: string, value: string) => {
    const newAnswers = { ...answers, [gapId]: value };
    setAnswers(newAnswers);
    
    // Calculate progress based on filled gaps
    const filled = Object.keys(newAnswers).length;
    onProgress?.(filled / gaps.length);
  };

  const handleSubmit = () => {
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    gaps.forEach(gap => {
      const isCorrect = answers[gap.position] === gap.correctAnswer;
      newFeedback[gap.position] = isCorrect;
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

  // Split transcript into parts with gaps
  const parts = transcript.split(/(\[gap\])/).filter(Boolean);
  let gapIndex = 0;

  const allFilled = Object.keys(answers).length === gaps.length;

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
        <div className="text-sm text-gray-600">Listen to the audio and fill in the missing words</div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Transcript:</h3>
        <p className="text-sm">
          {parts.map((part, i) => {
            if (part === '[gap]') {
              const gap = gaps[gapIndex++];
              return (
                <span key={`gap-${gap.position}`} className="inline-block mx-1">
                  <select
                    className={`border rounded px-2 py-1 ${feedback[gap.position] !== undefined 
                      ? feedback[gap.position] 
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-red-100 border-red-500'
                      : 'border-gray-300'}`}
                    value={answers[gap.position] || ''}
                    onChange={(e) => handleChange(gap.position, e.target.value)}
                  >
                    <option value="">Select</option>
                    {(gap.options || [gap.correctAnswer]).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </span>
              );
            }
            return <span key={`text-${i}`}>{part}</span>;
          })}
        </p>
      </div>

      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!allFilled}
      >
        Check Answers
      </button>
    </div>
  );
};