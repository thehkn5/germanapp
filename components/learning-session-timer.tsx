"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface LearningSessionTimerProps {
  duration: number
  timeRemaining: number
  setTimeRemaining: (time: number) => void
  onComplete: () => void
}

export function LearningSessionTimer({
  duration,
  timeRemaining,
  setTimeRemaining,
  onComplete,
}: LearningSessionTimerProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [setTimeRemaining, onComplete])

  // Format time properly to avoid NaN:NaN issue
  const formatTime = () => {
    if (isNaN(timeRemaining)) {
      return "0:00" // Default if timeRemaining is NaN
    }
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progress = (timeRemaining / duration) * 100

  return (
    <Card className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <div className="text-sm font-medium">{formatTime()}</div>
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${isNaN(progress) ? 0 : progress}%` }}
        />
      </div>
    </Card>
  )
}
