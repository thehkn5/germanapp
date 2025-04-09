"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MultipleChoice } from "./vocabulary/multiple-choice"
import { Matching } from "./vocabulary/matching"
import { TrueFalse } from "./vocabulary/true-false"
import { WordSearchExercise } from "./word-search"
import { CrosswordExercise } from "./crossword"
import { SentenceTransformation } from "./grammar/sentence-transformation"
import { CombiningSentences } from "./grammar/combining-sentences"
import { LearningSessionTimer } from "@/components/learning-session-timer"
import { LearningSessionResults } from "@/components/learning-session-results"

interface ExerciseSessionProps {
  exercises: Array<{
    id: string
    type: string
    question: string
    options?: string[]
    correctAnswer?: string | boolean
    grid?: string[][] | Array<Array<{
      row: number
      col: number
      letter: string
      number?: number
      isStart?: boolean
      direction?: 'across' | 'down' | 'both'
    }>>
    words?: string[]
    clues?: Array<{
      number: number
      direction: 'across' | 'down'
      clue: string
      answer: string
      startRow: number
      startCol: number
    }>
    blanks?: Array<{
      id: string
      answer: string
      position: number
      hint?: string
    }>
    pairs?: Array<{
      id: string
      left: string
      right: string
      explanation?: string
    }>
    explanation?: string
  }>
  settings: {
    duration: number
    difficulty: "easy" | "medium" | "hard"
    feedbackTiming: "immediate" | "delayed" | "end"
    showExplanations: boolean
  }
  onComplete: (results: {
    correct: number
    total: number
    timeTaken: number
    mistakes: Array<{
      question: string
      userAnswer: string
      correctAnswer: string
      explanation?: string
    }>
  }) => void
  onExit: () => void
}

export function ExerciseSession({
  exercises,
  settings,
  onComplete,
  onExit,
}: ExerciseSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [mistakes, setMistakes] = useState<Array<{
    question: string
    userAnswer: string
    correctAnswer: string
    explanation?: string
  }>>([])
  const [timeRemaining, setTimeRemaining] = useState(settings.duration)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  useEffect(() => {
    if (timeRemaining <= 0 && !sessionCompleted) {
      completeSession()
    }
  }, [timeRemaining, sessionCompleted])

  const handleAnswer = (isCorrect: boolean, userAnswer: string = "") => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    } else {
      const exercise = exercises[currentExerciseIndex]
      setMistakes((prev) => [
        ...prev,
        {
          question: exercise.question,
          userAnswer,
          correctAnswer: String(exercise.correctAnswer || ""),
          explanation: exercise.explanation,
        },
      ])
    }

    const moveToNext = () => {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
      } else {
        completeSession()
      }
    }

    if (settings.feedbackTiming === "delayed") {
      setTimeout(moveToNext, 2000)
    } else {
      moveToNext()
    }
  }

  const completeSession = () => {
    const timeTaken = settings.duration - timeRemaining
    setSessionCompleted(true)
    onComplete({
      correct: correctAnswers,
      total: exercises.length,
      timeTaken,
      mistakes,
    })
  }

  if (sessionCompleted) {
    return (
      <LearningSessionResults
        title="Exercise Session"
        results={{
          correct: correctAnswers,
          total: exercises.length,
          timeTaken: settings.duration - timeRemaining,
          mistakes,
        }}
        onReset={() => onExit()}
        onReturn={() => onExit()}
      />
    )
  }

  const currentExercise = exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100

  const renderExercise = () => {
    const commonProps = {
      onComplete: handleAnswer,
      onProgress: () => {},
      explanation: settings.showExplanations ? currentExercise.explanation : undefined,
    }

    switch (currentExercise.type) {
      case "multiple-choice":
        return (
          <MultipleChoice
            {...commonProps}
            question={currentExercise.question}
            options={currentExercise.options || []}
            correctAnswer={currentExercise.correctAnswer || ""}
          />
        )
      case "matching":
        return (
          <Matching
            {...commonProps}
            title={currentExercise.question}
            pairs={currentExercise.pairs || []}
          />
        )
      case "true-false":
        return (
          <TrueFalse
            {...commonProps}
            question={currentExercise.question}
            correctAnswer={currentExercise.correctAnswer as boolean}
          />
        )
      case "word-search":
        return (
          <WordSearchExercise
            {...commonProps}
            question={currentExercise.question}
            grid={currentExercise.grid as string[][]}
            words={currentExercise.words || []}
          />
        )
      case "crossword":
        return (
          <CrosswordExercise
            {...commonProps}
            question={currentExercise.question}
            grid={currentExercise.grid as Array<Array<{
              row: number
              col: number
              letter: string
              number?: number
              isStart?: boolean
              direction?: 'across' | 'down' | 'both'
            }>>}
            clues={currentExercise.clues || []}
          />
        )
      case "sentence-transformation":
        return (
          <SentenceTransformation
            {...commonProps}
            originalSentence={currentExercise.question}
            instruction={currentExercise.explanation || ""}
            correctAnswer={currentExercise.correctAnswer || ""}
          />
        )
      case "combining-sentences":
        return (
          <CombiningSentences
            {...commonProps}
            sentences={currentExercise.options || []}
            conjunctions={currentExercise.words || []}
            correctAnswer={currentExercise.correctAnswer || ""}
          />
        )
      case "fill-in-the-blank":
        return (
          <MultipleChoice
            {...commonProps}
            question={currentExercise.instruction}
            options={[{id: "1", text: currentExercise.answer, isCorrect: true}]}
          />
        )
      case "translation":
        return (
          <MultipleChoice
            {...commonProps}
            question={currentExercise.instruction}
            options={[{id: "1", text: currentExercise.answer, isCorrect: true}]}
          />
        )
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Unsupported Exercise Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This exercise type is not currently supported.</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1">
            Question {currentExerciseIndex + 1} of {exercises.length}
          </p>
        </div>
        <div className="ml-4">
          <LearningSessionTimer
            duration={settings.duration}
            timeRemaining={timeRemaining}
            onTimeUpdate={setTimeRemaining}
          />
        </div>
      </div>

      {renderExercise()}
    </div>
  )
}