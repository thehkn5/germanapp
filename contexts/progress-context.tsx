"use client"

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Types for progress tracking
export interface LearningSession {
  id: string
  type: "quiz" | "flashcards" | "exercises" | "practice" | "vocabulary" | "video" | "custom"
  resourceId: string
  resourceName: string
  date: string
  duration: number
  score?: number
  total?: number
  correct?: number
  completed: boolean
}

export interface LearningGoal {
  id: string
  name: string
  target: number
  unit: "minutes" | "sessions" | "words" | "videos" | "exercises"
  deadline?: string
  progress: number
  completed: boolean
  category: "vocabulary" | "grammar" | "listening" | "speaking" | "reading" | "general"
}

export interface Roadmap {
  id: string
  name: string
  description: string
  category: string
  goals: RoadmapGoal[]
  created: string
  deadline?: string
  progress: number
  completed: boolean
}

export interface RoadmapGoal {
  id: string
  name: string
  type: "video" | "vocabulary" | "exercise" | "custom"
  resourceId?: string
  resourceName?: string
  customUrl?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  notes?: string
}

interface ProgressContextType {
  sessions: LearningSession[]
  goals: LearningGoal[]
  roadmaps: Roadmap[]
  addSession: (session: Omit<LearningSession, "id" | "date">) => void
  updateGoal: (goal: LearningGoal) => void
  addGoal: (goal: Omit<LearningGoal, "id" | "progress" | "completed">) => void
  deleteGoal: (goalId: string) => void
  addRoadmap: (roadmap: Omit<Roadmap, "id" | "created" | "progress" | "completed">) => void
  updateRoadmap: (roadmap: Roadmap) => void
  deleteRoadmap: (roadmapId: string) => void
  updateRoadmapGoal: (roadmapId: string, goal: RoadmapGoal) => void
  getStats: () => {
    totalTime: number
    totalSessions: number
    averageScore: number
    completedGoals: number
    wordsLearned: number
    videosWatched: number
  }
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userIdRef = useRef<string | null>(null)

  // Use a stable key for localStorage
  const sessionsKey = `learning_sessions_${user?.uid || "guest"}`
  const goalsKey = `learning_goals_${user?.uid || "guest"}`
  const roadmapsKey = `learning_roadmaps_${user?.uid || "guest"}`

  const [sessions, setSessions] = useLocalStorage<LearningSession[]>(sessionsKey, [])
  const [goals, setGoals] = useLocalStorage<LearningGoal[]>(goalsKey, [])
  const [roadmaps, setRoadmaps] = useLocalStorage<Roadmap[]>(roadmapsKey, [])

  // Track if we're in an update cycle to prevent infinite loops
  const isUpdatingGoals = useRef(false)
  const isUpdatingRoadmaps = useRef(false)
  const previousSessionsRef = useRef<string>("")
  const previousGoalsRef = useRef<string>("")
  const previousRoadmapsRef = useRef<string>("")

  // Update goals progress based on sessions
  useEffect(() => {
    // Skip if we're already updating or if there are no goals
    if (isUpdatingGoals.current || goals.length === 0 || sessions.length === 0) {
      return
    }

    // Check if sessions have actually changed to prevent unnecessary updates
    const sessionsJSON = JSON.stringify(sessions)
    if (sessionsJSON === previousSessionsRef.current) {
      return
    }
    previousSessionsRef.current = sessionsJSON

    isUpdatingGoals.current = true

    const updatedGoals = goals.map((goal) => {
      let progress = 0

      switch (goal.unit) {
        case "minutes":
          progress = sessions.reduce((total, session) => total + session.duration, 0)
          break
        case "sessions":
          progress = sessions.length
          break
        case "words":
          progress = sessions
            .filter((s) => s.type === "vocabulary")
            .reduce((total, session) => total + (session.correct || 0), 0)
          break
        case "videos":
          progress = sessions.filter((s) => s.type === "video").length
          break
        case "exercises":
          progress = sessions.filter((s) => s.type === "exercises" || s.type === "quiz").length
          break
      }

      // Only update if progress has changed
      if (progress !== goal.progress) {
        return {
          ...goal,
          progress,
          completed: progress >= goal.target,
        }
      }
      return goal
    })

    // Only update if there are actual changes
    const updatedGoalsJSON = JSON.stringify(updatedGoals)
    if (updatedGoalsJSON !== JSON.stringify(goals)) {
      setGoals(updatedGoals)
    }

    isUpdatingGoals.current = false
  }, [sessions, goals, setGoals])

  // Update roadmaps progress
  useEffect(() => {
    // Skip if we're already updating or if there are no roadmaps
    if (isUpdatingRoadmaps.current || roadmaps.length === 0) {
      return
    }

    // Check if roadmaps have actually changed to prevent unnecessary updates
    const roadmapsJSON = JSON.stringify(roadmaps)
    if (roadmapsJSON === previousRoadmapsRef.current) {
      return
    }
    previousRoadmapsRef.current = roadmapsJSON

    isUpdatingRoadmaps.current = true

    const updatedRoadmaps = roadmaps.map((roadmap) => {
      const completedGoals = roadmap.goals.filter((goal) => goal.completed).length
      const progress = roadmap.goals.length > 0 ? Math.round((completedGoals / roadmap.goals.length) * 100) : 0

      // Only update if progress has changed
      if (progress !== roadmap.progress) {
        return {
          ...roadmap,
          progress,
          completed: progress === 100,
        }
      }
      return roadmap
    })

    // Only update if there are actual changes
    const updatedRoadmapsJSON = JSON.stringify(updatedRoadmaps)
    if (updatedRoadmapsJSON !== roadmapsJSON) {
      setRoadmaps(updatedRoadmaps)
    }

    isUpdatingRoadmaps.current = false
  }, [roadmaps, setRoadmaps])

  // Add a new learning session
  const addSession = (sessionData: Omit<LearningSession, "id" | "date">) => {
    const newSession: LearningSession = {
      ...sessionData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }

    setSessions((prev) => [...prev, newSession])
  }

  // Update an existing goal
  const updateGoal = (updatedGoal: LearningGoal) => {
    setGoals((prev) => prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)))
  }

  // Add a new goal
  const addGoal = (goalData: Omit<LearningGoal, "id" | "progress" | "completed">) => {
    const newGoal: LearningGoal = {
      ...goalData,
      id: Date.now().toString(),
      progress: 0,
      completed: false,
    }

    setGoals((prev) => [...prev, newGoal])
  }

  // Delete a goal
  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
  }

  // Add a new roadmap
  const addRoadmap = (roadmapData: Omit<Roadmap, "id" | "created" | "progress" | "completed">) => {
    // Check if user already has 3 roadmaps with different categories
    const newRoadmap: Roadmap = {
      ...roadmapData,
      id: Date.now().toString(),
      created: new Date().toISOString(),
      progress: 0,
      completed: false,
    }

    setRoadmaps((prev) => {
      // If we already have 3 roadmaps
      if (prev.length >= 3) {
        // Check if the category is already used
        const categoryExists = prev.some((rm) => rm.category === roadmapData.category)

        if (categoryExists) {
          // Replace the existing roadmap with the same category
          return prev.map((rm) => (rm.category === roadmapData.category ? newRoadmap : rm))
        } else {
          // Remove the oldest roadmap and add the new one
          const sortedRoadmaps = [...prev].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
          return [...sortedRoadmaps.slice(1), newRoadmap]
        }
      }

      // If we have less than 3 roadmaps, just add the new one
      return [...prev, newRoadmap]
    })

    return newRoadmap
  }

  // Update an existing roadmap
  const updateRoadmap = (updatedRoadmap: Roadmap) => {
    setRoadmaps((prev) => prev.map((roadmap) => (roadmap.id === updatedRoadmap.id ? updatedRoadmap : roadmap)))
  }

  // Delete a roadmap
  const deleteRoadmap = (roadmapId: string) => {
    setRoadmaps((prev) => prev.filter((roadmap) => roadmap.id !== roadmapId))
  }

  // Update a roadmap goal
  const updateRoadmapGoal = (roadmapId: string, updatedGoal: RoadmapGoal) => {
    setRoadmaps((prev) =>
      prev.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedGoals = roadmap.goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))

          return {
            ...roadmap,
            goals: updatedGoals,
          }
        }
        return roadmap
      }),
    )
  }

  // Get learning statistics
  const getStats = () => {
    const totalTime = sessions.reduce((total, session) => total + session.duration, 0)
    const totalSessions = sessions.length

    const scoresSum = sessions
      .filter((s) => s.score !== undefined)
      .reduce((total, session) => total + (session.score || 0), 0)

    const scoresCount = sessions.filter((s) => s.score !== undefined).length
    const averageScore = scoresCount > 0 ? Math.round(scoresSum / scoresCount) : 0

    const completedGoals = goals.filter((goal) => goal.completed).length

    const wordsLearned = sessions
      .filter((s) => s.type === "vocabulary")
      .reduce((total, session) => total + (session.correct || 0), 0)

    const videosWatched = sessions.filter((s) => s.type === "video").length

    return {
      totalTime,
      totalSessions,
      averageScore,
      completedGoals,
      wordsLearned,
      videosWatched,
    }
  }

  return (
    <ProgressContext.Provider
      value={{
        sessions,
        goals,
        roadmaps,
        addSession,
        updateGoal,
        addGoal,
        deleteGoal,
        addRoadmap,
        updateRoadmap,
        deleteRoadmap,
        updateRoadmapGoal,
        getStats,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
