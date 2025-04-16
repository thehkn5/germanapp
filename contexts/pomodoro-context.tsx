"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useProgress } from "@/contexts/progress-context"
import { useAuth } from "@/contexts/auth-context"

export interface PomodoroSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
}

export interface PomodoroSubtask {
  id: string
  text: string
  completed: boolean
}

export interface PomodoroTask {
  id: string
  text: string
  completed: boolean
  estimatedPomodoros: number
  completedPomodoros: number
  subtasks: PomodoroSubtask[]
  notes?: string
  roadmapGoalId?: string
}

export interface PomodoroSession {
  id: string
  taskId: string | null
  type: "work" | "shortBreak" | "longBreak"
  startTime: string
  endTime?: string
  duration: number
  completed: boolean
}

interface PomodoroContextType {
  // Timer state
  isRunning: boolean
  timeRemaining: number
  currentSession: "work" | "shortBreak" | "longBreak"
  completedPomodoros: number

  // Timer controls
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  switchSession: (type: "work" | "shortBreak" | "longBreak") => void

  // Settings
  settings: PomodoroSettings
  updateSettings: (settings: Partial<PomodoroSettings>) => void

  // Tasks
  tasks: PomodoroTask[]
  addTask: (task: Omit<PomodoroTask, "id" | "completedPomodoros" | "subtasks">) => void
  updateTask: (task: PomodoroTask) => void
  deleteTask: (taskId: string) => void

  // Active task
  activeTaskId: string | null
  setActiveTaskId: (taskId: string | null) => void

  // Sessions
  sessions: PomodoroSession[]

  // Roadmap integration
  addTaskFromRoadmapGoal: (goalId: string, goalName: string) => void

  // Learning activity integration
  linkLearningActivity: (resourceId: string, resourceName: string, type: "quiz" | "flashcards" | "exercises" | "practice" | "vocabulary" | "video" | "custom") => void
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25 * 60, // 25 minutes in seconds
  shortBreakDuration: 5 * 60, // 5 minutes in seconds
  longBreakDuration: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4, // After 4 pomodoros
  autoStartBreaks: true,
  autoStartPomodoros: true,
  soundEnabled: true,
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { roadmaps, updateRoadmapGoal, addSession } = useProgress()

  // Generate stable storage keys
  const settingsKey = `pomodoro_settings_${user?.uid || "guest"}`
  const tasksKey = `pomodoro_tasks_${user?.uid || "guest"}`
  const sessionsKey = `pomodoro_sessions_${user?.uid || "guest"}`

  // Settings
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(settingsKey, defaultSettings)

  // Timer state - moved to global context to ensure synchronization
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration)
  const [currentSession, setCurrentSession] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  // Tasks
  const [tasks, setTasks] = useLocalStorage<PomodoroTask[]>(tasksKey, [])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  // Sessions
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>(sessionsKey, [])

  // Current session reference
  const currentSessionRef = useRef<PomodoroSession | null>(null)

  // Timer interval reference
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Audio reference
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

            // Complete current session
            if (currentSessionRef.current) {
              completeSession(currentSessionRef.current.id)
            }

            // Handle session completion
            if (currentSession === "work") {
              // Increment completed pomodoros
              const newCompletedPomodoros = completedPomodoros + 1
              setCompletedPomodoros(newCompletedPomodoros)

              // Update active task if there is one
              if (activeTaskId) {
                updateTask({
                  ...tasks.find((t) => t.id === activeTaskId)!,
                  completedPomodoros: tasks.find((t) => t.id === activeTaskId)!.completedPomodoros + 1,
                })
              }

              // Determine next break type
              const isLongBreak = newCompletedPomodoros % settings.longBreakInterval === 0
              const nextSession = isLongBreak ? "longBreak" : "shortBreak"

              // Set next session
              setCurrentSession(nextSession)

              // Start new session
              startNewSession(nextSession)

              // Auto start break if enabled
              if (settings.autoStartBreaks) {
                const nextDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
                setTimeRemaining(nextDuration)
                return nextDuration
              } else {
                setIsRunning(false)
                return isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
              }
            } else {
              // Break complete
              // Set next session to work
              setCurrentSession("work")

              // Start new session
              startNewSession("work")

              // Auto start work if enabled
              if (settings.autoStartPomodoros) {
                setTimeRemaining(settings.workDuration)
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
  }, [isRunning, currentSession, completedPomodoros, settings, activeTaskId, tasks])

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)

      // Start new session if there isn't one
      if (!currentSessionRef.current) {
        startNewSession(currentSession)
      }
    }
  }

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false)
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

    // Reset current session
    if (currentSessionRef.current) {
      // Remove the current session
      setSessions((prev) => prev.filter((s) => s.id !== currentSessionRef.current!.id))
      currentSessionRef.current = null
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

    // Reset current session
    if (currentSessionRef.current) {
      // Remove the current session
      setSessions((prev) => prev.filter((s) => s.id !== currentSessionRef.current!.id))
      currentSessionRef.current = null
    }
  }

  // Update settings
  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  // Start new session
  const startNewSession = (type: "work" | "shortBreak" | "longBreak") => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      taskId: type === "work" ? activeTaskId : null,
      type,
      startTime: new Date().toISOString(),
      duration:
        type === "work"
          ? settings.workDuration
          : type === "shortBreak"
            ? settings.shortBreakDuration
            : settings.longBreakDuration,
      completed: false,
    }

    setSessions((prev) => [...prev, newSession])
    currentSessionRef.current = newSession
  }

  // Complete session
  const completeSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              endTime: new Date().toISOString(),
              completed: true,
            }
          : session,
      ),
    )

    currentSessionRef.current = null
  }

  // Add task
  const addTask = (task: Omit<PomodoroTask, "id" | "completedPomodoros" | "subtasks">) => {
    const newTask: PomodoroTask = {
      ...task,
      id: Date.now().toString(),
      completedPomodoros: 0,
      subtasks: [],
    }

    setTasks((prev) => [...prev, newTask])

    // Set as active task if no active task
    if (!activeTaskId) {
      setActiveTaskId(newTask.id)
    }
  }

  // Update task
  const updateTask = (task: PomodoroTask) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))

    // If this task has a roadmap goal ID, update the roadmap goal
    if (task.roadmapGoalId && task.completed) {
      // Find the roadmap containing this goal
      for (const roadmap of roadmaps) {
        const goal = roadmap.goals.find((g) => g.id === task.roadmapGoalId)
        if (goal) {
          updateRoadmapGoal(roadmap.id, {
            ...goal,
            completed: true,
          })
          break
        }
      }
    }
  }

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    // If this is the active task, clear active task
    if (activeTaskId === taskId) {
      setActiveTaskId(null)
    }
  }

  // Add task from roadmap goal
  const addTaskFromRoadmapGoal = (goalId: string, goalName: string) => {
    // Check if task already exists for this goal
    const existingTask = tasks.find((t) => t.roadmapGoalId === goalId)
    if (existingTask) {
      // Set as active task
      setActiveTaskId(existingTask.id)
      return
    }

    // Create new task
    const newTask: PomodoroTask = {
      id: Date.now().toString(),
      text: goalName,
      completed: false,
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      subtasks: [],
      roadmapGoalId: goalId,
    }

    setTasks((prev) => [...prev, newTask])
    setActiveTaskId(newTask.id)
  }

  // Link a Pomodoro session to a learning activity
  const linkLearningActivity = (resourceId: string, resourceName: string, type: "quiz" | "flashcards" | "exercises" | "practice" | "vocabulary" | "video" | "custom") => {
    // Only create a learning session if we're in a work session
    if (currentSession === "work" && isRunning) {
      // Calculate the duration based on completed time
      const elapsedTime = settings.workDuration - timeRemaining
      
      // Only record if we've spent at least 1 minute
      if (elapsedTime >= 60) {
        // Create a learning session
        addSession({
          type,
          resourceId,
          resourceName,
          duration: elapsedTime,
          completed: true
        })
        
        // Optionally, we could also create a task for this activity
        const taskExists = tasks.some(t => t.text === resourceName)
        
        if (!taskExists) {
          addTask({
            text: resourceName,
            completed: false,
            estimatedPomodoros: 1
          })
        }
      }
    }
  }

  return (
    <PomodoroContext.Provider
      value={{
        // Timer state
        isRunning,
        timeRemaining,
        currentSession,
        completedPomodoros,

        // Timer controls
        startTimer,
        pauseTimer,
        resetTimer,
        switchSession,

        // Settings
        settings,
        updateSettings,

        // Tasks
        tasks,
        addTask,
        updateTask,
        deleteTask,

        // Active task
        activeTaskId,
        setActiveTaskId,

        // Sessions
        sessions,

        // Roadmap integration
        addTaskFromRoadmapGoal,
        
        // Learning activity integration
        linkLearningActivity
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (context === undefined) {
    throw new Error("usePomodoro must be used within a PomodoroProvider")
  }
  return context
}
