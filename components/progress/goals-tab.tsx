"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Plus, Trash2 } from "lucide-react"
import type { LearningGoal } from "@/contexts/progress-context"

interface GoalsTabContentProps {
  goals: LearningGoal[]
  deleteGoal: (id: string) => void
  formatDate: (dateString?: string) => string
  onAddGoal: () => void
}

export function GoalsTabContent({ goals, deleteGoal, formatDate, onAddGoal }: GoalsTabContentProps) {
  return (
    <div className="space-y-6">
      {goals.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground mb-4">You haven't set any learning goals yet.</p>
            <Button onClick={onAddGoal}>
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
  )
} 