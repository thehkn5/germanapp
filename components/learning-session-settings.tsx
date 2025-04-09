"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Brain, MessageCircle, Clock } from "lucide-react"
import { useQuiz } from "@/contexts/quiz-context"

interface LearningSessionSettingsProps {
  title: string
  description: string
  onStart: (settings: {
    duration: number
    difficulty: "easy" | "medium" | "hard"
    shuffle: boolean
    focusMode: boolean
    limitQuestions?: number
    feedbackTiming: "immediate" | "delayed" | "end"
    showExplanations: boolean
  }) => void
}

export function LearningSessionSettings({ title, description, onStart }: LearningSessionSettingsProps) {
  const { settings: quizSettings, updateSettings } = useQuiz()
  
  const [duration, setDuration] = useState(quizSettings.duration)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(quizSettings.difficulty)
  const [shuffle, setShuffle] = useState(quizSettings.shuffle)
  const [focusMode, setFocusMode] = useState(quizSettings.focusMode)
  const [limitQuestions, setLimitQuestions] = useState<number | undefined>(quizSettings.limitQuestions)
  const [feedbackTiming, setFeedbackTiming] = useState<"immediate" | "delayed" | "end">(quizSettings.feedbackTiming)
  const [showExplanations, setShowExplanations] = useState(quizSettings.showExplanations)
  const [activeTab, setActiveTab] = useState("basic")

  const handleStart = () => {
    const newSettings = {
      duration,
      difficulty,
      shuffle,
      focusMode,
      limitQuestions,
      feedbackTiming,
      showExplanations,
    }
    
    // Update global quiz settings
    updateSettings(newSettings)
    
    // Start the session with these settings
    onStart(newSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="timer-duration" className="mb-2 block">
                Session Duration
              </Label>
              <div className="space-y-2">
                <Slider
                  id="timer-duration"
                  min={5 * 60}
                  max={60 * 60}
                  step={5 * 60}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>15 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <Badge variant="outline" className="text-sm">
                  {Math.floor(duration / 60)} minutes
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty" className="mb-2 block">
                Difficulty Level
              </Label>
              <RadioGroup
                id="difficulty"
                defaultValue={difficulty}
                onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="easy" id="difficulty-easy" className="peer sr-only" />
                  <Label
                    htmlFor="difficulty-easy"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Brain className="mb-3 h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Easy</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="medium" id="difficulty-medium" className="peer sr-only" />
                  <Label
                    htmlFor="difficulty-medium"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Brain className="mb-3 h-6 w-6 text-yellow-500" />
                    <span className="text-sm font-medium">Medium</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="hard" id="difficulty-hard" className="peer sr-only" />
                  <Label
                    htmlFor="difficulty-hard"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Brain className="mb-3 h-6 w-6 text-red-500" />
                    <span className="text-sm font-medium">Hard</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shuffle">Shuffle Questions</Label>
                <p className="text-sm text-muted-foreground">Randomize the order of questions</p>
              </div>
              <Switch id="shuffle" checked={shuffle} onCheckedChange={setShuffle} />
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="feedback-timing" className="mb-2 block">
                Feedback Timing
              </Label>
              <RadioGroup
                id="feedback-timing"
                value={feedbackTiming}
                onValueChange={(value) => setFeedbackTiming(value as "immediate" | "delayed" | "end")}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="immediate" id="feedback-immediate" className="peer sr-only" />
                  <Label
                    htmlFor="feedback-immediate"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <MessageCircle className="mb-3 h-6 w-6 text-green-500" />
                    <span className="text-sm font-medium">Immediate</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">After each question</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="delayed" id="feedback-delayed" className="peer sr-only" />
                  <Label
                    htmlFor="feedback-delayed"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Clock className="mb-3 h-6 w-6 text-yellow-500" />
                    <span className="text-sm font-medium">Delayed</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">After a few seconds</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="end" id="feedback-end" className="peer sr-only" />
                  <Label
                    htmlFor="feedback-end"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <MessageCircle className="mb-3 h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">At End</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">After completing all</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-explanations">Show Explanations</Label>
                <p className="text-sm text-muted-foreground">Display explanations for correct answers</p>
              </div>
              <Switch id="show-explanations" checked={showExplanations} onCheckedChange={setShowExplanations} />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="focus-mode">Focus Mode</Label>
                <p className="text-sm text-muted-foreground">Hide distractions during the session</p>
              </div>
              <Switch id="focus-mode" checked={focusMode} onCheckedChange={setFocusMode} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit-questions">Limit Number of Questions</Label>
              <Slider
                id="limit-questions"
                min={5}
                max={50}
                step={5}
                value={[limitQuestions || 10]}
                onValueChange={(value) => setLimitQuestions(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5</span>
                <span>15</span>
                <span>30</span>
                <span>50</span>
              </div>
              <div className="text-center mt-2">
                <Badge variant="outline" className="text-sm">
                  {limitQuestions || 10} questions
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStart} className="w-full gap-2">
          <Play className="h-4 w-4" />
          Start {activeTab === "basic" ? "Session" : "with Custom Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}
