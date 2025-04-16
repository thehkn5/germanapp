"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export type ActivityType = 
  | "vocabulary" 
  | "grammar" 
  | "reading" 
  | "listening" 
  | "speaking" 
  | "writing"

export type Activity = {
  id: string
  type: ActivityType
  title: string
  date: string // ISO string
  duration: number // in minutes
  completed: boolean
  resourceId?: string // ID of related resource (vocab list, grammar lesson, etc.)
}

export type RecentActivity = {
  type: ActivityType
  title: string
  id: string
  resourceId?: string
  lastAccessedAt: string // ISO string
}

export type ActivityContextType = {
  activities: Activity[]
  recentActivities: RecentActivity[]
  // Activity tracking
  recordActivity: (activity: Omit<Activity, "id" | "date">) => void
  updateActivity: (id: string, updates: Partial<Omit<Activity, "id">>) => void
  deleteActivity: (id: string) => void
  // Recent activity tracking
  trackResourceAccess: (
    type: ActivityType, 
    title: string, 
    id: string, 
    resourceId?: string
  ) => void
  getActivityStats: () => {
    totalTime: number // in minutes
    byType: Record<ActivityType, number> // time in minutes per activity type
    completedCount: number
  }
  getMostFrequentActivity: () => ActivityType | null
  clearActivities: () => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useLocalStorage<Activity[]>("user-activities", [])
  const [recentActivities, setRecentActivities] = useLocalStorage<RecentActivity[]>(
    "recent-activities", 
    []
  )
  
  // Record a new learning activity
  const recordActivity = (activity: Omit<Activity, "id" | "date">) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    
    setActivities(prev => [newActivity, ...prev])
    
    // Also update recent activities
    trackResourceAccess(
      activity.type,
      activity.title,
      newActivity.id,
      activity.resourceId
    )
  }
  
  // Update an existing activity
  const updateActivity = (id: string, updates: Partial<Omit<Activity, "id">>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, ...updates } 
          : activity
      )
    )
  }
  
  // Delete an activity
  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id))
  }
  
  // Track when a resource is accessed
  const trackResourceAccess = (
    type: ActivityType, 
    title: string, 
    id: string, 
    resourceId?: string
  ) => {
    const now = new Date().toISOString()
    
    // Check if we already have this activity in our recent list
    setRecentActivities(prev => {
      const existingIndex = prev.findIndex(
        a => (resourceId && a.resourceId === resourceId) || 
             (!resourceId && a.id === id)
      )
      
      if (existingIndex !== -1) {
        // Move to top and update timestamp
        const existing = prev[existingIndex]
        const updated = { ...existing, lastAccessedAt: now }
        const newList = [...prev]
        newList.splice(existingIndex, 1)
        return [updated, ...newList].slice(0, 10) // Keep only 10 most recent
      } else {
        // Add new activity to the top
        return [
          { type, title, id, resourceId, lastAccessedAt: now },
          ...prev
        ].slice(0, 10) // Keep only 10 most recent
      }
    })
  }
  
  // Get activity statistics
  const getActivityStats = () => {
    const stats = {
      totalTime: 0,
      byType: {
        vocabulary: 0,
        grammar: 0,
        reading: 0,
        listening: 0,
        speaking: 0,
        writing: 0
      } as Record<ActivityType, number>,
      completedCount: 0
    }
    
    activities.forEach(activity => {
      stats.totalTime += activity.duration
      stats.byType[activity.type] += activity.duration
      if (activity.completed) stats.completedCount++
    })
    
    return stats
  }
  
  // Get most frequent activity type
  const getMostFrequentActivity = (): ActivityType | null => {
    if (activities.length === 0) return null
    
    const typeCounts: Record<ActivityType, number> = {
      vocabulary: 0,
      grammar: 0,
      reading: 0,
      listening: 0,
      speaking: 0,
      writing: 0
    }
    
    activities.forEach(activity => {
      typeCounts[activity.type]++
    })
    
    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0][0] as ActivityType
  }
  
  // Clear all activities
  const clearActivities = () => {
    setActivities([])
    setRecentActivities([])
  }
  
  return (
    <ActivityContext.Provider
      value={{
        activities,
        recentActivities,
        recordActivity,
        updateActivity,
        deleteActivity,
        trackResourceAccess,
        getActivityStats,
        getMostFrequentActivity,
        clearActivities
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity(): ActivityContextType {
  const context = useContext(ActivityContext)
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider")
  }
  return context
} 