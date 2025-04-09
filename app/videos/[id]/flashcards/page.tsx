"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useVideoData } from "@/hooks/use-video-data"
import { AuthCheck } from "@/components/auth-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Loader2, ThumbsDown, ThumbsUp } from "lucide-react"
import { LearningSessionTimer } from "@/components/learning-session-timer"
import { LearningSessionSettings } from "@/components/learning-session-settings"
import { LearningSessionResults } from "@/components/learning-session-results"

export default function FlashcardsPage() {
  const { id } = useParams()
  const { videos } = useVideoData()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<boolean[]>([])
  const [timerDuration, setTimerDuration] = useState(15 * 60) // 15 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration)
  const [results, setResults] = useState<{
    correct: number
    total: number
    timeTaken: number
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

  const startSession = (duration: number) => {
    setTimerDuration(duration)
    setTimeRemaining(duration)
    setSessionStarted(true)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setKnownCards(Array(video?.flashcards?.length || 0).fill(false))
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const markCard = (known: boolean) => {
    const newKnownCards = [...knownCards]
    newKnownCards[currentCardIndex] = known
    setKnownCards(newKnownCards)

    if (currentCardIndex < (video?.flashcards?.length || 0) - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      completeSession()
    }
  }

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const completeSession = () => {
    const timeTaken = timerDuration - timeRemaining
    const knownCount = knownCards.filter((known) => known).length

    setResults({
      correct: knownCount,
      total: video?.flashcards?.length || 0,
      timeTaken,
    })

    setSessionCompleted(true)
  }

  const resetSession = () => {
    setSessionStarted(false)
    setSessionCompleted(false)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setKnownCards([])
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

  if (!video.flashcards || video.flashcards.length === 0) {
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
              <CardTitle>Flashcards - {video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No flashcards available for this video.</AlertDescription>
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

          <LearningSessionSettings
            title={`Flashcards - ${video.title}`}
            description="Review vocabulary with these flashcards."
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
            title="Flashcard Results"
            results={results}
            onReset={resetSession}
            onReturn={() => router.push(`/videos/${id}`)}
          />
        </div>
      </AuthCheck>
    )
  }

  const currentCard = video.flashcards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / video.flashcards.length) * 100

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
            Exit Flashcards
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
                Card {currentCardIndex + 1} of {video.flashcards.length}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Progress value={progress} className="mb-6" />

            <div className="relative h-64 w-full cursor-pointer perspective" onClick={flipCard}>
              <div
                className={`absolute inset-0 rounded-lg border bg-card p-6 shadow-sm transition-all duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div className="flex h-full items-center justify-center">
                  <p className="text-2xl font-medium">{currentCard.front}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-lg border bg-card p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="text-2xl">{currentCard.back}</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4 text-sm text-muted-foreground">Click the card to flip it</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPreviousCard} disabled={currentCardIndex === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => markCard(false)} className="gap-2" disabled={!isFlipped}>
                <ThumbsDown className="h-4 w-4" />
                Still Learning
              </Button>

              <Button onClick={() => markCard(true)} className="gap-2" disabled={!isFlipped}>
                <ThumbsUp className="h-4 w-4" />I Know This
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AuthCheck>
  )
}
