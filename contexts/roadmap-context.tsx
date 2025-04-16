"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { LanguageGoal, LanguageTask, LanguageMilestone, LanguageProficiency, EnhancedUserGoals, CEFRLevel, LearningFocus } from "@/types/roadmap"
import { useAuth } from "./auth-context"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Storage key
const LANGUAGE_GOALS_STORAGE_KEY = "user_language_goals"

interface LanguageGoalsContextType {
  userGoals: EnhancedUserGoals;
  goals: LanguageGoal[];
  proficiency: LanguageProficiency;
  
  // Goal management
  createGoal: (goal: Omit<LanguageGoal, "id" | "progress" | "completed" | "tasks" | "milestones" | "dateCreated" | "dateUpdated">) => LanguageGoal;
  updateGoal: (goalId: string, updates: Partial<Omit<LanguageGoal, "id" | "tasks" | "milestones">>) => void;
  deleteGoal: (goalId: string) => void;
  
  // Task management
  addTask: (goalId: string, task: Omit<LanguageTask, "id" | "completed" | "dateCompleted">) => void;
  updateTask: (goalId: string, taskId: string, updates: Partial<Omit<LanguageTask, "id">>) => void;
  deleteTask: (goalId: string, taskId: string) => void;
  toggleTaskCompletion: (goalId: string, taskId: string, completed: boolean) => void;
  
  // Milestone management
  addMilestone: (goalId: string, milestone: Omit<LanguageMilestone, "id" | "progress" | "completed" | "dateCompleted">) => void;
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Omit<LanguageMilestone, "id" | "progress" | "completed">>) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  
  // Proficiency management
  updateProficiency: (updates: Partial<LanguageProficiency>) => void;
  
  // Activity tracking
  recordActivity: (activityType: string, details: any) => void;
  
  // Stats and helper functions
  getGoalCompletion: (goalId: string) => number;
  getMilestoneCompletion: (goalId: string, milestoneId: string) => number;
  getRecommendedTasks: () => LanguageTask[];
  assessProgress: () => {
    wordsLearned: number;
    exercisesCompleted: number;
    videosWatched: number;
    timeSpent: number;
  };
}

const defaultProficiency: LanguageProficiency = {
  overall: "A1",
  vocabulary: "A1",
  grammar: "A1",
  speaking: "A1",
  listening: "A1",
  reading: "A1",
  writing: "A1",
};

const defaultUserGoals: EnhancedUserGoals = {
  languageGoals: [],
  proficiency: defaultProficiency,
  badges: [],
  streakDays: 0,
};

const LanguageGoalsContext = createContext<LanguageGoalsContextType | undefined>(undefined)

export function LanguageGoalsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [userGoals, setUserGoals] = useState<EnhancedUserGoals>(defaultUserGoals)

  // Load user goals from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedGoals = localStorage.getItem(`${LANGUAGE_GOALS_STORAGE_KEY}_${user.uid}`)
      if (storedGoals) {
        try {
        setUserGoals(JSON.parse(storedGoals))
        } catch (error) {
          console.error("Error parsing stored goals:", error)
          setUserGoals(defaultUserGoals)
        }
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
      localStorage.setItem(`${LANGUAGE_GOALS_STORAGE_KEY}_${user.uid}`, JSON.stringify(userGoals))
    }
  }, [userGoals, user])

  // Create a new language goal
  const createGoal = (goalData: Omit<LanguageGoal, "id" | "progress" | "completed" | "tasks" | "milestones" | "dateCreated" | "dateUpdated">) => {
    const now = new Date().toISOString()
    const newGoal: LanguageGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      tasks: [],
      milestones: [],
      progress: 0,
      completed: false,
      dateCreated: now,
      dateUpdated: now,
    }

    setUserGoals((prev) => ({
      ...prev,
      languageGoals: [...prev.languageGoals, newGoal],
    }))

    return newGoal
  }

  // Update an existing goal
  const updateGoal = (goalId: string, updates: Partial<Omit<LanguageGoal, "id" | "tasks" | "milestones">>) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            ...updates,
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
  }

  // Delete a goal
  const deleteGoal = (goalId: string) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.filter((goal) => goal.id !== goalId),
    }))
  }

  // Add a task to a goal
  const addTask = (goalId: string, taskData: Omit<LanguageTask, "id" | "completed" | "dateCompleted">) => {
    const newTask: LanguageTask = {
      ...taskData,
      id: `task_${Date.now()}`,
      completed: false,
    }

    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedTasks = [...goal.tasks, newTask]
          return {
            ...goal,
            tasks: updatedTasks,
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update goal and milestone progress
    updateGoalProgress(goalId)
  }

  // Update a task
  const updateTask = (goalId: string, taskId: string, updates: Partial<Omit<LanguageTask, "id">>) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            tasks: goal.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  ...updates,
                }
              }
              return task
            }),
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update goal and milestone progress if completion status changed
    if (updates.completed !== undefined) {
      updateGoalProgress(goalId)
    }
  }

  // Delete a task
  const deleteTask = (goalId: string, taskId: string) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          // Also remove this task ID from any milestones that reference it
          const updatedMilestones = goal.milestones.map(milestone => ({
            ...milestone,
            tasks: milestone.tasks.filter(id => id !== taskId)
          }))
          
          return {
            ...goal,
            tasks: goal.tasks.filter((task) => task.id !== taskId),
            milestones: updatedMilestones,
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update goal and milestone progress
    updateGoalProgress(goalId)
  }

  // Toggle task completion
  const toggleTaskCompletion = (goalId: string, taskId: string, completed: boolean) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            tasks: goal.tasks.map((task) => {
              if (task.id === taskId) {
              return {
                  ...task,
                completed,
                  dateCompleted: completed ? new Date().toISOString() : undefined,
                }
              }
              return task
            }),
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update goal and milestone progress
    updateGoalProgress(goalId)
  }

  // Add a milestone to a goal
  const addMilestone = (goalId: string, milestoneData: Omit<LanguageMilestone, "id" | "progress" | "completed" | "dateCompleted">) => {
    const newMilestone: LanguageMilestone = {
      ...milestoneData,
      id: `milestone_${Date.now()}`,
      progress: 0,
      completed: false,
    }

    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: [...goal.milestones, newMilestone],
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update milestone progress
    updateMilestoneProgress(goalId, newMilestone.id)
  }

  // Update a milestone
  const updateMilestone = (goalId: string, milestoneId: string, updates: Partial<Omit<LanguageMilestone, "id" | "progress" | "completed">>) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.map((milestone) => {
              if (milestone.id === milestoneId) {
                return {
                  ...milestone,
                  ...updates,
                }
              }
              return milestone
            }),
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update milestone progress if task list changed
    if (updates.tasks) {
      updateMilestoneProgress(goalId, milestoneId)
    }
  }

  // Delete a milestone
  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setUserGoals((prev) => ({
      ...prev,
      languageGoals: prev.languageGoals.map((goal) => {
        if (goal.id === goalId) {
          // Update tasks to remove the milestone reference
          const updatedTasks = goal.tasks.map(task => {
            if (task.milestone === milestoneId) {
              return { ...task, milestone: undefined }
            }
            return task
          })
          
          return {
            ...goal,
            tasks: updatedTasks,
            milestones: goal.milestones.filter((milestone) => milestone.id !== milestoneId),
            dateUpdated: new Date().toISOString(),
          }
        }
        return goal
      }),
    }))
    
    // Update goal progress
    updateGoalProgress(goalId)
  }

  // Update proficiency levels
  const updateProficiency = (updates: Partial<LanguageProficiency>) => {
    setUserGoals((prev) => ({
      ...prev,
      proficiency: {
        ...prev.proficiency,
        ...updates,
        lastAssessed: new Date().toISOString(),
      },
    }))
  }

  // Record user activity (for streak tracking and analytics)
  const recordActivity = (activityType: string, details: any) => {
    const now = new Date().toISOString()
    
    setUserGoals((prev) => {
      // Handle streak calculation
      let updatedStreakDays = prev.streakDays
      const lastActivityDate = prev.lastActivity ? new Date(prev.lastActivity).setHours(0, 0, 0, 0) : null
      const today = new Date().setHours(0, 0, 0, 0)
      const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0)
      
      if (!lastActivityDate || new Date(lastActivityDate).getTime() < yesterday) {
        // Reset streak if more than a day has passed
        updatedStreakDays = 1
      } else if (new Date(lastActivityDate).getTime() === yesterday) {
        // Increment streak if last activity was yesterday
        updatedStreakDays += 1
      }
      // If last activity was today, keep the same streak
      
      return {
        ...prev,
        streakDays: updatedStreakDays,
        lastActivity: now,
      }
    })
    
    // Further activity tracking could be implemented here
    // e.g., storing activity history, updating analytics, etc.
  }

  // Helper function to calculate goal completion percentage
  const getGoalCompletion = (goalId: string): number => {
    const goal = userGoals.languageGoals.find(g => g.id === goalId)
    if (!goal || goal.tasks.length === 0) return 0
    
    const completedTasks = goal.tasks.filter(task => task.completed).length
    return Math.round((completedTasks / goal.tasks.length) * 100)
  }

  // Helper function to calculate milestone completion percentage
  const getMilestoneCompletion = (goalId: string, milestoneId: string): number => {
    const goal = userGoals.languageGoals.find(g => g.id === goalId)
    if (!goal) return 0
    
    const milestone = goal.milestones.find(m => m.id === milestoneId)
    if (!milestone || milestone.tasks.length === 0) return 0
    
    const completedTasks = milestone.tasks.filter(taskId => {
      const task = goal.tasks.find(t => t.id === taskId)
      return task && task.completed
    }).length
    
    return Math.round((completedTasks / milestone.tasks.length) * 100)
  }

  // Helper function to update goal progress
  const updateGoalProgress = (goalId: string) => {
    setUserGoals((prev) => {
      const updatedGoals = prev.languageGoals.map((goal) => {
        if (goal.id !== goalId) return goal
        
        // Calculate goal progress
        const totalTasks = goal.tasks.length
        if (totalTasks === 0) return { ...goal, progress: 0, completed: false }
        
        const completedTasks = goal.tasks.filter(task => task.completed).length
        const progress = Math.round((completedTasks / totalTasks) * 100)
        const completed = progress === 100
        
        // Also update milestones progress
        const updatedMilestones = goal.milestones.map((milestone) => {
          const totalMilestoneTasks = milestone.tasks.length
          if (totalMilestoneTasks === 0) return { ...milestone, progress: 0, completed: false }
          
          const completedMilestoneTasks = milestone.tasks.filter(taskId => {
            const task = goal.tasks.find(t => t.id === taskId)
            return task && task.completed
          }).length
          
          const milestoneProgress = Math.round((completedMilestoneTasks / totalMilestoneTasks) * 100)
          const milestoneCompleted = milestoneProgress === 100
          
          return {
            ...milestone,
            progress: milestoneProgress,
            completed: milestoneCompleted,
            dateCompleted: milestoneCompleted && !milestone.completed ? new Date().toISOString() : milestone.dateCompleted,
          }
        })
        
        return {
          ...goal,
          milestones: updatedMilestones,
          progress,
          completed,
          dateUpdated: new Date().toISOString(),
        }
      })
      
      return {
        ...prev,
        languageGoals: updatedGoals,
      }
    })
  }

  // Helper function to update milestone progress
  const updateMilestoneProgress = (goalId: string, milestoneId: string) => {
    setUserGoals((prev) => {
      const updatedGoals = prev.languageGoals.map((goal) => {
        if (goal.id !== goalId) return goal
        
        const updatedMilestones = goal.milestones.map((milestone) => {
          if (milestone.id !== milestoneId) return milestone
          
          const totalMilestoneTasks = milestone.tasks.length
          if (totalMilestoneTasks === 0) return { ...milestone, progress: 0, completed: false }
          
          const completedMilestoneTasks = milestone.tasks.filter(taskId => {
            const task = goal.tasks.find(t => t.id === taskId)
            return task && task.completed
          }).length
          
          const milestoneProgress = Math.round((completedMilestoneTasks / totalMilestoneTasks) * 100)
          const milestoneCompleted = milestoneProgress === 100
          
          return {
            ...milestone,
            progress: milestoneProgress,
            completed: milestoneCompleted,
            dateCompleted: milestoneCompleted && !milestone.completed ? new Date().toISOString() : milestone.dateCompleted,
          }
        })
        
        return {
          ...goal,
          milestones: updatedMilestones,
          dateUpdated: new Date().toISOString(),
        }
      })
      
      return {
        ...prev,
        languageGoals: updatedGoals,
      }
    })
    
    // Also update overall goal progress
    updateGoalProgress(goalId)
  }

  // Get tasks recommended for the user based on their goals and priorities
  const getRecommendedTasks = (): LanguageTask[] => {
    // Flatten all tasks from all goals
    const allTasks = userGoals.languageGoals.flatMap(goal => 
      goal.tasks
        .filter(task => !task.completed) // Only include incomplete tasks
        .map(task => ({
          ...task,
          goalId: goal.id,
          goalTitle: goal.title,
        }))
    )
    
    // Sort tasks by priority (high -> medium -> low) and due date (closest first)
    return allTasks.sort((a, b) => {
      // Priority takes precedence
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Then sort by due date if both have one
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      
      // Tasks with due dates come before those without
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      
      return 0
    })
  }

  // Assessment function for overall learning progress
  const assessProgress = () => {
    // Count completed tasks by type
    const completedTasks = userGoals.languageGoals.flatMap(goal => 
      goal.tasks.filter(task => task.completed)
    )
    
    const wordTasks = completedTasks.filter(task => 
      task.type === 'vocabulary' || task.focus === 'vocabulary'
    )
    
    const exerciseTasks = completedTasks.filter(task => 
      ['exercise', 'quiz', 'flashcard'].includes(task.type)
    )
    
    const videoTasks = completedTasks.filter(task => task.type === 'video')
    
    // Calculate total time spent (in minutes)
    const timeSpent = completedTasks.reduce((total, task) => 
      total + (task.estimatedTime || 0), 0
    )
    
    return {
      wordsLearned: wordTasks.length * 10, // Rough estimate: 10 words per vocabulary task
      exercisesCompleted: exerciseTasks.length,
      videosWatched: videoTasks.length,
      timeSpent,
    }
  }

  return (
    <LanguageGoalsContext.Provider
      value={{
        userGoals,
        goals: userGoals.languageGoals,
        proficiency: userGoals.proficiency,
        createGoal,
        updateGoal,
        deleteGoal,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        updateProficiency,
        recordActivity,
        getGoalCompletion,
        getMilestoneCompletion,
        getRecommendedTasks,
        assessProgress,
      }}
    >
      {children}
    </LanguageGoalsContext.Provider>
  )
}

export function useLanguageGoals() {
  const context = useContext(LanguageGoalsContext)
  if (context === undefined) {
    throw new Error("useLanguageGoals must be used within a LanguageGoalsProvider")
  }
  return context
}
