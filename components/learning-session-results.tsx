"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RotateCcw, Trophy, Brain, CheckCircle, XCircle, Sparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface LearningSessionResultsProps {
  title: string
  results: {
    correct: number
    total: number
    timeTaken: number
    mistakes?: Array<{
      question: string
      userAnswer: string
      correctAnswer: string
      explanation?: string
    }>
  }
  onReset: () => void
  onReturn: () => void
  onExplainWithAI?: (questionIndex: number) => void
}

export function LearningSessionResults({
  title,
  results,
  onReset,
  onReturn,
  onExplainWithAI,
}: LearningSessionResultsProps) {
  const percentage = Math.round((results.correct / results.total) * 100) || 0
  const minutes = Math.floor(results.timeTaken / 60)
  const seconds = results.timeTaken % 60
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null)

  let message = ""
  let messageIcon = null

  if (percentage >= 90) {
    message = "Excellent! You've mastered this content!"
    messageIcon = <Trophy className="h-5 w-5 text-yellow-500" />
  } else if (percentage >= 70) {
    message = "Great job! You're doing well!"
    messageIcon = <CheckCircle className="h-5 w-5 text-green-500" />
  } else if (percentage >= 50) {
    message = "Good effort! Keep practicing to improve."
    messageIcon = <Brain className="h-5 w-5 text-blue-500" />
  } else {
    message = "You need more practice. Try again to improve your score."
    messageIcon = <RotateCcw className="h-5 w-5 text-orange-500" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <CardTitle>{title} Results</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-6 bg-muted/30 rounded-lg">
          <div className="text-5xl font-bold mb-2">
            {results.correct} / {results.total}
          </div>
          <p className="text-muted-foreground">
            Completed in {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Score</span>
            <span
              className={percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600"}
            >
              {percentage}%
            </span>
          </div>
          <Progress
            value={percentage}
            className={percentage >= 70 ? "bg-green-100" : percentage >= 50 ? "bg-yellow-100" : "bg-red-100"}
          />
        </div>

        <div className="flex items-center gap-2 p-4 rounded-md bg-muted/50">
          {messageIcon}
          <p>{message}</p>
        </div>

        {results.mistakes && results.mistakes.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Areas to Improve
            </h3>
            <Accordion type="single" collapsible>
              {results.mistakes.map((mistake, index) => (
                <AccordionItem key={index} value={`mistake-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium">Question {index + 1}:</span>
                      <span className="text-sm ml-2 text-muted-foreground line-clamp-1">{mistake.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <div>
                        <span className="text-sm font-medium">Your answer:</span>
                        <span className="text-sm ml-2 text-red-500">{mistake.userAnswer}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Correct answer:</span>
                        <span className="text-sm ml-2 text-green-500">{mistake.correctAnswer}</span>
                      </div>
                      {mistake.explanation && (
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <p className="text-sm">{mistake.explanation}</p>
                        </div>
                      )}
                      {onExplainWithAI && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => onExplainWithAI(index)}
                        >
                          <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                          Explain with AI
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onReturn} className="flex-1 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Return
        </Button>
        <Button onClick={onReset} className="flex-1 gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  )
}
