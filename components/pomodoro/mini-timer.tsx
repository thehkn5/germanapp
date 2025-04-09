'use client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock, Pause, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePomodoro } from "@/contexts/pomodoro-context"

export function MiniTimer() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { 
    isRunning, 
    timeRemaining, 
    currentSession, 
    pauseTimer, 
    startTimer,
    activeTaskId,
    tasks
  } = usePomodoro()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render client-side
  if (!mounted) return null

  // Only show if timer is active or in progress
  if (!isRunning && timeRemaining === 0) return null

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Get session color
  const getSessionColor = () => {
    switch (currentSession) {
      case "work":
        return "text-primary"
      case "shortBreak":
        return "text-green-500"
      case "longBreak":
        return "text-blue-500"
      default:
        return "text-primary"
    }
  }

  // Get active task name
  const getActiveTaskName = () => {
    if (!activeTaskId) return null
    const task = tasks.find(t => t.id === activeTaskId)
    return task ? task.text : null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={`px-2 ${getSessionColor()}`}>
          <Clock className="h-4 w-4 mr-1" />
          {formatTime(timeRemaining)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              {currentSession === "work" ? "Focus Time" : currentSession === "shortBreak" ? "Short Break" : "Long Break"}
            </h4>
            <span className={`text-lg font-bold ${getSessionColor()}`}>{formatTime(timeRemaining)}</span>
          </div>

          {getActiveTaskName() && (
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              Working on: {getActiveTaskName()}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpen(false)
                router.push("/pomodoro")
              }}
            >
              Open Timer
            </Button>

            {isRunning ? (
              <Button
                size="sm"
                onClick={() => {
                  pauseTimer()
                  setIsOpen(false)
                }}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  startTimer()
                  setIsOpen(false)
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
