"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Video, BookOpen, ExternalLink, Edit, Flag, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import type { RoadmapGoal } from "@/contexts/progress-context"

interface RoadmapItemProps {
  goal: RoadmapGoal
  onToggleCompletion: (goal: RoadmapGoal) => void
  onPriorityChange: (goal: RoadmapGoal, priority: "low" | "medium" | "high") => void
  onEditNote: (goal: RoadmapGoal) => void
  onDelete?: (goal: RoadmapGoal) => void
}

export function RoadmapItem({ goal, onToggleCompletion, onPriorityChange, onEditNote, onDelete }: RoadmapItemProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-start gap-3">
        <Checkbox checked={goal.completed} onCheckedChange={() => onToggleCompletion(goal)} className="mt-1" />
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {goal.type === "video" && <Video className="h-4 w-4 text-blue-500" />}
              {goal.type === "vocabulary" && <BookOpen className="h-4 w-4 text-purple-500" />}
              {goal.type === "custom" && <BookOpen className="h-4 w-4 text-purple-500" />}
              <span className={goal.completed ? "line-through text-muted-foreground" : "font-medium"}>{goal.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={goal.priority} onValueChange={(value: any) => onPriorityChange(goal, value)}>
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditNote(goal)}>
                <Edit className="h-4 w-4" />
              </Button>
              {onDelete && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete(goal)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {goal.type === "video" && goal.resourceId && (
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

          {goal.type === "vocabulary" && goal.resourceId && (
            <div className="flex items-center gap-2">
              <Link
                href={`/vocabulary/custom/${goal.resourceId}`}
                className="text-sm text-blue-500 hover:underline flex items-center gap-1"
              >
                <BookOpen className="h-3 w-3" />
                Go to vocabulary list
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
            <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">{goal.notes}</div>
          )}
        </div>
      </div>
    </div>
  )
}
