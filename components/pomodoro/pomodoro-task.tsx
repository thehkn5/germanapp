"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, Edit, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react"

export interface PomodoroSubtask {
  id: string
  text: string
  completed: boolean
}

export interface PomodoroTask {
  id: string
  text: string
  completed: boolean
  estimatedPomodoros: number
  completedPomodoros: number
  subtasks: PomodoroSubtask[]
  notes?: string
  roadmapGoalId?: string
}

interface PomodoroTaskProps {
  task: PomodoroTask
  onUpdate: (task: PomodoroTask) => void
  onDelete: (taskId: string) => void
  onSelect: (taskId: string) => void
  isSelected: boolean
}

export function PomodoroTask({ task, onUpdate, onDelete, onSelect, isSelected }: PomodoroTaskProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")

  // Toggle task completion
  const toggleCompletion = () => {
    onUpdate({
      ...task,
      completed: !task.completed,
    })
  }

  // Save edited task
  const saveEdit = () => {
    if (editText.trim()) {
      onUpdate({
        ...task,
        text: editText,
      })
      setIsEditing(false)
    }
  }

  // Add subtask
  const addSubtask = () => {
    if (newSubtask.trim()) {
      onUpdate({
        ...task,
        subtasks: [
          ...task.subtasks,
          {
            id: Date.now().toString(),
            text: newSubtask,
            completed: false,
          },
        ],
      })
      setNewSubtask("")
    }
  }

  // Toggle subtask completion
  const toggleSubtaskCompletion = (subtaskId: string) => {
    onUpdate({
      ...task,
      subtasks: task.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
      ),
    })
  }

  // Delete subtask
  const deleteSubtask = (subtaskId: string) => {
    onUpdate({
      ...task,
      subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
    })
  }

  // Increment estimated pomodoros
  const incrementEstimatedPomodoros = () => {
    onUpdate({
      ...task,
      estimatedPomodoros: task.estimatedPomodoros + 1,
    })
  }

  // Decrement estimated pomodoros
  const decrementEstimatedPomodoros = () => {
    if (task.estimatedPomodoros > 1) {
      onUpdate({
        ...task,
        estimatedPomodoros: task.estimatedPomodoros - 1,
      })
    }
  }

  return (
    <div className={`border rounded-md p-4 ${isSelected ? "border-primary" : ""}`}>
      <div className="flex items-start gap-3">
        <Checkbox checked={task.completed} onCheckedChange={toggleCompletion} className="mt-1" />
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2 mb-2">
              <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1" autoFocus />
              <Button size="sm" onClick={saveEdit}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-start justify-between mb-2">
              <div
                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                onClick={() => onSelect(task.id)}
              >
                {task.text}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={decrementEstimatedPomodoros}>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <div className="flex items-center gap-1 min-w-[60px] justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {task.completedPomodoros}/{task.estimatedPomodoros}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={incrementEstimatedPomodoros}>
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div className="mt-2">
              <Button variant="ghost" size="sm" className="px-0 h-6" onClick={() => setShowSubtasks(!showSubtasks)}>
                {showSubtasks ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                Subtasks ({task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length})
              </Button>

              {showSubtasks && (
                <div className="ml-6 mt-2 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtaskCompletion(subtask.id)}
                        className="h-4 w-4"
                      />
                      <span className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                        {subtask.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-red-500"
                        onClick={() => deleteSubtask(subtask.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add subtask */}
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="Add subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSubtask()
                }
              }}
            />
            <Button size="sm" variant="outline" onClick={addSubtask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Roadmap link */}
          {task.roadmapGoalId && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                From Roadmap
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
