"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Clock, Coffee, Volume2, VolumeX } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export interface PomodoroSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
}

interface PomodoroTimerProps {
  onSessionComplete?: (sessionType: "work" | "shortBreak" | "longBreak", duration: number) => void
  onTimerStart?: (sessionType: "work" | "shortBreak" | "longBreak", duration: number) => void
  onTimerPause?: () => void
  onTimerReset?: () => void
  initialSettings?: Partial<PomodoroSettings>
  showSettings?: boolean
}

export function PomodoroTimer({
  onSessionComplete,
  onTimerStart,
  onTimerPause,
  onTimerReset,
  initialSettings,
  showSettings = true,
}: PomodoroTimerProps) {
  // Default settings
  const defaultSettings: PomodoroSettings = {
    workDuration: 25 * 60, // 25 minutes in seconds
    shortBreakDuration: 5 * 60, // 5 minutes in seconds
    longBreakDuration: 15 * 60, // 15 minutes in seconds
    longBreakInterval: 4, // After 4 pomodoros
    autoStartBreaks: true,
    autoStartPomodoros: true,
    soundEnabled: true,
  }

  // Merge default settings with initial settings
  const mergedSettings = { ...defaultSettings, ...initialSettings }

  // State for settings
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>("pomodoro_settings", mergedSettings)

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/bell.mp3") // You'll need to add this sound file
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Update time remaining when settings change
  useEffect(() => {
    if (!isRunning) {
      if (currentSession === "work") {
        setTimeRemaining(settings.workDuration)
      } else if (currentSession === "shortBreak") {
        setTimeRemaining(settings.shortBreakDuration)
      } else {
        setTimeRemaining(settings.longBreakDuration)
      }
    }
  }, [settings, currentSession, isRunning])

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer complete
            clearInterval(timerRef.current!)

            // Play sound if enabled
            if (settings.soundEnabled && audioRef.current) {
              audioRef.current.play().catch((err) => console.error("Error playing sound:", err))
            }

            // Handle session completion
            if (currentSession === "work") {
              // Increment completed pomodoros
              const newCompletedPomodoros = completedPomodoros + 1
              setCompletedPomodoros(newCompletedPomodoros)

              // Determine next break type
              const isLongBreak = newCompletedPomodoros % settings.longBreakInterval === 0
              const nextSession = isLongBreak ? "longBreak" : "shortBreak"

              // Notify session completion
              if (onSessionComplete) {
                onSessionComplete("work", settings.workDuration)
              }

              // Set next session
              setCurrentSession(nextSession)

              // Auto start break if enabled
              if (settings.autoStartBreaks) {
                const nextDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
                setTimeRemaining(nextDuration)

                // Notify timer start
                if (onTimerStart) {
                  onTimerStart(nextSession, nextDuration)
                }

                return nextDuration
              } else {
                setIsRunning(false)
                return isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
              }
            } else {
              // Break complete
              // Notify session completion
              if (onSessionComplete) {
                onSessionComplete(
                  currentSession,
                  currentSession === "shortBreak" ? settings.shortBreakDuration : settings.longBreakDuration,
                )
              }

              // Set next session to work
              setCurrentSession("work")

              // Auto start work if enabled
              if (settings.autoStartPomodoros) {
                setTimeRemaining(settings.workDuration)

                // Notify timer start
                if (onTimerStart) {
                  onTimerStart("work", settings.workDuration)
                }

                return settings.workDuration
              } else {
                setIsRunning(false)
                return settings.workDuration
              }
            }
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, currentSession, completedPomodoros, settings, onSessionComplete, onTimerStart])

  // Start timer
  const startTimer = () => {
    setIsRunning(true)

    // Notify timer start
    if (onTimerStart) {
      onTimerStart(
        currentSession,
        currentSession === "work"
          ? settings.workDuration
          : currentSession === "shortBreak"
            ? settings.shortBreakDuration
            : settings.longBreakDuration,
      )
    }
  }

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false)

    // Notify timer pause
    if (onTimerPause) {
      onTimerPause()
    }
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)

    if (currentSession === "work") {
      setTimeRemaining(settings.workDuration)
    } else if (currentSession === "shortBreak") {
      setTimeRemaining(settings.shortBreakDuration)
    } else {
      setTimeRemaining(settings.longBreakDuration)
    }

    // Notify timer reset
    if (onTimerReset) {
      onTimerReset()
    }
  }

  // Switch session type
  const switchSession = (type: "work" | "shortBreak" | "longBreak") => {
    setIsRunning(false)
    setCurrentSession(type)

    if (type === "work") {
      setTimeRemaining(settings.workDuration)
    } else if (type === "shortBreak") {
      setTimeRemaining(settings.shortBreakDuration)
    } else {
      setTimeRemaining(settings.longBreakDuration)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate progress
  const calculateProgress = () => {
    let totalDuration

    if (currentSession === "work") {
      totalDuration = settings.workDuration
    } else if (currentSession === "shortBreak") {
      totalDuration = settings.shortBreakDuration
    } else {
      totalDuration = settings.longBreakDuration
    }

    return ((totalDuration - timeRemaining) / totalDuration) * 100
  }

  // Update settings
  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  // Toggle sound
  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled })
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button
                variant={currentSession === "work" ? "default" : "outline"}
                size="sm"
                onClick={() => switchSession("work")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Focus
              </Button>
              <Button
                variant={currentSession === "shortBreak" ? "default" : "outline"}
                size="sm"
                onClick={() => switchSession("shortBreak")}
              >
                <Coffee className="h-4 w-4 mr-2" />
                Short Break
              </Button>
              <Button
                variant={currentSession === "longBreak" ? "default" : "outline"}
                size="sm"
                onClick={() => switchSession("longBreak")}
              >
                <Coffee className="h-4 w-4 mr-2" />
                Long Break
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSound} title={settings.soundEnabled ? "Mute" : "Unmute"}>
              {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold tabular-nums mb-2">{formatTime(timeRemaining)}</div>
            <div className="text-sm text-muted-foreground">
              {currentSession === "work"
                ? "Focus Time"
                : currentSession === "shortBreak"
                  ? "Short Break"
                  : "Long Break"}
            </div>
          </div>

          <Progress value={calculateProgress()} className="mb-6" />

          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={startTimer} className="gap-2">
                <Play className="h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" className="gap-2">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={resetTimer} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-muted-foreground">Completed Pomodoros: {completedPomodoros}</div>
          </div>
        </CardContent>
      </Card>

      {showSettings && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Timer Settings</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSettingsPanel(!showSettingsPanel)}>
                {showSettingsPanel ? "Hide" : "Show"}
              </Button>
            </div>

            {showSettingsPanel && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Focus Duration: {Math.floor(settings.workDuration / 60)} minutes</Label>
                  <Slider
                    min={5 * 60}
                    max={60 * 60}
                    step={5 * 60}
                    value={[settings.workDuration]}
                    onValueChange={(value) => updateSettings({ workDuration: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Break: {Math.floor(settings.shortBreakDuration / 60)} minutes</Label>
                  <Slider
                    min={1 * 60}
                    max={15 * 60}
                    step={1 * 60}
                    value={[settings.shortBreakDuration]}
                    onValueChange={(value) => updateSettings({ shortBreakDuration: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 min</span>
                    <span>5 min</span>
                    <span>15 min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Long Break: {Math.floor(settings.longBreakDuration / 60)} minutes</Label>
                  <Slider
                    min={5 * 60}
                    max={30 * 60}
                    step={5 * 60}
                    value={[settings.longBreakDuration]}
                    onValueChange={(value) => updateSettings({ longBreakDuration: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>15 min</span>
                    <span>30 min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Long Break Interval: Every {settings.longBreakInterval} pomodoros</Label>
                  <Slider
                    min={2}
                    max={8}
                    step={1}
                    value={[settings.longBreakInterval]}
                    onValueChange={(value) => updateSettings({ longBreakInterval: value[0] })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>4</span>
                    <span>8</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
