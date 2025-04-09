"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type FeedbackTiming = "immediate" | "delayed" | "end"

interface QuizSettings {
  feedbackTiming: FeedbackTiming
  showExplanations: boolean
  difficulty: "easy" | "medium" | "hard"
  shuffle: boolean
  focusMode: boolean
  limitQuestions?: number
  duration: number
}

interface QuizContextType {
  settings: QuizSettings
  updateSettings: (settings: Partial<QuizSettings>) => void
  resetSettings: () => void
}

const defaultSettings: QuizSettings = {
  feedbackTiming: "end",
  showExplanations: true,
  difficulty: "medium",
  shuffle: true,
  focusMode: false,
  limitQuestions: undefined,
  duration: 15 * 60, // 15 minutes in seconds
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<QuizSettings>(defaultSettings)

  const updateSettings = (newSettings: Partial<QuizSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  const value = {
    settings,
    updateSettings,
    resetSettings,
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}