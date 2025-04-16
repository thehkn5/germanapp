"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BarChart2, PieChart, LineChart, Target, TrendingUp, Activity } from "lucide-react"
import { format, subDays, subWeeks, subMonths, eachDayOfInterval } from "date-fns"

// Mock data - to be replaced with actual service implementation
type ProgressData = {
  totalTimeSpent: number // in minutes
  weeklyTimeSpent: number[]
  sessionsCompleted: number
  weeklySessionsCount: number[]
  vocabProgress: {
    learned: number
    reviewing: number
    mastered: number
    total: number
  }
  grammarProgress: {
    learned: number
    mastered: number
    total: number
  }
  dailyActivity: {
    date: Date
    minutes: number
    sessions: number
  }[]
  skillLevels: {
    skill: "vocabulary" | "grammar" | "reading" | "writing" | "listening" | "speaking"
    level: number // 0-100
  }[]
  streakDays: number
  lastPracticeDate: Date
}

const mockProgressData: ProgressData = {
  totalTimeSpent: 8760, // 146 hours
  weeklyTimeSpent: [210, 180, 240, 150, 300, 270, 210], // Minutes per day over the past week
  sessionsCompleted: 124,
  weeklySessionsCount: [2, 2, 3, 1, 4, 3, 2], // Sessions per day over the past week
  vocabProgress: {
    learned: 950,
    reviewing: 320,
    mastered: 580,
    total: 2000
  },
  grammarProgress: {
    learned: 18,
    mastered: 12,
    total: 35
  },
  dailyActivity: Array.from({ length: 30 }, (_, i) => ({
    date: subDays(new Date(), i),
    minutes: Math.floor(Math.random() * 120) + 10,
    sessions: Math.floor(Math.random() * 3) + 1
  })).reverse(),
  skillLevels: [
    { skill: "vocabulary", level: 68 },
    { skill: "grammar", level: 52 },
    { skill: "reading", level: 64 },
    { skill: "writing", level: 38 },
    { skill: "listening", level: 45 },
    { skill: "speaking", level: 30 }
  ],
  streakDays: 12,
  lastPracticeDate: new Date()
}

export default function ProgressView() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [progressData] = useState<ProgressData>(mockProgressData)
  
  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
  
  // Get appropriate date display based on time range
  const getTimeRangeDisplay = () => {
    const now = new Date()
    if (timeRange === "week") {
      const startDate = subDays(now, 6)
      return `${format(startDate, "MMM d")} - ${format(now, "MMM d, yyyy")}`
    } else if (timeRange === "month") {
      const startDate = subMonths(now, 1)
      return `${format(startDate, "MMM d")} - ${format(now, "MMM d, yyyy")}`
    } else {
      const startDate = subMonths(now, 12)
      return `${format(startDate, "MMM yyyy")} - ${format(now, "MMM yyyy")}`
    }
  }
  
  // Calculate total vocabulary progress percentage
  const vocabProgressPercentage = Math.round(
    ((progressData.vocabProgress.learned + progressData.vocabProgress.mastered) / 
    progressData.vocabProgress.total) * 100
  )
  
  // Calculate total grammar progress percentage
  const grammarProgressPercentage = Math.round(
    ((progressData.grammarProgress.learned + progressData.grammarProgress.mastered) / 
    progressData.grammarProgress.total) * 100
  )
  
  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Progress Overview</h2>
          <p className="text-muted-foreground">{getTimeRangeDisplay()}</p>
        </div>
        
        <div className="w-full md:w-48">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Study Time</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{formatTime(progressData.totalTimeSpent)}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {timeRange === "week" 
                ? `${formatTime(progressData.weeklyTimeSpent.reduce((a, b) => a + b, 0))} this week`
                : `Average ${formatTime(Math.round(progressData.totalTimeSpent / 30))} per month`
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice Sessions</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{progressData.sessionsCompleted}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {timeRange === "week" 
                ? `${progressData.weeklySessionsCount.reduce((a, b) => a + b, 0)} sessions this week`
                : `About ${Math.round(progressData.sessionsCompleted / 4)} sessions per week`
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Streak</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{progressData.streakDays} days</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Last practice: {format(progressData.lastPracticeDate, "PP")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vocabulary Progress</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{vocabProgressPercentage}%</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={vocabProgressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">
              {progressData.vocabProgress.learned + progressData.vocabProgress.mastered} of {progressData.vocabProgress.total} words
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different progress views */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>
                Time spent studying each day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would be a chart component */}
              <div className="h-80 flex items-end space-x-2">
                {progressData.dailyActivity.slice(-7).map((day, i) => (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div 
                      className="w-full bg-primary/20 relative rounded-t"
                      style={{ 
                        height: `${(day.minutes / 120) * 100}%`,
                        maxHeight: '100%' 
                      }}
                    >
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t"
                        style={{ 
                          height: `${(day.minutes / 120) * 100}%`,
                          maxHeight: '100%' 
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(day.date, "E")}
                    </span>
                    <span className="text-xs font-medium">
                      {Math.floor(day.minutes / 60)}h {day.minutes % 60}m
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vocabulary" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Progress</CardTitle>
              <CardDescription>
                Track your vocabulary acquisition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Overall Progress</Label>
                    <span className="text-sm font-medium">{vocabProgressPercentage}%</span>
                  </div>
                  <Progress value={vocabProgressPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Learned</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{progressData.vocabProgress.learned}</span>
                        <Badge variant="outline">
                          {Math.round((progressData.vocabProgress.learned / progressData.vocabProgress.total) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Reviewing</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{progressData.vocabProgress.reviewing}</span>
                        <Badge variant="outline">
                          {Math.round((progressData.vocabProgress.reviewing / progressData.vocabProgress.total) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Mastered</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{progressData.vocabProgress.mastered}</span>
                        <Badge variant="default">
                          {Math.round((progressData.vocabProgress.mastered / progressData.vocabProgress.total) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grammar" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Grammar Progress</CardTitle>
              <CardDescription>
                Grammar concepts and rules mastery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Overall Progress</Label>
                    <span className="text-sm font-medium">{grammarProgressPercentage}%</span>
                  </div>
                  <Progress value={grammarProgressPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Rules Learned</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{progressData.grammarProgress.learned}</span>
                        <Badge variant="outline">
                          {Math.round((progressData.grammarProgress.learned / progressData.grammarProgress.total) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Rules Mastered</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{progressData.grammarProgress.mastered}</span>
                        <Badge variant="default">
                          {Math.round((progressData.grammarProgress.mastered / progressData.grammarProgress.total) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Remaining</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">
                          {progressData.grammarProgress.total - 
                            (progressData.grammarProgress.learned + progressData.grammarProgress.mastered)}
                        </span>
                        <Badge variant="outline">
                          {Math.round(((progressData.grammarProgress.total - 
                            (progressData.grammarProgress.learned + progressData.grammarProgress.mastered)) / 
                            progressData.grammarProgress.total) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Your estimated proficiency levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressData.skillLevels.map(skill => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="capitalize">{skill.skill}</Label>
                      <span className="text-sm font-medium">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
              <CardDescription>
                Progress towards your learning goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground text-center">
                  Connect your goals to see progress tracking here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 