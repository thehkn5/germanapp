"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Roadmap, RoadmapItem, UserGoals } from "@/types/roadmap"
import { useAuth } from "./auth-context"

// Storage key
const ROADMAPS_STORAGE_KEY = "user_roadmaps"

interface RoadmapContextType {
  userGoals: UserGoals
  roadmaps: Roadmap[]
  createRoadmap: (roadmap: Omit<Roadmap, "id" | "progress" | "dateCreated" | "dateUpdated">) => Roadmap
  updateRoadmap: (roadmapId: string, updates: Partial<Roadmap>) => void
  deleteRoadmap: (roadmapId: string) => void
  addRoadmapItem: (roadmapId: string, item: Omit<RoadmapItem, "id" | "completed" | "dateAdded">) => void
  updateRoadmapItem: (roadmapId: string, itemId: string, updates: Partial<RoadmapItem>) => void
  deleteRoadmapItem: (roadmapId: string, itemId: string) => void
  toggleItemCompletion: (roadmapId: string, itemId: string, completed: boolean) => void
  setItemPriority: (roadmapId: string, itemId: string, priority: "low" | "medium" | "high") => void
  recordActivity: (type: string, details: any) => void
  getBadges: () => string[]
  getStreakDays: () => number
}

const defaultUserGoals: UserGoals = {
  roadmaps: [],
  badges: [],
  streakDays: 0,
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined)

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [userGoals, setUserGoals] = useState<UserGoals>(defaultUserGoals)

  // Load user goals from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedGoals = localStorage.getItem(`${ROADMAPS_STORAGE_KEY}_${user.uid}`)
      if (storedGoals) {
        setUserGoals(JSON.parse(storedGoals))
      } else {
        setUserGoals(defaultUserGoals)
      }
    } else {
      setUserGoals(defaultUserGoals)
    }
  }, [user])

  // Save user goals to localStorage whenever they change
  useEffect(() => {
    if (user) {
      // Only save if userGoals has actually changed (not on every render)
      const userGoalsString = JSON.stringify(userGoals)
      const storedGoalsString = localStorage.getItem(`${ROADMAPS_STORAGE_KEY}_${user.uid}`)

      // Only update localStorage if the value has actually changed
      if (userGoalsString !== storedGoalsString) {
        localStorage.setItem(`${ROADMAPS_STORAGE_KEY}_${user.uid}`, userGoalsString)
      }
    }
  }, [userGoals, user])

  // Create a new roadmap
  const createRoadmap = (roadmapData: Omit<Roadmap, "id" | "progress" | "dateCreated" | "dateUpdated">) => {
    const now = new Date().toISOString()
    const newRoadmap: Roadmap = {
      ...roadmapData,
      id: `roadmap_${Date.now()}`,
      progress: 0,
      dateCreated: now,
      dateUpdated: now,
      items: [],
    }

    setUserGoals((prev) => ({
      ...prev,
      roadmaps: [...prev.roadmaps, newRoadmap],
    }))

    return newRoadmap
  }

  // Update an existing roadmap
  const updateRoadmap = (roadmapId: string, updates: Partial<Roadmap>) => {
    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          return {
            ...roadmap,
            ...updates,
            dateUpdated: new Date().toISOString(),
          }
        }
        return roadmap
      }),
    }))
  }

  // Delete a roadmap
  const deleteRoadmap = (roadmapId: string) => {
    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.filter((roadmap) => roadmap.id !== roadmapId),
    }))
  }

  // Add an item to a roadmap
  const addRoadmapItem = (roadmapId: string, itemData: Omit<RoadmapItem, "id" | "completed" | "dateAdded">) => {
    const newItem: RoadmapItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      completed: false,
      dateAdded: new Date().toISOString(),
    }

    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedItems = [...roadmap.items, newItem]
          // Recalculate progress
          const completedItems = updatedItems.filter((item) => item.completed).length
          const progress = updatedItems.length > 0 ? Math.round((completedItems / updatedItems.length) * 100) : 0

          return {
            ...roadmap,
            items: updatedItems,
            progress,
            dateUpdated: new Date().toISOString(),
          }
        }
        return roadmap
      }),
    }))
  }

  // Update a roadmap item
  const updateRoadmapItem = (roadmapId: string, itemId: string, updates: Partial<RoadmapItem>) => {
    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          return {
            ...roadmap,
            items: roadmap.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  ...updates,
                }
              }
              return item
            }),
          }
        }
        return roadmap
      }),
    }))
  }

  // Delete a roadmap item
  const deleteRoadmapItem = (roadmapId: string, itemId: string) => {
    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          return {
            ...roadmap,
            items: roadmap.items.filter((item) => item.id !== itemId),
          }
        }
        return roadmap
      }),
    }))
  }

  // Toggle item completion status
  const toggleItemCompletion = (roadmapId: string, itemId: string, completed: boolean) => {
    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedItems = roadmap.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                completed,
              }
            }
            return item
          })

          // Recalculate progress
          const completedItems = updatedItems.filter((item) => item.completed).length
          const progress = updatedItems.length > 0 ? Math.round((completedItems / updatedItems.length) * 100) : 0

          return {
            ...roadmap,
            items: updatedItems,
            progress,
            dateUpdated: new Date().toISOString(),
          }
        }
        return roadmap
      }),
    }))
  }

  const setItemPriority = (roadmapId: string, itemId: string, priority: "low" | "medium" | "high") => {
    setUserGoals((prev) => ({
      ...prev,
      roadmaps: prev.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          return {
            ...roadmap,
            items: roadmap.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  priority,
                }
              }
              return item
            }),
          }
        }
        return roadmap
      }),
    }))
  }

  const recordActivity = (type: string, details: any) => {
    // Placeholder for activity recording logic
    console.log(`Activity recorded: ${type}`, details)
  }

  const getBadges = () => {
    return userGoals.badges
  }

  const getStreakDays = () => {
    return userGoals.streakDays
  }

  return (
    <RoadmapContext.Provider
      value={{
        userGoals,
        roadmaps: userGoals.roadmaps,
        createRoadmap,
        updateRoadmap,
        deleteRoadmap,
        addRoadmapItem,
        updateRoadmapItem,
        deleteRoadmapItem,
        toggleItemCompletion,
        setItemPriority,
        recordActivity,
        getBadges,
        getStreakDays,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  )
}

export function useRoadmap() {
  const context = useContext(RoadmapContext)
  if (!context) {
    throw new Error("useRoadmap must be used within a RoadmapProvider")
  }
  return context
}
