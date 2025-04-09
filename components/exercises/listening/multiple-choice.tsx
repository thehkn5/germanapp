import React from 'react';
import { ExerciseProps } from '../exercise-session';

type MultipleChoiceProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
};

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  audioSrc,
  transcript,
  questions,
  onComplete,
  onProgress
}) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [feedback, setFeedback] = React.useState<Record<string, boolean>>({});
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
    const newFeedback: Record<string, boolean> = {};
    let allCorrect = true;
    
    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
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
            <div className="space-y-2">
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${index}-o${i}`}
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleChange(index, option)}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`q${index}-o${i}`}
                    className={`${feedback[index] !== undefined 
                      ? feedback[index] && answers[index] === option
                        ? 'text-green-600'
                        : !feedback[index] && answers[index] === option
                          ? 'text-red-600'
                          : ''
                      : ''}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
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