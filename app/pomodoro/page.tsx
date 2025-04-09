"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePomodoro } from "@/contexts/pomodoro-context"
import { useProgress } from "@/contexts/progress-context"
import { AuthCheck } from "@/components/auth-check"
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer"
import { PomodoroTask as PomodoroTaskComponent } from "@/components/pomodoro/pomodoro-task"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ListTodo, CheckCircle, Clock, BarChart, Target, Coffee } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LazyLoad } from "@/components/lazy-load"

export default function PomodoroPage() {
  const { user } = useAuth()
  const { tasks, addTask, updateTask, deleteTask, activeTaskId, setActiveTaskId, sessions, addTaskFromRoadmapGoal } =
    usePomodoro()
  const { roadmaps } = useProgress()

  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskEstimatedPomodoros, setNewTaskEstimatedPomodoros] = useState(1)
  const [showRoadmapTaskDialog, setShowRoadmapTaskDialog] = useState(false)
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)

  // Filter tasks
  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  // Get roadmap goals
  const getAvailableGoals = () => {
    if (!selectedRoadmapId) return []

    const roadmap = roadmaps.find((r) => r.id === selectedRoadmapId)
    if (!roadmap) return []

    return roadmap.goals.filter((g) => !g.completed)
  }

  // Add new task
  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask({
        text: newTaskText,
        completed: false,
        estimatedPomodoros: newTaskEstimatedPomodoros,
      })

      setNewTaskText("")
      setNewTaskEstimatedPomodoros(1)
      setShowAddTaskDialog(false)
    }
  }

  // Add roadmap task
  const handleAddRoadmapTask = () => {
    if (selectedRoadmapId && selectedGoalId) {
      const roadmap = roadmaps.find((r) => r.id === selectedRoadmapId)
      if (!roadmap) return

      const goal = roadmap.goals.find((g) => g.id === selectedGoalId)
      if (!goal) return

      addTaskFromRoadmapGoal(goal.id, goal.name)

      setSelectedRoadmapId(null)
      setSelectedGoalId(null)
      setShowRoadmapTaskDialog(false)
    }
  }

  return (
    <AuthCheck>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <LazyLoad>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timer column */}
            <div className="lg:col-span-1 space-y-6">
              <PomodoroTimer />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Current Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTaskId ? (
                    <div className="space-y-2">
                      <p className="font-medium">{tasks.find((t) => t.id === activeTaskId)?.text}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {tasks.find((t) => t.id === activeTaskId)?.completedPomodoros}/
                          {tasks.find((t) => t.id === activeTaskId)?.estimatedPomodoros} pomodoros
                        </span>
                      </div>
                      {tasks.find((t) => t.id === activeTaskId)?.subtasks.length ? (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            {tasks.find((t) => t.id === activeTaskId)?.subtasks.filter((s) => s.completed).length}/
                            {tasks.find((t) => t.id === activeTaskId)?.subtasks.length} subtasks completed
                          </span>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-2">No task selected</p>
                      <Button size="sm" onClick={() => setShowAddTaskDialog(true)}>
                        Add Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tasks column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tasks</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setShowRoadmapTaskDialog(true)} variant="outline" className="gap-2">
                    <Target className="h-4 w-4" />
                    Add from Roadmap
                  </Button>
                  <Button onClick={() => setShowAddTaskDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active" className="flex gap-2">
                    <ListTodo className="h-4 w-4" />
                    Active ({activeTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Completed ({completedTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="flex gap-2">
                    <BarChart className="h-4 w-4" />
                    Stats
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4 mt-4">
                  {activeTasks.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No active tasks</p>
                        <Button onClick={() => setShowAddTaskDialog(true)}>Add Your First Task</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {activeTasks.map((task) => (
                        <PomodoroTaskComponent
                          key={task.id}
                          task={task}
                          onUpdate={updateTask}
                          onDelete={deleteTask}
                          onSelect={setActiveTaskId}
                          isSelected={task.id === activeTaskId}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-4">
                  {completedTasks.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">No completed tasks</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {completedTasks.map((task) => (
                        <PomodoroTaskComponent
                          key={task.id}
                          task={task}
                          onUpdate={updateTask}
                          onDelete={deleteTask}
                          onSelect={setActiveTaskId}
                          isSelected={task.id === activeTaskId}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pomodoro Statistics</CardTitle>
                      <CardDescription>Your productivity overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold">
                                {sessions.filter((s) => s.type === "work" && s.completed).length}
                              </div>
                              <p className="text-sm text-muted-foreground">Completed Pomodoros</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold">
                                {Math.round(
                                  sessions
                                    .filter((s) => s.type === "work" && s.completed)
                                    .reduce((total, session) => total + session.duration, 0) / 60,
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">Minutes Focused</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold">{tasks.filter((t) => t.completed).length}</div>
                              <p className="text-sm text-muted-foreground">Completed Tasks</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent sessions */}
                      <div className="mt-6">
                        <h3 className="font-medium mb-4">Recent Sessions</h3>
                        {sessions.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No sessions recorded yet</p>
                        ) : (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {sessions
                              .filter((s) => s.completed)
                              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                              .slice(0, 10)
                              .map((session) => (
                                <div
                                  key={session.id}
                                  className="flex justify-between items-center p-2 border rounded-md"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {session.type === "work" ? (
                                        <Clock className="h-4 w-4 text-primary" />
                                      ) : session.type === "shortBreak" ? (
                                        <Coffee className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Coffee className="h-4 w-4 text-blue-500" />
                                      )}
                                      <span className="font-medium">
                                        {session.type === "work"
                                          ? "Focus"
                                          : session.type === "shortBreak"
                                            ? "Short Break"
                                            : "Long Break"}
                                      </span>
                                    </div>
                                    {session.taskId && (
                                      <p className="text-sm text-muted-foreground ml-6">
                                        {tasks.find((t) => t.id === session.taskId)?.text || "Unknown task"}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm">
                                      {Math.floor(session.duration / 60)}:
                                      {(session.duration % 60).toString().padStart(2, "0")} min
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(session.startTime).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Add Task Dialog */}
          <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new task to focus on during your Pomodoro sessions</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="task-name" className="text-sm font-medium">
                    Task Name
                  </label>
                  <Input
                    id="task-name"
                    placeholder="What do you want to work on?"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="estimated-pomodoros" className="text-sm font-medium">
                    Estimated Pomodoros
                  </label>
                  <Select
                    value={newTaskEstimatedPomodoros.toString()}
                    onValueChange={(value) => setNewTaskEstimatedPomodoros(Number.parseInt(value))}
                  >
                    <SelectTrigger id="estimated-pomodoros">
                      <SelectValue placeholder="Select number of pomodoros" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "pomodoro" : "pomodoros"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask} disabled={!newTaskText.trim()}>
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Roadmap Task Dialog */}
          <Dialog open={showRoadmapTaskDialog} onOpenChange={setShowRoadmapTaskDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task from Roadmap</DialogTitle>
                <DialogDescription>Select a goal from your roadmaps to add as a task</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="roadmap" className="text-sm font-medium">
                    Select Roadmap
                  </label>
                  <Select value={selectedRoadmapId || ""} onValueChange={setSelectedRoadmapId}>
                    <SelectTrigger id="roadmap">
                      <SelectValue placeholder="Select a roadmap" />
                    </SelectTrigger>
                    <SelectContent>
                      {roadmaps.map((roadmap) => (
                        <SelectItem key={roadmap.id} value={roadmap.id}>
                          {roadmap.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRoadmapId && (
                  <div className="space-y-2">
                    <label htmlFor="goal" className="text-sm font-medium">
                      Select Goal
                    </label>
                    <Select value={selectedGoalId || ""} onValueChange={setSelectedGoalId}>
                      <SelectTrigger id="goal">
                        <SelectValue placeholder="Select a goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableGoals().map((goal) => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {goal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRoadmapTaskDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRoadmapTask} disabled={!selectedRoadmapId || !selectedGoalId}>
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </LazyLoad>
      </div>
    </AuthCheck>
  )
}
