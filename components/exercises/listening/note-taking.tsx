import React from 'react';
import { ExerciseProps } from '../exercise-session';

type NoteTakingProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  noteTakingPrompt: string;
};

export const NoteTaking: React.FC<NoteTakingProps> = ({
  audioSrc,
  transcript,
  noteTakingPrompt,
  onComplete,
  onProgress
}) => {
  const [notes, setNotes] = React.useState('');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleChange = (value: string) => {
    setNotes(value);
    
    // Calculate progress based on notes length
    const progress = value.length > 0 ? 0.5 : 0;
    onProgress?.(progress);
  };

  const handleSubmit = () => {
    // In note-taking exercises, we consider completion when notes are provided
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
        <div className="text-sm text-gray-600">Listen to the audio and take notes</div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">{noteTakingPrompt}</h3>
        <textarea
          className="border rounded p-2 w-full min-h-[200px]"
          value={notes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Take notes here while listening..."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Transcript:</h3>
        <p className="text-sm">{transcript}</p>
      </div>

      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!notes}
      >
        Submit Notes
      </button>
    </div>
  );
};