"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useProgress } from "@/contexts/progress-context"
import { AuthCheck } from "@/components/auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  LineChart,
  Target,
  Clock,
  Trophy,
  BookOpen,
  Video,
  CheckCircle,
  Plus,
  Trash2,
  Brain,
} from "lucide-react"
import Link from "next/link"

export default function ProgressPage() {
  const { user } = useAuth()
  const { sessions, goals, addGoal, deleteGoal, getStats } = useProgress()
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: 10,
    unit: "minutes" as const,
    category: "general" as const,
    deadline: undefined as string | undefined,
  })
  const [date, setDate] = useState<Date>()

  // Get statistics
  const stats = getStats()

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline"
    return format(new Date(dateString), "PPP")
  }

  // Handle goal creation
  const handleCreateGoal = () => {
    addGoal({
      ...newGoal,
      deadline: date ? date.toISOString() : undefined,
    })
    setShowAddGoalDialog(false)
    setNewGoal({
      name: "",
      target: 10,
      unit: "minutes",
      category: "general",
      deadline: undefined,
    })
    setDate(undefined)
  }

  // Sort sessions by date (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group sessions by day
  const sessionsByDay = sortedSessions.reduce(
    (groups, session) => {
      const date = new Date(session.date).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(session)
      return groups
    },
    {} as Record<string, typeof sessions>,
  )

  return (
    <AuthCheck>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Learning Progress</h1>
            <p className="text-muted-foreground">Track your German language learning journey</p>
          </div>
          <Button onClick={() => setShowAddGoalDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Set New Goal
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Learning Time</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(stats.totalTime / 60)} hours {stats.totalTime % 60} min
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Words Learned</p>
                  <p className="text-2xl font-bold">{stats.wordsLearned}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Videos Watched</p>
                  <p className="text-2xl font-bold">{stats.videosWatched}</p>
                </div>
                <Video className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="goals">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="goals">
              <Target className="mr-2 h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="activity">
              <LineChart className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="mr-2 h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="space-y-6">
              {goals.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-muted-foreground mb-4">You haven't set any learning goals yet.</p>
                    <Button onClick={() => setShowAddGoalDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Set Your First Goal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {goals.map((goal) => (
                    <Card
                      key={goal.id}
                      className={goal.completed ? "border-green-500 bg-green-50 dark:bg-green-900/10" : ""}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="flex items-center">
                            {goal.completed && <CheckCircle className="mr-2 h-5 w-5 text-green-500" />}
                            {goal.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteGoal(goal.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>
                          Category: {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>
                              Progress: {goal.progress} / {goal.target} {goal.unit}
                            </span>
                            <span>{Math.min(Math.round((goal.progress / goal.target) * 100), 100)}%</span>
                          </div>
                          <Progress value={Math.min((goal.progress / goal.target) * 100, 100)} />

                          {goal.deadline && (
                            <p className="text-sm text-muted-foreground">Deadline: {formatDate(goal.deadline)}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="space-y-6">
              {Object.keys(sessionsByDay).length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-muted-foreground mb-4">No learning activity recorded yet.</p>
                    <Link href="/videos">
                      <Button>
                        <Video className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                Object.entries(sessionsByDay).map(([date, daySessions]) => (
                  <div key={date}>
                    <h3 className="font-medium text-lg mb-3">{date}</h3>
                    <div className="space-y-3">
                      {daySessions.map((session) => (
                        <Card key={session.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center">
                                  {session.type === "quiz" && <Brain className="mr-2 h-4 w-4 text-purple-500" />}
                                  {session.type === "flashcards" && <BookOpen className="mr-2 h-4 w-4 text-blue-500" />}
                                  {session.type === "exercises" && (
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  )}
                                  {session.type === "practice" && <Clock className="mr-2 h-4 w-4 text-orange-500" />}
                                  {session.type === "vocabulary" && (
                                    <BookOpen className="mr-2 h-4 w-4 text-indigo-500" />
                                  )}
                                  {session.type === "video" && <Video className="mr-2 h-4 w-4 text-red-500" />}
                                  <span className="font-medium capitalize">{session.type}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{session.resourceName}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                {session.score !== undefined && (
                                  <Badge variant={session.score >= 70 ? "default" : "outline"}>
                                    Score: {session.score}%
                                  </Badge>
                                )}
                                {session.correct !== undefined && session.total !== undefined && (
                                  <Badge variant="outline">
                                    {session.correct} / {session.total} correct
                                  </Badge>
                                )}
                                <Badge variant="secondary">
                                  {Math.floor(session.duration / 60)}:
                                  {(session.duration % 60).toString().padStart(2, "0")} min
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card
                className={stats.totalTime >= 60 ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "opacity-60"}
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">First Hour</h3>
                  <p className="text-sm text-muted-foreground mb-3">Complete 1 hour of learning</p>
                  <Progress value={Math.min((stats.totalTime / 60) * 100, 100)} />
                </CardContent>
              </Card>

              <Card
                className={
                  stats.wordsLearned >= 100 ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "opacity-60"
                }
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Vocabulary Builder</h3>
                  <p className="text-sm text-muted-foreground mb-3">Learn 100 German words</p>
                  <Progress value={Math.min((stats.wordsLearned / 100) * 100, 100)} />
                </CardContent>
              </Card>

              <Card
                className={
                  stats.videosWatched >= 10 ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "opacity-60"
                }
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Video className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Video Master</h3>
                  <p className="text-sm text-muted-foreground mb-3">Watch 10 learning videos</p>
                  <Progress value={Math.min((stats.videosWatched / 10) * 100, 100)} />
                </CardContent>
              </Card>

              <Card
                className={
                  stats.totalSessions >= 20 ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "opacity-60"
                }
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <LineChart className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Consistent Learner</h3>
                  <p className="text-sm text-muted-foreground mb-3">Complete 20 learning sessions</p>
                  <Progress value={Math.min((stats.totalSessions / 20) * 100, 100)} />
                </CardContent>
              </Card>

              <Card
                className={
                  stats.averageScore >= 80 ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "opacity-60"
                }
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">High Achiever</h3>
                  <p className="text-sm text-muted-foreground mb-3">Maintain an 80% average score</p>
                  <Progress value={Math.min((stats.averageScore / 80) * 100, 100)} />
                </CardContent>
              </Card>

              <Card
                className={
                  goals.filter((g) => g.completed).length >= 3
                    ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                    : "opacity-60"
                }
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Goal Crusher</h3>
                  <p className="text-sm text-muted-foreground mb-3">Complete 3 learning goals</p>
                  <Progress value={Math.min((goals.filter((g) => g.completed).length / 3) * 100, 100)} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Goal Dialog */}
        <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set a New Learning Goal</DialogTitle>
              <DialogDescription>
                Define a specific, measurable goal to track your German learning progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Learn 100 new words"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    min="1"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-unit">Unit</Label>
                  <Select value={newGoal.unit} onValueChange={(value: any) => setNewGoal({ ...newGoal, unit: value })}>
                    <SelectTrigger id="goal-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="sessions">Sessions</SelectItem>
                      <SelectItem value="words">Words</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                      <SelectItem value="exercises">Exercises</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value: any) => setNewGoal({ ...newGoal, category: value })}
                >
                  <SelectTrigger id="goal-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Deadline (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="goal-deadline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddGoalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGoal} disabled={!newGoal.name.trim()}>
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthCheck>
  )
}
