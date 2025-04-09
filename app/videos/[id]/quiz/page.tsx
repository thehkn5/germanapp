"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useVideoData } from "@/hooks/use-video-data"
import { useQuiz } from "@/contexts/quiz-context"
import { AuthCheck } from "@/components/auth-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Check, Clock, Loader2, Sparkles, X, CheckCircle, HelpCircle } from "lucide-react"
import { LearningSessionTimer } from "@/components/learning-session-timer"
import { LearningSessionSettings } from "@/components/learning-session-settings"
import { LearningSessionResults } from "@/components/learning-session-results"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { quizService } from "@/lib/quiz-service"
import { useAuth } from "@/contexts/auth-context"

export default function QuizPage() {
  const { id } = useParams()
  const { videos } = useVideoData()
  const { settings: quizSettings } = useQuiz()
  const { user } = useAuth()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timerDuration, setTimerDuration] = useState(quizSettings.duration)
  const [timeRemaining, setTimeRemaining] = useState(timerDuration)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackDelay, setFeedbackDelay] = useState<NodeJS.Timeout | null>(null)
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
  const [sessionSettings, setSessionSettings] = useState({
    difficulty: quizSettings.difficulty,
    shuffle: quizSettings.shuffle,
    focusMode: quizSettings.focusMode,
    limitQuestions: quizSettings.limitQuestions,
    feedbackTiming: quizSettings.feedbackTiming,
    showExplanations: quizSettings.showExplanations
  })
  const [showAIExplanation, setShowAIExplanation] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState<{
    question: string
    explanation: string
  } | null>(null)
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
    duration: number
    difficulty: "easy" | "medium" | "hard"
    shuffle: boolean
    focusMode: boolean
    limitQuestions?: number
    feedbackTiming: "immediate" | "delayed" | "end"
    showExplanations: boolean
  }) => {
    setTimerDuration(settings.duration)
    setTimeRemaining(settings.duration)
    setSessionStarted(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setSessionSettings(settings)
    setShowFeedback(false)

    // Apply settings
    let questions = [...(video?.quiz?.questions || [])]

    // Apply shuffle if enabled
    if (settings.shuffle) {
      questions = shuffleArray(questions)
    }

    // Apply question limit if set
    if (settings.limitQuestions && settings.limitQuestions < questions.length) {
      questions = questions.slice(0, settings.limitQuestions)
    }

    // Update video with filtered questions
    setVideo({
      ...video,
      quiz: {
        ...video.quiz,
        questions,
      },
    })
  }

  const shuffleArray = (array: any[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[questionIndex] = answerIndex
    setSelectedAnswers(newSelectedAnswers)
    
    // Handle immediate feedback
    if (sessionSettings.feedbackTiming === "immediate") {
      setShowFeedback(true)
    } else if (sessionSettings.feedbackTiming === "delayed") {
      // Clear any existing delay
      if (feedbackDelay) {
        clearTimeout(feedbackDelay)
      }
      
      // Set a new delay (3 seconds)
      const delay = setTimeout(() => {
        setShowFeedback(true)
      }, 3000)
      
      setFeedbackDelay(delay)
    }
  }

  const goToNextQuestion = () => {
    // Clear any existing feedback delay
    if (feedbackDelay) {
      clearTimeout(feedbackDelay)
      setFeedbackDelay(null)
    }
    
    // Hide feedback for the next question
    setShowFeedback(false)
    
    if (currentQuestionIndex < (video?.quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      completeSession()
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const completeSession = async () => {
    try {
      // Clear any existing feedback delay
      if (feedbackDelay) {
        clearTimeout(feedbackDelay)
        setFeedbackDelay(null)
      }
      
      const timeTaken = timerDuration - timeRemaining
      let correctCount = 0
      const mistakes: Array<{
        question: string
        userAnswer: string
        correctAnswer: string
        explanation?: string
      }> = []

      if (video?.quiz?.questions) {
        video.quiz.questions.forEach((question: any, index: number) => {
          if (selectedAnswers[index] === question.answer) {
            correctCount++
          } else if (selectedAnswers[index] !== undefined) {
            // Record mistake
            mistakes.push({
              question: question.question,
              userAnswer: question.options[selectedAnswers[index]],
              correctAnswer: question.options[question.answer],
              explanation: question.explanation || undefined
            })
          }
        })
      }

      const results = {
        correct: correctCount,
        total: video?.quiz?.questions?.length || 0,
        timeTaken,
        mistakes,
      }

      setResults(results)

      // Save quiz attempt to Firebase
      if (user) {
        await quizService.saveQuizAttempt({
          userId: user.uid,
          videoId: video.id,
          score: Math.round((correctCount / (video?.quiz?.questions?.length || 1)) * 100),
          totalQuestions: video?.quiz?.questions?.length || 0,
          correctAnswers: correctCount,
          timeTaken,
          mistakes,
          completedAt: new Date()
        })
      }

      setSessionCompleted(true)
    } catch (error) {
      console.error('Error completing quiz:', error)
      setError('Failed to save quiz results. Please try again.')
    }
  }

  const resetSession = () => {
    setSessionStarted(false)
    setSessionCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowFeedback(false)
    
    // Clear any existing feedback delay
    if (feedbackDelay) {
      clearTimeout(feedbackDelay)
      setFeedbackDelay(null)
    }
  }

  const handleExplainWithAI = (mistakeIndex: number) => {
    const mistake = results.mistakes?.[mistakeIndex]
    if (!mistake) return

    // In a real implementation, this would call an AI API
    // For now, we'll simulate an AI response
    setCurrentExplanation({
      question: mistake.question,
      explanation: `The correct answer is "${mistake.correctAnswer}". This is because in German, ${generateFakeExplanation(mistake)}`,
    })

    setShowAIExplanation(true)
  }

  // Helper function to generate a fake AI explanation
  const generateFakeExplanation = (mistake: any) => {
    const explanations = [
      "the word order follows the subject-verb-object pattern in simple sentences.",
      "nouns are always capitalized, unlike in English.",
      "verbs are conjugated differently based on the subject pronoun.",
      "adjective endings change based on the gender and case of the noun they modify.",
      "modal verbs like 'können' and 'müssen' have special conjugation patterns.",
      "the definite article changes based on the gender and case of the noun.",
    ]

    return explanations[Math.floor(Math.random() * explanations.length)]
  }

  // Wrap the return with AuthCheck
  return (
    <AuthCheck>
      {loading ? (
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {/* Existing component JSX */}
          {!video ? null : !video.quiz || !video.quiz.questions || video.quiz.questions.length === 0 ? (
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
                    <CardTitle>Quiz - {video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>No quiz available for this video.</AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => router.push(`/videos/${id}`)}>Return to Video</Button>
                  </CardFooter>
                </Card>
              </div>
            </AuthCheck>
          ) : !sessionStarted ? (
            <AuthCheck>
              <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                  <Button variant="ghost" onClick={() => router.push(`/videos/${id}`)} className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Video
                  </Button>
                </div>

                <LearningSessionSettings
                  title={`Quiz - ${video.title}`}
                  description="Test your knowledge with this quiz."
                  onStart={startSession}
                />
              </div>
            </AuthCheck>
          ) : sessionCompleted ? (
            <AuthCheck>
              <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                  <Button variant="ghost" onClick={() => router.push(`/videos/${id}`)} className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Video
                  </Button>
                </div>

                <LearningSessionResults
                  title="Quiz Results"
                  results={results}
                  onReset={resetSession}
                  onReturn={() => router.push(`/videos/${id}`)}
                  onExplainWithAI={handleExplainWithAI}
                />
              </div>
            </AuthCheck>
          ) : (
            <>
              {/* Your existing quiz UI */}
              {video?.quiz?.questions && video.quiz.questions.length > 0 && (
                <>
                  {/* Quiz content */}
                  {(() => {
                    const currentQuestion = video.quiz.questions[currentQuestionIndex]
                    const progress = ((currentQuestionIndex + 1) / video.quiz.questions.length) * 100

                    return (
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
                            Exit Quiz
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
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-xl">
                                Question {currentQuestionIndex + 1} of {video.quiz.questions.length}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <Progress value={progress} className="mb-6" />

                            <div className="space-y-6">
                              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

                              <div className="space-y-2">
                                {currentQuestion.options.map((option: string, index: number) => (
                                  <div
                                    key={index}
                                    className={`p-4 rounded-md border cursor-pointer transition-colors ${
                                      selectedAnswers[currentQuestionIndex] === index
                                        ? "bg-primary/10 border-primary"
                                        : "hover:bg-muted/50"
                                    } ${
                                      showFeedback && selectedAnswers[currentQuestionIndex] === index && 
                                      selectedAnswers[currentQuestionIndex] !== currentQuestion.answer
                                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                        : ""
                                    } ${
                                      showFeedback && index === currentQuestion.answer
                                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      if (!showFeedback || sessionSettings.feedbackTiming === "end") {
                                        handleAnswerSelect(currentQuestionIndex, index);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                          selectedAnswers[currentQuestionIndex] === index
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground"
                                        } ${
                                          showFeedback && selectedAnswers[currentQuestionIndex] === index && 
                                          selectedAnswers[currentQuestionIndex] !== currentQuestion.answer
                                            ? "border-red-500 bg-red-500 text-white"
                                            : ""
                                        } ${
                                          showFeedback && index === currentQuestion.answer
                                            ? "border-green-500 bg-green-500 text-white"
                                            : ""
                                        }`}
                                      >
                                        {selectedAnswers[currentQuestionIndex] === index && !showFeedback && (
                                          <Check className="h-3 w-3" />
                                        )}
                                        {showFeedback && selectedAnswers[currentQuestionIndex] === index && 
                                         selectedAnswers[currentQuestionIndex] !== currentQuestion.answer && (
                                          <X className="h-3 w-3" />
                                        )}
                                        {showFeedback && index === currentQuestion.answer && (
                                          <Check className="h-3 w-3" />
                                        )}
                                      </div>
                                      <span>{option}</span>
                                      {showFeedback && index === currentQuestion.answer && (
                                        <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                                          Correct
                                        </Badge>
                                      )}
                                      {showFeedback && selectedAnswers[currentQuestionIndex] === index && 
                                       selectedAnswers[currentQuestionIndex] !== currentQuestion.answer && (
                                        <Badge variant="outline" className="ml-auto bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400">
                                          Incorrect
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Explanation Section - Show when feedback is visible */}
                              {showFeedback && sessionSettings.showExplanations && currentQuestion.explanation && (
                                <div className="mt-4 p-4 bg-muted/50 rounded-md border">
                                  <div className="flex items-start gap-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Explanation:</p>
                                      <p className="text-sm">{currentQuestion.explanation}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button
                              variant="outline"
                              onClick={goToPreviousQuestion}
                              disabled={currentQuestionIndex === 0}
                            >
                              Previous
                            </Button>

                            <Button
                              onClick={goToNextQuestion}
                              disabled={!showFeedback && selectedAnswers[currentQuestionIndex] === undefined}
                            >
                              {currentQuestionIndex === video.quiz.questions.length - 1 ? "Finish" : "Next"}
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    )
                  })()}
                </>
              )}
            </>
          )}

          {/* AI Explanation Dialog */}
          <Dialog open={showAIExplanation} onOpenChange={setShowAIExplanation}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Explanation</DialogTitle>
                <DialogDescription>Here's an explanation of why your answer was incorrect</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-medium">Question:</p>
                  <p>{currentExplanation?.question}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">AI Explanation:</p>
                      <p>{currentExplanation?.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowAIExplanation(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </AuthCheck>
  )
}
