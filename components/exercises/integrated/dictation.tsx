import React from 'react';
import { ExerciseProps } from '../exercise-session';

type DictationProps = ExerciseProps & {
  audioUrl: string;
  minAccuracy: number;
  maxAttempts: number;
};

export const Dictation: React.FC<DictationProps> = ({
  audioUrl,
  minAccuracy,
  maxAttempts,
  onComplete,
  onProgress
}) => {
  const [userText, setUserText] = React.useState('');
  const [attempts, setAttempts] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleTextChange = (value: string) => {
    setUserText(value);
    
    // Calculate progress based on text length
    const progress = value.length > 0 ? 0.5 : 0;
    onProgress?.(progress);
  };

  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    // TODO: Implement accuracy check logic
    
    if (attempts >= maxAttempts - 1) {
      onComplete?.();
      onProgress?.(1);
    }
  };

  const playAudio = () => {
    setIsPlaying(true);
    // TODO: Implement audio playback
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Dictation Exercise</h2>
        
        <div className="flex items-center gap-4">
          <button
            onClick={playAudio}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isPlaying}
          >
            {isPlaying ? 'Playing...' : 'Play Audio'}
          </button>
          <span className="text-sm text-gray-500">
            Attempts: {attempts}/{maxAttempts}
          </span>
        </div>

        <div className="space-y-2">
          <textarea
            className="border rounded p-2 w-full min-h-[150px]"
            value={userText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Write what you hear..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleCheck}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={!userText || attempts >= maxAttempts}
            >
              {attempts >= maxAttempts - 1 ? 'Complete' : 'Check'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};