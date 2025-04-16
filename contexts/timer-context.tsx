"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type TimerStatus = "idle" | "running" | "paused" | "completed"

export type TimerContextType = {
  time: number
  status: TimerStatus
  sessionType: "focus" | "break"
  focusDuration: number
  breakDuration: number
  setFocusDuration: (minutes: number) => void
  setBreakDuration: (minutes: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  skipToBreak: () => void
  skipToFocus: () => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: ReactNode }) {
  const [time, setTime] = useState(25 * 60) // Default 25 minutes in seconds
  const [status, setStatus] = useState<TimerStatus>("idle")
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  const [focusDuration, setFocusDuration] = useState(25) // in minutes
  const [breakDuration, setBreakDuration] = useState(5) // in minutes
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  // Handle timer countdown
  useEffect(() => {
    if (status === "running") {
      if (time <= 0) {
        // Timer completed
        if (intervalId) clearInterval(intervalId)
        setStatus("completed")
        
        // Automatically switch between focus and break
        if (sessionType === "focus") {
          // Play notification sound
          const audio = new Audio("/sounds/break-time.mp3")
          audio.play().catch(e => console.log("Audio play failed:", e))
          
          setSessionType("break")
          setTime(breakDuration * 60)
          // Don't auto-start break, let user start manually
          setStatus("idle")
        } else {
          // Play notification sound
          const audio = new Audio("/sounds/focus-time.mp3")
          audio.play().catch(e => console.log("Audio play failed:", e))
          
          setSessionType("focus")
          setTime(focusDuration * 60)
          // Don't auto-start focus, let user start manually
          setStatus("idle")
        }
      }
    }
  }, [time, status, sessionType, focusDuration, breakDuration, intervalId])

  // Start the timer
  const startTimer = () => {
    setStatus("running")
    const id = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          if (id) clearInterval(id)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    setIntervalId(id)
  }

  // Pause the timer
  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setStatus("paused")
  }

  // Resume the timer
  const resumeTimer = () => {
    startTimer()
  }

  // Reset the timer
  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setTime(sessionType === "focus" ? focusDuration * 60 : breakDuration * 60)
    setStatus("idle")
  }

  // Skip to break
  const skipToBreak = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setSessionType("break")
    setTime(breakDuration * 60)
    setStatus("idle")
  }

  // Skip to focus
  const skipToFocus = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setSessionType("focus")
    setTime(focusDuration * 60)
    setStatus("idle")
  }

  return (
    <TimerContext.Provider
      value={{
        time,
        status,
        sessionType,
        focusDuration,
        breakDuration,
        setFocusDuration,
        setBreakDuration,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        skipToBreak,
        skipToFocus
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer(): TimerContextType {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider")
  }
  return context
} 