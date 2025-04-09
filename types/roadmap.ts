export interface RoadmapItem {
  id: string
  type: "video" | "exercise" | "quiz" | "flashcard" | "custom"
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  link?: string
  videoId?: string
  estimatedTime?: number // in minutes
  category?: string
  dateAdded: string
  dateCompleted?: string
}

export interface Roadmap {
  id: string
  title: string
  description: string
  goal: string
  category: "vocabulary" | "grammar" | "speaking" | "listening" | "reading" | "writing" | "general"
  weeklyTime: number // in minutes
  items: RoadmapItem[]
  progress: number // 0-100
  dateCreated: string
  dateUpdated: string
  estimatedCompletionDate?: string
}

export interface UserGoals {
  roadmaps: Roadmap[]
  badges: string[]
  streakDays: number
  lastActivity?: string
}
