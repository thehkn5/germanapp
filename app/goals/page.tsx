"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useProgress, type Roadmap, type RoadmapGoal } from "@/contexts/progress-context"
import { AuthCheck } from "@/components/auth-check"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Target, Trophy, BookOpen, Video, Plus, Check, ExternalLink, Edit, Trash2, Flag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function GoalCenterPage() {
  const { user } = useAuth()
  const { roadmaps, updateRoadmap, updateRoadmapGoal, deleteRoadmap } = useProgress()
  const router = useRouter()

  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditNoteDialog, setShowEditNoteDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<RoadmapGoal | null>(null)
  const [goalNote, setGoalNote] = useState("")

  // Handle roadmap selection
  const handleRoadmapSelect = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap)
  }

  // Handle goal completion toggle
  const handleGoalCompletion = (goal: RoadmapGoal) => {
    if (!selectedRoadmap) return

    const updatedGoal = {
      ...goal,
      completed: !goal.completed,
    }

    updateRoadmapGoal(selectedRoadmap.id, updatedGoal)
  }

  // Handle goal priority change
  const handlePriorityChange = (goal: RoadmapGoal, priority: "low" | "medium" | "high") => {
    if (!selectedRoadmap) return

    const updatedGoal = {
      ...goal,
      priority,
    }

    updateRoadmapGoal(selectedRoadmap.id, updatedGoal)
  }

  // Handle goal note edit
  const handleEditNote = (goal: RoadmapGoal) => {
    setSelectedGoal(goal)
    setGoalNote(goal.notes || "")
    setShowEditNoteDialog(true)
  }

  // Save goal note
  const saveGoalNote = () => {
    if (!selectedRoadmap || !selectedGoal) return

    const updatedGoal = {
      ...selectedGoal,
      notes: goalNote,
    }

    updateRoadmapGoal(selectedRoadmap.id, updatedGoal)
    setShowEditNoteDialog(false)
  }

  // Handle roadmap deletion
  const handleDeleteRoadmap = () => {
    if (!selectedRoadmap) return

    deleteRoadmap(selectedRoadmap.id)
    setSelectedRoadmap(null)
    setShowDeleteDialog(false)
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline"
    return format(new Date(dateString), "PPP")
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <AuthCheck>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Goal Center</h1>
            <p className="text-muted-foreground">Track and manage your learning roadmaps and goals</p>
          </div>
          <Link href="/roadmap">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Roadmap
            </Button>
          </Link>
        </div>

        {roadmaps.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Roadmaps Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first learning roadmap to organize your German learning journey
              </p>
              <Link href="/roadmap">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Roadmap
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Roadmap List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Your Roadmaps</h2>

              {roadmaps.map((roadmap) => (
                <Card
                  key={roadmap.id}
                  className={`cursor-pointer hover:border-primary transition-colors ${selectedRoadmap?.id === roadmap.id ? "border-primary" : ""}`}
                  onClick={() => handleRoadmapSelect(roadmap)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{roadmap.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {roadmap.category.charAt(0).toUpperCase() + roadmap.category.slice(1)}
                        </p>
                      </div>
                      <Badge variant={roadmap.completed ? "default" : "outline"}>{roadmap.progress}%</Badge>
                    </div>
                    <Progress value={roadmap.progress} className="mt-4" />

                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="text-muted-foreground">
                        {roadmap.goals.filter((g) => g.completed).length} of {roadmap.goals.length} completed
                      </span>
                      {roadmap.deadline && (
                        <span className="text-muted-foreground">Due: {formatDate(roadmap.deadline)}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Roadmap Details */}
            <div className="lg:col-span-2">
              {selectedRoadmap ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedRoadmap.name}</CardTitle>
                        <CardDescription>
                          Created on {formatDate(selectedRoadmap.created)}
                          {selectedRoadmap.deadline && ` • Due by ${formatDate(selectedRoadmap.deadline)}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => router.push(`/roadmap/edit/${selectedRoadmap.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <p className="text-muted-foreground mb-2">{selectedRoadmap.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{selectedRoadmap.category}</Badge>
                          <Badge variant="secondary">
                            {selectedRoadmap.goals.filter((g) => g.completed).length} of {selectedRoadmap.goals.length}{" "}
                            completed
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Progress</h3>
                          <span className="text-sm font-medium">{selectedRoadmap.progress}%</span>
                        </div>
                        <Progress value={selectedRoadmap.progress} />
                      </div>

                      <Tabs defaultValue="all">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="all">All Tasks</TabsTrigger>
                          <TabsTrigger value="pending">Pending</TabsTrigger>
                          <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4 mt-4">
                          {selectedRoadmap.goals.map((goal) => (
                            <div key={goal.id} className="border rounded-md p-4">
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={goal.completed}
                                  onCheckedChange={() => handleGoalCompletion(goal)}
                                  className="mt-1"
                                />
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      {goal.type === "video" && <Video className="h-4 w-4 text-blue-500" />}
                                      {goal.type === "custom" && <BookOpen className="h-4 w-4 text-purple-500" />}
                                      <span
                                        className={
                                          goal.completed ? "line-through text-muted-foreground" : "font-medium"
                                        }
                                      >
                                        {goal.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Select
                                        value={goal.priority}
                                        onValueChange={(value: any) => handlePriorityChange(goal, value)}
                                      >
                                        <SelectTrigger className="h-8 w-[110px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="low">
                                            <div className="flex items-center">
                                              <Flag className="h-4 w-4 text-green-500 mr-2" />
                                              Low
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="medium">
                                            <div className="flex items-center">
                                              <Flag className="h-4 w-4 text-yellow-500 mr-2" />
                                              Medium
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="high">
                                            <div className="flex items-center">
                                              <Flag className="h-4 w-4 text-red-500 mr-2" />
                                              High
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEditNote(goal)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {goal.type === "video" && (
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={`/videos/${goal.resourceId}`}
                                        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                      >
                                        <Video className="h-3 w-3" />
                                        Go to video
                                      </Link>
                                    </div>
                                  )}

                                  {goal.type === "custom" && goal.customUrl && (
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={goal.customUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        Open resource
                                      </a>
                                    </div>
                                  )}

                                  {goal.notes && (
                                    <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                      {goal.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4 mt-4">
                          {selectedRoadmap.goals.filter((g) => !g.completed).length === 0 ? (
                            <div className="text-center py-6">
                              <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                              <p className="text-muted-foreground">All tasks completed! Great job!</p>
                            </div>
                          ) : (
                            selectedRoadmap.goals
                              .filter((g) => !g.completed)
                              .map((goal) => (
                                <div key={goal.id} className="border rounded-md p-4">
                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      checked={goal.completed}
                                      onCheckedChange={() => handleGoalCompletion(goal)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                          {goal.type === "video" && <Video className="h-4 w-4 text-blue-500" />}
                                          {goal.type === "custom" && <BookOpen className="h-4 w-4 text-purple-500" />}
                                          <span className="font-medium">{goal.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Select
                                            value={goal.priority}
                                            onValueChange={(value: any) => handlePriorityChange(goal, value)}
                                          >
                                            <SelectTrigger className="h-8 w-[110px]">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="low">
                                                <div className="flex items-center">
                                                  <Flag className="h-4 w-4 text-green-500 mr-2" />
                                                  Low
                                                </div>
                                              </SelectItem>
                                              <SelectItem value="medium">
                                                <div className="flex items-center">
                                                  <Flag className="h-4 w-4 text-yellow-500 mr-2" />
                                                  Medium
                                                </div>
                                              </SelectItem>
                                              <SelectItem value="high">
                                                <div className="flex items-center">
                                                  <Flag className="h-4 w-4 text-red-500 mr-2" />
                                                  High
                                                </div>
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleEditNote(goal)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>

                                      {goal.type === "video" && (
                                        <div className="flex items-center gap-2">
                                          <Link
                                            href={`/videos/${goal.resourceId}`}
                                            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                          >
                                            <Video className="h-3 w-3" />
                                            Go to video
                                          </Link>
                                        </div>
                                      )}

                                      {goal.type === "custom" && goal.customUrl && (
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={goal.customUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                          >
                                            <ExternalLink className="h-3 w-3" />
                                            Open resource
                                          </a>
                                        </div>
                                      )}

                                      {goal.notes && (
                                        <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                          {goal.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-4 mt-4">
                          {selectedRoadmap.goals.filter((g) => g.completed).length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-muted-foreground">
                                No completed tasks yet. Start checking off your goals!
                              </p>
                            </div>
                          ) : (
                            selectedRoadmap.goals
                              .filter((g) => g.completed)
                              .map((goal) => (
                                <div key={goal.id} className="border rounded-md p-4 bg-muted/20">
                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      checked={goal.completed}
                                      onCheckedChange={() => handleGoalCompletion(goal)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                          {goal.type === "video" && <Video className="h-4 w-4 text-blue-500" />}
                                          {goal.type === "custom" && <BookOpen className="h-4 w-4 text-purple-500" />}
                                          <span className="line-through text-muted-foreground">{goal.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-green-500">
                                            Completed
                                          </Badge>
                                        </div>
                                      </div>

                                      {goal.notes && (
                                        <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                          {goal.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {selectedRoadmap.completed ? (
                      <div className="w-full text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                          <Trophy className="h-8 w-8 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Roadmap Completed!</h3>
                        <p className="text-muted-foreground">
                          Congratulations on completing this roadmap. You've made great progress in your German learning
                          journey!
                        </p>
                      </div>
                    ) : (
                      <div className="w-full">
                        <p className="text-sm text-muted-foreground text-center">
                          {selectedRoadmap.goals.filter((g) => g.completed).length} of {selectedRoadmap.goals.length}{" "}
                          tasks completed
                        </p>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] border rounded-lg">
                  <div className="text-center p-6">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Roadmap</h3>
                    <p className />
                    <h3 className="text-lg font-medium mb-2">Select a Roadmap</h3>
                    <p className="text-muted-foreground">
                      Select a roadmap from the list to view details and track your progress
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Roadmap Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Roadmap</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this roadmap? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRoadmap}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Note Dialog */}
        <Dialog open={showEditNoteDialog} onOpenChange={setShowEditNoteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Notes</DialogTitle>
              <DialogDescription>Add notes or reminders for this task</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Add your notes here..."
                value={goalNote}
                onChange={(e) => setGoalNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditNoteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveGoalNote}>Save Notes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthCheck>
  )
}
