"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useVideoData } from "@/hooks/use-video-data"
import { AuthCheck } from "@/components/auth-check"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Timer } from "lucide-react"
import { LearningSessionTimer } from "@/components/learning-session-timer"
import { LearningSessionSettings } from "@/components/learning-session-settings"
import { LearningSessionResults } from "@/components/learning-session-results"

export default function PracticePage() {
  const { id } = useParams()
  const { videos } = useVideoData()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
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
  }

  const completeSession = () => {
    const timeTaken = timerDuration - timeRemaining

    // For practice, we just track time spent
    setResults({
      correct: 1,
      total: 1,
      timeTaken,
    })

    setSessionCompleted(true)
  }

  const resetSession = () => {
    setSessionStarted(false)
    setSessionCompleted(false)
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

  return (
    <AuthCheck>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push(`/videos/${id}`)} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Video
          </Button>
        </div>

        {!sessionStarted ? (
          <LearningSessionSettings
            title={`Practice Session - ${video.title}`}
            description="Practice your German with this timed session. Watch the video, review vocabulary, and practice speaking."
            onStart={startSession}
          />
        ) : sessionCompleted ? (
          <LearningSessionResults
            title="Practice Session Complete"
            results={results}
            onReset={resetSession}
            onReturn={() => router.push(`/videos/${id}`)}
          />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Practice Session</CardTitle>
                <LearningSessionTimer
                  duration={timerDuration}
                  timeRemaining={timeRemaining}
                  setTimeRemaining={setTimeRemaining}
                  onComplete={completeSession}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Timer className="h-4 w-4 mr-2" />
                  Practice Guidelines
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Watch the video and repeat the phrases out loud</li>
                  <li>• Practice pronunciation by mimicking the speaker</li>
                  <li>• Try to recall vocabulary without looking at translations</li>
                  <li>• Use the subtitles to help with comprehension</li>
                  <li>• Record yourself speaking if possible and compare</li>
                </ul>
              </div>

              <div className="aspect-video bg-black relative rounded-md overflow-hidden">
                {video.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>No video available for practice</p>
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">Key Phrases to Practice</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {video.subtitles && video.subtitles.length > 0 ? (
                    video.subtitles.map((subtitle: any, index: number) => (
                      <div key={index} className="p-2 hover:bg-muted/50 rounded-md">
                        <p>{subtitle.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No phrases available for this video.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={completeSession} className="w-full">
                End Practice Session
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AuthCheck>
  )
}
