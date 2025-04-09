import React from 'react';
import { ExerciseProps } from '../exercise-session';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type EventOrderingProps = ExerciseProps & {
  audioSrc: string;
  transcript: string;
  events: Array<{
    id: string;
    text: string;
  }>;
  correctOrder: string[];
};

export const EventOrdering: React.FC<EventOrderingProps> = ({
  audioSrc,
  transcript,
  events,
  correctOrder,
  onComplete,
  onProgress
}) => {
  const [items, setItems] = React.useState(events);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    
    setItems(newItems);
    onProgress?.(0.5); // Partial progress for attempting
  };

  const handleSubmit = () => {
    const currentOrder = items.map(item => item.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    
    if (correct) {
      onComplete?.();
      onProgress?.(1);
    }
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
        <div className="text-sm text-gray-600">Listen to the audio and arrange events in order</div>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Transcript:</h3>
        <p className="text-sm">{transcript}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="events">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 border rounded bg-white flex items-center"
                    >
                      <span className="mr-2 text-gray-500">{index + 1}.</span>
                      <span>{item.text}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Check Order
      </button>

      {isCorrect !== null && (
        <div className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct! The events are in the right order.' : 'Incorrect. Try listening again and rearranging.'}
        </div>
      )}
    </div>
  );
};