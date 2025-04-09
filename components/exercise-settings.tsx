"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Play, Brain } from "lucide-react"

type VideoType = "Vocabulary" | "Grammar" | "Reading" | "Writing" | "Listening" | "Speaking" | "Integrated"

type ExerciseType = {
  id: string
  label: string
  description?: string
  skill: VideoType
}

const exerciseTypesBySkill: Record<VideoType, ExerciseType[]> = {
  Vocabulary: [
    { id: "fill-blanks", label: "Fill in the blanks" },
    { id: "matching", label: "Matching" },
    { id: "multiple-choice", label: "Multiple choice" },
    { id: "true-false", label: "True or false" },
    { id: "word-search", label: "Word search" },
    { id: "crossword", label: "Crossword puzzles" },
    { id: "definitions", label: "Definitions" },
    { id: "synonyms-antonyms", label: "Synonyms/Antonyms" },
    { id: "sentence-completion", label: "Sentence completion" },
    { id: "word-usage", label: "Using new words in sentences" },
    { id: "word-formation", label: "Word formation" },
    { id: "translation-word", label: "Translation (word level)" },
  ],
  Grammar: [
    { id: "fill-blanks", label: "Fill in the blanks" },
    { id: "sentence-transform", label: "Sentence transformation" },
    { id: "combine-sentences", label: "Combining sentences" },
    { id: "separate-sentences", label: "Separating sentences" },
    { id: "identify-errors", label: "Identifying grammatical errors" },
    { id: "correct-errors", label: "Correcting grammatical errors" },
    { id: "word-order", label: "Ordering words to form sentences" },
    { id: "conjugation", label: "Conjugation/Declension practice" },
    { id: "rewrite-grammar", label: "Rewriting with specific structures" },
    { id: "match-halves", label: "Matching sentence halves" },
  ],
  Reading: [
    { id: "multiple-choice", label: "Multiple choice questions" },
    { id: "true-false", label: "True or false statements" },
    { id: "open-ended", label: "Answering open-ended questions" },
    { id: "summarize", label: "Summarizing the text" },
    { id: "main-idea", label: "Identifying the main idea" },
    { id: "specific-info", label: "Identifying specific information" },
    { id: "inference", label: "Inferencing" },
    { id: "match-headings", label: "Matching headings to paragraphs" },
    { id: "order-paragraphs", label: "Ordering paragraphs" },
    { id: "gap-fill-text", label: "Gap-fill exercises (text-based)" },
  ],
  Writing: [
    { id: "sentence-writing", label: "Sentence writing" },
    { id: "paragraph-writing", label: "Paragraph writing" },
    { id: "essay-writing", label: "Essay writing" },
    { id: "letter-writing", label: "Letter/Email writing" },
    { id: "dialogue-writing", label: "Dialogue writing" },
    { id: "descriptive-writing", label: "Descriptive writing" },
    { id: "narrative-writing", label: "Narrative writing" },
    { id: "list-creation", label: "Creating lists" },
    { id: "form-filling", label: "Filling out forms" },
    { id: "translation-text", label: "Translation (text level)" },
  ],
  Listening: [
    { id: "multiple-choice", label: "Multiple choice questions" },
    { id: "true-false", label: "True or false statements" },
    { id: "fill-transcript", label: "Filling in missing information" },
    { id: "order-events", label: "Ordering events" },
    { id: "open-ended", label: "Answering open-ended questions" },
    { id: "summarize-audio", label: "Summarizing the audio" },
    { id: "note-taking", label: "Note-taking" },
    { id: "gap-fill-audio", label: "Gap-fill exercises (audio-based)" },
  ],
  Speaking: [
    { id: "role-play", label: "Role-playing" },
    { id: "discussions", label: "Discussions" },
    { id: "interviews", label: "Interviews" },
    { id: "presentations", label: "Presentations" },
    { id: "storytelling", label: "Storytelling" },
    { id: "describe-pictures", label: "Describing pictures" },
    { id: "compare-contrast", label: "Comparing and contrasting" },
    { id: "give-instructions", label: "Giving instructions" },
  ],
  Integrated: [
    { id: "dictation", label: "Dictation" },
    { id: "translation", label: "Translation" },
    { id: "gap-fill-mixed", label: "Gap-fill exercises (mixed)" },
    { id: "response-writing", label: "Writing responses" },
  ],
}

interface ExerciseSettingsProps {
  title: string
  description?: string
  videoType: VideoType
  onStart: (settings: {
    exerciseTypes: string[]
    numberOfQuestions: number
    difficulty: "easy" | "medium" | "hard"
    duration: number
    feedbackTiming: "immediate" | "delayed" | "end"
    showExplanations: boolean
  }) => void
}

export function ExerciseSettings({
  title,
  description,
  videoType,
  onStart,
}: ExerciseSettingsProps) {
  const [selectedSkills, setSelectedSkills] = useState<VideoType[]>([videoType, "Integrated"])
  const [selectedExerciseTypes, setSelectedExerciseTypes] = useState<string[]>([])
  const [numberOfQuestions, setNumberOfQuestions] = useState(10)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [duration, setDuration] = useState(15 * 60) // 15 minutes in seconds
  const [feedbackTiming, setFeedbackTiming] = useState<"immediate" | "delayed" | "end">("immediate")
  const [showExplanations, setShowExplanations] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")

  // Only show video type and integrated exercises
  const availableSkills = [videoType, "Integrated"]
  
  // Filter exercise types based on selected skills
  const availableExerciseTypes = selectedSkills.flatMap(skill => exerciseTypesBySkill[skill])

  const handleSkillToggle = (skill: VideoType) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill))
      // Remove exercise types that belong to this skill
      setSelectedExerciseTypes(selectedExerciseTypes.filter(typeId => {
        return !exerciseTypesBySkill[skill].some(ex => ex.id === typeId)
      }))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleExerciseTypeToggle = (exerciseId: string) => {
    setSelectedExerciseTypes((current) =>
      current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId]
    )
  }

  const handleStart = () => {
    onStart({
      exerciseTypes: selectedExerciseTypes,
      numberOfQuestions,
      difficulty,
      duration,
      feedbackTiming,
      showExplanations,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="exercises">Exercise Types</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <div className="space-y-2">
                  <Slider
                    id="numberOfQuestions"
                    min={5}
                    max={50}
                    step={5}
                    value={[numberOfQuestions]}
                    onValueChange={(value) => setNumberOfQuestions(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5</span>
                    <span>15</span>
                    <span>30</span>
                    <span>50</span>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-sm">
                    {numberOfQuestions} questions
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
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Select Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(exerciseTypesBySkill).map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill as VideoType) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedSkills.includes(skill as VideoType) ? "" : "hover:bg-accent hover:text-accent-foreground"}`}
                      onClick={() => handleSkillToggle(skill as VideoType)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Select Exercise Types</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {availableExerciseTypes.map((exerciseType) => (
                    <div
                      key={exerciseType.id}
                      className={`flex items-center space-x-2 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground transition-colors ${selectedExerciseTypes.includes(exerciseType.id) ? "border-primary bg-primary/5" : ""}`}
                    >
                      <Checkbox
                        id={exerciseType.id}
                        checked={selectedExerciseTypes.includes(exerciseType.id)}
                        onCheckedChange={() => handleExerciseTypeToggle(exerciseType.id)}
                      />
                      <Label htmlFor={exerciseType.id} className="flex-1 cursor-pointer">
                        {exerciseType.label}
                        {exerciseType.description && (
                          <span className="block text-xs text-muted-foreground">{exerciseType.description}</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedExerciseTypes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Selected Exercise Types ({selectedExerciseTypes.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExerciseTypes.map((typeId) => {
                      const exerciseType = availableExerciseTypes.find(et => et.id === typeId);
                      return exerciseType ? (
                        <Badge key={typeId} variant="secondary" className="flex items-center gap-1">
                          {exerciseType.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6 pt-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Feedback Timing</h3>
                <p className="text-sm text-muted-foreground">Choose when to show feedback during the exercise session</p>
                <RadioGroup
                  id="feedback-timing"
                  defaultValue={feedbackTiming}
                  onValueChange={(value) => setFeedbackTiming(value as "immediate" | "delayed" | "end")}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="immediate" id="feedback-immediate" className="peer sr-only" />
                    <Label
                      htmlFor="feedback-immediate"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-medium">Immediate</span>
                      <span className="text-xs text-muted-foreground">After each question</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="delayed" id="feedback-delayed" className="peer sr-only" />
                    <Label
                      htmlFor="feedback-delayed"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-medium">Delayed</span>
                      <span className="text-xs text-muted-foreground">After each set</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="end" id="feedback-end" className="peer sr-only" />
                    <Label
                      htmlFor="feedback-end"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-medium">End</span>
                      <span className="text-xs text-muted-foreground">After all questions</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-medium">Feedback Content</h3>
                <p className="text-sm text-muted-foreground">Configure what information to include with feedback</p>
                
                <div className="flex items-center space-x-2 p-3 rounded-md border">
                  <Checkbox
                    id="show-explanations"
                    checked={showExplanations}
                    onCheckedChange={(checked) => setShowExplanations(checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="show-explanations" className="font-medium">Show explanations</Label>
                    <p className="text-xs text-muted-foreground">Include detailed explanations with correct answers</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Feedback Preview</h4>
                  <div className="p-3 rounded-md bg-green-50 border border-green-200 mb-2">
                    <p className="text-sm font-medium text-green-700">Correct Answer</p>
                    {showExplanations && (
                      <p className="text-xs text-green-600 mt-1">Explanation: This is the correct form of the verb in present tense.</p>
                    )}
                  </div>
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm font-medium text-red-700">Incorrect Answer</p>
                    <p className="text-xs text-red-600">Your answer: <span className="line-through">falsch</span></p>
                    <p className="text-xs text-green-600">Correct answer: richtig</p>
                    {showExplanations && (
                      <p className="text-xs text-slate-600 mt-1">Explanation: The correct form uses the nominative case.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStart}
          disabled={selectedExerciseTypes.length === 0}
          className="w-full gap-2"
        >
          <Play className="h-4 w-4" />
          Start Exercise Session
        </Button>
      </CardFooter>
    </Card>
  )
}