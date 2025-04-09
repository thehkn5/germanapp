import React from 'react';
import { ExerciseProps } from '../exercise-session';

type PresentationProps = ExerciseProps & {
  topic: string;
  guidelines: string[];
  minDuration: number; // in seconds
};

export const Presentation: React.FC<PresentationProps> = ({
  topic,
  guidelines,
  minDuration,
  onComplete,
  onProgress
}) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedTime, setRecordedTime] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const timerRef = React.useRef<NodeJS.Timeout>();
  const mediaRecorderRef = React.useRef<MediaRecorder>();
  const audioChunksRef = React.useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordedTime(prev => {
          const newTime = prev + 1;
          // Update progress based on recorded time
          const progress = Math.min(0.5 + (0.5 * newTime / minDuration), 1);
          onProgress?.(progress);
          return newTime;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
    setIsSubmitted(true);
    
    if (recordedTime >= minDuration) {
      onComplete?.();
      onProgress?.(1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Presentation Topic:</h2>
        <p className="text-sm">{topic}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Guidelines:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {guidelines.map((guideline, i) => (
            <li key={i}>{guideline}</li>
          ))}
        </ul>
        
        <div className="space-y-2">
          <p className="text-sm">Minimum duration: {minDuration} seconds</p>
          
          {!isSubmitted ? (
            <div className="flex items-center gap-4">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              
              {isRecording && (
                <div className="text-sm">
                  Recording: {recordedTime}s
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm">
              {recordedTime >= minDuration ? (
                <p className="text-green-600">Great job! Your presentation met the minimum duration.</p>
              ) : (
                <p className="text-red-600">Your presentation was too short. Try again with more content.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};