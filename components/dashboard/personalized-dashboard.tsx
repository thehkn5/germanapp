"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Target, Calendar, Trophy, Clock, Map } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

// Mock data for demonstration
const mockRecentLists = [
  {
    id: "1",
    name: "Basic German Vocabulary",
    wordCount: 50,
    lastStudied: "2024-04-01",
  },
  {
    id: "2",
    name: "Common Phrases",
    wordCount: 30,
    lastStudied: "2024-03-30",
  },
]

const mockSuggestedActivities = [
  {
    id: "1",
    type: "vocabulary",
    title: "Practice Basic Vocabulary",
    description: "Review and practice basic German words",
    progress: 75,
  },
  {
    id: "2",
    type: "video",
    title: "Watch Grammar Lesson",
    description: "Learn about German sentence structure",
    progress: 0,
  },
]

export function PersonalizedDashboard() {
  const { user } = useAuth()
  const [recentLists, setRecentLists] = useState(mockRecentLists)
  const [suggestedActivities, setSuggestedActivities] = useState(mockSuggestedActivities)

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.displayName || "Learner"}!
          </h1>
          <p className="text-muted-foreground">Continue your German learning journey</p>
        </div>
        <Button asChild>
          <Link href="/vocabulary">Start Learning</Link>
        </Button>
      </div>

      {/* New Feature Highlight */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-background p-3 rounded-full">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Create Your Learning Roadmap</h3>
                <p className="text-muted-foreground mt-1">
                  Plan your language learning journey with customizable goals, milestones, and progress tracking
                </p>
              </div>
            </div>
            <Button asChild size="lg">
              <Link href="/roadmap">Try It Now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vocabulary Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recentLists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                    <Badge variant="outline">{list.wordCount} words</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last studied: {new Date(list.lastStudied).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/vocabulary/custom/${list.id}`}>Study</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {suggestedActivities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {activity.type === "vocabulary" && <BookOpen className="h-5 w-5 text-blue-500" />}
                    {activity.type === "video" && <Video className="h-5 w-5 text-red-500" />}
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{activity.progress}%</span>
                    </div>
                    <Progress value={activity.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 