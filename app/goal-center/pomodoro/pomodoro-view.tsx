"use client"

import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Play, Pause, SkipForward, Settings, Volume2, Check, Bell, Target, History, Calendar } from "lucide-react"

interface PomodoroSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  alarmSound: string
  alarmVolume: number
}

interface PomodoroSession {
  id: string
  date: Date
  duration: number // in minutes
  type: "focus" | "short-break" | "long-break"
  completed: boolean
  goal?: string // optional associated goal
  notes?: string // optional notes
}

// Mock session history
const mockSessionHistory: PomodoroSession[] = [
  {
    id: "1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    duration: 25,
    type: "focus",
    completed: true,
    goal: "Complete German grammar",
    notes: "Worked on adjective endings"
  },
  {
    id: "2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 5), // 2 hours 5 minutes ago
    duration: 5,
    type: "short-break",
    completed: true
  },
  {
    id: "3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    duration: 25,
    type: "focus",
    completed: true,
    goal: "Complete German grammar",
    notes: "Studied cases"
  },
  {
    id: "4",
    date: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    duration: 15,
    type: "long-break",
    completed: true
  }
]

export default function PomodoroView() {
  const { user } = useAuth()
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [currentMode, setCurrentMode] = useState<"focus" | "short-break" | "long-break">("focus")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  
  // Settings state
  const [settings, setSettings] = useState<PomodoroSettings>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    alarmSound: "bell",
    alarmVolume: 80
  })
  
  // Session history
  const [sessionHistory, setSessionHistory] = useState<PomodoroSession[]>(mockSessionHistory)
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Calculate total time
  const getTotalTime = () => {
    switch (currentMode) {
      case "focus":
        return settings.focusDuration * 60
      case "short-break":
        return settings.shortBreakDuration * 60
      case "long-break":
        return settings.longBreakDuration * 60
    }
  }
  
  // Reset timer based on current mode
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getTotalTime())
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  
  // Change timer mode
  const changeMode = (mode: "focus" | "short-break" | "long-break") => {
    setCurrentMode(mode)
    setIsRunning(false)
    setTimeLeft(
      mode === "focus" 
        ? settings.focusDuration * 60 
        : mode === "short-break"
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60
    )
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  
  // Start/resume timer
  const startTimer = () => {
    setIsRunning(true)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Timer finished
          if (audioRef.current) {
            audioRef.current.volume = settings.alarmVolume / 100
            audioRef.current.currentTime = 0
            audioRef.current.play()
          }
          
          clearInterval(timerRef.current as NodeJS.Timeout)
          timerRef.current = null
          
          // Add completed session to history
          const newSession: PomodoroSession = {
            id: Date.now().toString(),
            date: new Date(),
            duration: 
              currentMode === "focus" 
                ? settings.focusDuration 
                : currentMode === "short-break" 
                ? settings.shortBreakDuration 
                : settings.longBreakDuration,
            type: currentMode,
            completed: true
          }
          
          setSessionHistory(prev => [newSession, ...prev])
          
          // Handle session completion logic
          if (currentMode === "focus") {
            const nextSessionsCompleted = sessionsCompleted + 1
            setSessionsCompleted(nextSessionsCompleted)
            
            // Determine next break type
            const nextMode = nextSessionsCompleted % settings.sessionsUntilLongBreak === 0 
              ? "long-break" 
              : "short-break"
            
            // Auto-start break if enabled
            if (settings.autoStartBreaks) {
              setCurrentMode(nextMode)
              setTimeLeft(
                nextMode === "short-break" 
                  ? settings.shortBreakDuration * 60 
                  : settings.longBreakDuration * 60
              )
              setIsRunning(true)
              timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1)
              }, 1000)
            } else {
              setCurrentMode(nextMode)
              setTimeLeft(
                nextMode === "short-break" 
                  ? settings.shortBreakDuration * 60 
                  : settings.longBreakDuration * 60
              )
              setIsRunning(false)
            }
          } else {
            // Break finished, go back to focus mode
            if (settings.autoStartPomodoros) {
              setCurrentMode("focus")
              setTimeLeft(settings.focusDuration * 60)
              setIsRunning(true)
              timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1)
              }, 1000)
            } else {
              setCurrentMode("focus")
              setTimeLeft(settings.focusDuration * 60)
              setIsRunning(false)
            }
          }
          
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }
  
  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  
  // Skip to next timer
  const skipTimer = () => {
    if (currentMode === "focus") {
      const nextSessionsCompleted = sessionsCompleted + 1
      setSessionsCompleted(nextSessionsCompleted)
      
      // Determine next break type
      const nextMode = nextSessionsCompleted % settings.sessionsUntilLongBreak === 0 
        ? "long-break" 
        : "short-break"
      
      setCurrentMode(nextMode)
      setTimeLeft(
        nextMode === "short-break" 
          ? settings.shortBreakDuration * 60 
          : settings.longBreakDuration * 60
      )
    } else {
      setCurrentMode("focus")
      setTimeLeft(settings.focusDuration * 60)
    }
    
    setIsRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Update settings
  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }))
    
    // Reset timer if it's not running
    if (!isRunning) {
      setTimeLeft(
        currentMode === "focus" 
          ? (newSettings.focusDuration || settings.focusDuration) * 60 
          : currentMode === "short-break"
          ? (newSettings.shortBreakDuration || settings.shortBreakDuration) * 60
          : (newSettings.longBreakDuration || settings.longBreakDuration) * 60
      )
    }
  }
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  return (
    <div className="space-y-6">
      <audio ref={audioRef} src="/sounds/bell.mp3" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Timer */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pomodoro Timer</CardTitle>
              <div className="flex gap-2">
                <Badge 
                  variant={currentMode === "focus" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => changeMode("focus")}
                >
                  Focus
                </Badge>
                <Badge 
                  variant={currentMode === "short-break" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => changeMode("short-break")}
                >
                  Short Break
                </Badge>
                <Badge 
                  variant={currentMode === "long-break" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => changeMode("long-break")}
                >
                  Long Break
                </Badge>
              </div>
            </div>
            <CardDescription>
              {currentMode === "focus" 
                ? "Stay focused and concentrate on your task" 
                : currentMode === "short-break"
                ? "Take a short break to relax"
                : "Take a longer break to recharge"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl font-bold mb-8">
              {formatTime(timeLeft)}
            </div>
            
            <Progress
              value={(timeLeft / getTotalTime()) * 100}
              className="w-full h-3 mb-8"
            />
            
            <div className="flex gap-4">
              {!isRunning ? (
                <Button size="lg" onClick={startTimer}>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button size="lg" variant="outline" onClick={pauseTimer}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              )}
              
              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
              >
                Reset
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={skipTimer}
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div>
              Sessions completed today: <Badge variant="outline">{sessionsCompleted}</Badge>
            </div>
            <div>
              {currentMode === "focus" && 
                `Break in ${formatTime(timeLeft)} (${Math.round((timeLeft / 60) * 10) / 10} min)`}
              {currentMode !== "focus" && 
                `Focus in ${formatTime(timeLeft)} (${Math.round((timeLeft / 60) * 10) / 10} min)`}
            </div>
          </CardFooter>
        </Card>
        
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Focus Duration</Label>
                  <span>{settings.focusDuration} min</span>
                </div>
                <Slider
                  value={[settings.focusDuration]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={([value]) => updateSettings({ focusDuration: value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Short Break</Label>
                  <span>{settings.shortBreakDuration} min</span>
                </div>
                <Slider
                  value={[settings.shortBreakDuration]}
                  min={1}
                  max={15}
                  step={1}
                  onValueChange={([value]) => updateSettings({ shortBreakDuration: value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Long Break</Label>
                  <span>{settings.longBreakDuration} min</span>
                </div>
                <Slider
                  value={[settings.longBreakDuration]}
                  min={5}
                  max={30}
                  step={5}
                  onValueChange={([value]) => updateSettings({ longBreakDuration: value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Sessions until long break</Label>
                  <span>{settings.sessionsUntilLongBreak}</span>
                </div>
                <Slider
                  value={[settings.sessionsUntilLongBreak]}
                  min={2}
                  max={6}
                  step={1}
                  onValueChange={([value]) => updateSettings({ sessionsUntilLongBreak: value })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-start-breaks">Auto-start breaks</Label>
                <Switch
                  id="auto-start-breaks"
                  checked={settings.autoStartBreaks}
                  onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-start-pomodoros">Auto-start focus</Label>
                <Switch
                  id="auto-start-pomodoros"
                  checked={settings.autoStartPomodoros}
                  onCheckedChange={(checked) => updateSettings({ autoStartPomodoros: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Alarm sound</Label>
                <Select
                  value={settings.alarmSound}
                  onValueChange={(value) => updateSettings({ alarmSound: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alarm sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Alarm volume</Label>
                  <span>{settings.alarmVolume}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={[settings.alarmVolume]}
                    min={0}
                    max={100}
                    step={10}
                    className="flex-1"
                    onValueChange={([value]) => updateSettings({ alarmVolume: value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Session History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Session History</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sessionHistory.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No sessions recorded yet
              </div>
            ) : (
              sessionHistory.map(session => (
                <div 
                  key={session.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={session.type === "focus" ? "default" : "outline"}>
                        {session.type === "focus" ? "Focus" : 
                         session.type === "short-break" ? "Short Break" : "Long Break"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {session.duration} minutes
                      </span>
                    </div>
                    
                    {session.goal && (
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-3 w-3" />
                        {session.goal}
                      </div>
                    )}
                    
                    {session.notes && (
                      <div className="text-sm text-muted-foreground">
                        {session.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(session.date, "h:mm a")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(session.date, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 