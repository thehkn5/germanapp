import React from 'react';
import { ExerciseProps } from '../exercise-session';

type SummarizingProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  summaryPrompt: string;
  sampleSummary?: string;
};

export const Summarizing: React.FC<SummarizingProps> = ({
  audioSrc,
  transcript,
  summaryPrompt,
  sampleSummary,
  onComplete,
  onProgress
}) => {
  const [summary, setSummary] = React.useState('');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleChange = (value: string) => {
    setSummary(value);
    
    // Calculate progress based on summary length
    const progress = value.length > 0 ? 0.5 : 0;
    onProgress?.(progress);
  };

  const handleSubmit = () => {
    // In summarizing exercises, we consider completion when a summary is provided
    // Actual quality would need to be evaluated by teacher/API
    onComplete?.();
    onProgress?.(1);
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
        <div className="text-sm text-gray-600">Listen to the audio and write a summary</div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Transcript:</h3>
        <p className="text-sm">{transcript}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">{summaryPrompt}</h3>
        <textarea
          className="border rounded p-2 w-full min-h-[150px]"
          value={summary}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your summary here..."
        />
        {sampleSummary && (
          <details className="text-sm text-gray-600">
            <summary>Sample Summary</summary>
            <p className="mt-1">{sampleSummary}</p>
          </details>
        )}
      </div>

      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!summary}
      >
        Submit Summary
      </button>
    </div>
  );
};