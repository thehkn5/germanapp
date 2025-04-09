"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useVideoData } from "@/hooks/use-video-data"
import { AuthCheck } from "@/components/auth-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { LearningSessionTimer } from "@/components/learning-session-timer"
import { LearningSessionResults } from "@/components/learning-session-results"
import { ExerciseSettings } from "@/components/exercise-settings"

// Import placeholder data
import exerciseData from "@/data/exercise-questions.json"
import { SentenceWriting } from "@/components/exercises/writing/sentence-writing"
import { SentenceTransformation } from "@/components/exercises/grammar/sentence-transformation"
import { CombiningSentences } from "@/components/exercises/grammar/combining-sentences"

export default function ExercisesPage() {
  const { id } = useParams()
  const { videos } = useVideoData()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [exerciseQuestions, setExerciseQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<string[]>([]) // Add answers state
  const [timerDuration, setTimerDuration] = useState(15 * 60) // 15 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration)
  const [results, setResults] = useState<{
    correct: number
    total: number
    timeTaken: number
    mistakes?: Array<{
      question: string
      userAnswer: string
      correctAnswer: string
      explanation?: string
    }>
  }>({ correct: 0, total: 0, timeTaken: 0 })
  const router = useRouter()

  useEffect(() => {
    if (videos.length > 0) {
      const foundVideo = videos.find((v) => v.id === id)
      if (foundVideo) {
        setVideo(foundVideo)
      } else {
        router.push("/videos")
      }
      setLoading(false)
    }
  }, [id, videos, router])

  const startSession = (settings: {
    exerciseTypes: string[]
    numberOfQuestions: number
    difficulty: "easy" | "medium" | "hard"
    duration: number
    feedbackTiming: "immediate" | "delayed" | "end"
    showExplanations: boolean
  }) => {
    // Import sample exercises data for preview
    import("@/data/sample-exercises").then(({ getSampleExercises }) => {
      // Get sample exercises based on selected exercise types
      const sampleExercises = getSampleExercises(settings.exerciseTypes, settings.numberOfQuestions);
      
      // Set the exercises for the session
      setExerciseQuestions(sampleExercises);
      setTimerDuration(settings.duration) // Use the selected duration
      setTimeRemaining(settings.duration)
      setSessionStarted(true)
      setCurrentExerciseIndex(0)
      setSelectedAnswer(null)
    });
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }

  const goToNextExercise = () => {
    if (!selectedAnswer) return

    if (currentExerciseIndex < exerciseQuestions.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setSelectedAnswer(null)
    } else {
      completeSession()
    }
  }

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const completeSession = () => {
    const timeTaken = timerDuration - timeRemaining
    let correctCount = 0
    const mistakes: Array<{
      question: string
      userAnswer: string
      correctAnswer: string
      explanation?: string
    }> = []

    exerciseQuestions.forEach((question, index) => {
      if (selectedAnswer && selectedAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim()) {
        correctCount++
      } else {
        mistakes.push({
          question: question.question,
          userAnswer: selectedAnswer || "",
          correctAnswer: question.answer,
          explanation: question.explanation
        })
      }
    })

    setResults({
      correct: correctCount,
      total: exerciseQuestions.length,
      timeTaken,
      mistakes
    })

    setSessionCompleted(true)
  }

  const resetSession = () => {
    setSessionStarted(false)
    setSessionCompleted(false)
    setCurrentExerciseIndex(0)
    setSelectedAnswer(null)
    setExerciseQuestions([])
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!video) {
    return null // Will redirect in useEffect
  }

  if (!video) {
    return (
      <AuthCheck>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push(`/videos/${id}`)} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Video
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Exercises - {video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No exercises available for this video.</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push(`/videos/${id}`)}>Return to Video</Button>
            </CardFooter>
          </Card>
        </div>
      </AuthCheck>
    )
  }

  if (!sessionStarted) {
    return (
      <AuthCheck>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push(`/videos/${id}`)} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Video
            </Button>
          </div>

          <ExerciseSettings
            title={`Exercises - ${video.title}`}
            description="Select exercise types and settings to begin."
            videoType={video.type || "Integrated"}
            onStart={startSession}
          />
        </div>
      </AuthCheck>
    )
  }

  if (sessionCompleted) {
    return (
      <AuthCheck>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push(`/videos/${id}`)} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Video
            </Button>
          </div>

          <LearningSessionResults
            title="Exercise Results"
            results={results}
            onReset={resetSession}
            onReturn={() => router.push(`/videos/${id}`)}
          />
        </div>
      </AuthCheck>
    )
  }

const currentExercise = exerciseQuestions[currentExerciseIndex]
const progress = ((currentExerciseIndex + 1) / exerciseQuestions.length) * 100

  return (
    <AuthCheck>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
                router.push(`/videos/${id}`)
              }
            }}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit Exercises
          </Button>

          <LearningSessionTimer
            duration={timerDuration}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            onComplete={completeSession}
          />
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              Exercise {currentExerciseIndex + 1} of {video.exercises.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Progress value={progress} className="mb-6" />

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{currentExercise.title}</h3>
                <p className="text-muted-foreground mb-4">{currentExercise.instruction}</p>
              </div>

              {currentExercise.type === 'sentence-writing' && (
              <SentenceWriting
                prompt={currentExercise.question}
                vocabulary={currentExercise.vocabulary}
                correctAnswers={currentExercise.correctAnswers}
                onComplete={goToNextExercise}
                onProgress={() => {}}
              />
            )}
            
            {currentExercise.type === 'sentence-transformation' && (
              <SentenceTransformation
                originalSentence={currentExercise.originalSentence}
                instruction={currentExercise.instruction}
                correctAnswer={currentExercise.correctAnswer}
                onComplete={goToNextExercise}
                onProgress={() => {}}
              />
            )}
            
            {currentExercise.type === 'combining-sentences' && (
              <CombiningSentences
                sentences={currentExercise.sentences}
                conjunctions={currentExercise.conjunctions}
                correctAnswer={currentExercise.correctAnswer}
                onComplete={goToNextExercise}
                onProgress={() => {}}
              />
            )}
            
            {!['sentence-writing', 'sentence-transformation', 'combining-sentences'].includes(currentExercise.type) && (
              <Input
                placeholder="Your answer..."
                value={answers[currentExerciseIndex] || ""}
                onChange={(e) => handleAnswerChange(currentExerciseIndex, e.target.value)}
              />
            )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousExercise} disabled={currentExerciseIndex === 0}>
              Previous
            </Button>

            <Button onClick={goToNextExercise} disabled={!answers[currentExerciseIndex]}>
              {currentExerciseIndex === video.exercises.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthCheck>
  )
}
