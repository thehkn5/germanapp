"use client"

import { Clock, GraduationCap, BookOpen, MessageSquare, RefreshCw, Flag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { RoadmapStep } from "../[id]/page"

// Helper function to get icon based on step type
const getStepIcon = (type: RoadmapStep["type"]) => {
  switch (type) {
    case "vocabulary":
      return <BookOpen className="h-4 w-4" />
    case "grammar":
      return <GraduationCap className="h-4 w-4" />
    case "speaking":
      return <MessageSquare className="h-4 w-4" />
    case "review":
      return <RefreshCw className="h-4 w-4" />
    case "milestone":
      return <Flag className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

// Helper function to get status text and style
const getStatusBadge = (status: RoadmapStep["status"]) => {
  switch (status) {
    case "not_started":
      return <Badge variant="outline">Not Started</Badge>
    case "in_progress":
      return <Badge variant="secondary">In Progress</Badge>
    case "done":
      return <Badge variant="default">Completed</Badge>
    default:
      return <Badge variant="outline">Not Started</Badge>
  }
}

interface RoadmapStepsListProps {
  steps: RoadmapStep[]
  onStatusChange: (stepId: string, status: RoadmapStep["status"]) => void
}

export default function RoadmapStepsList({ steps, onStatusChange }: RoadmapStepsListProps) {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Card key={step.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStepIcon(step.type)}
                  <span>{step.title}</span>
                </CardTitle>
                <CardDescription className="mt-1">{step.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {step.estimatedTime} {step.estimatedTime === 1 ? "hour" : "hours"}
                  </Badge>
                </div>
                {getStatusBadge(step.status)}
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardFooter className="pt-4 flex justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={step.priority === "high" ? "destructive" : step.priority === "medium" ? "secondary" : "outline"}>
                {step.priority === "high" ? "High Priority" : step.priority === "medium" ? "Medium Priority" : "Low Priority"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {step.type}
              </Badge>
            </div>
            <Select
              defaultValue={step.status}
              onValueChange={(value) => onStatusChange(step.id, value as RoadmapStep["status"])}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 