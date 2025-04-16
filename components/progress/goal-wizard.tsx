"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Book, 
  BookOpen,
  CalendarIcon, 
  Check, 
  GraduationCap, 
  ListTodo, 
  MessageSquare, 
  Plus, 
  Target, 
  Book as BookIcon, 
  ListChecks,
  Award,
  Clock,
  Trash
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useProgress } from "@/contexts/progress-context"

// Define types for goal properties 
type GoalCategory = "general" | "vocabulary" | "grammar" | "speaking" | "listening" | "reading"

// Templates for different goal types
const goalTemplates = {
  cefr: [
    { name: "Reach A1 Level", description: "Basic phrases, simple interactions", duration: 90, category: "general" as GoalCategory },
    { name: "Reach A2 Level", description: "Everyday expressions, immediate needs", duration: 180, category: "general" as GoalCategory },
    { name: "Reach B1 Level", description: "Main points on familiar topics, experiences", duration: 270, category: "general" as GoalCategory },
    { name: "Reach B2 Level", description: "Complex text, technical discussion", duration: 365, category: "general" as GoalCategory }
  ],
  vocabulary: [
    { name: "Learn 500 words", description: "Core German vocabulary", duration: 60, category: "vocabulary" as GoalCategory },
    { name: "Master food vocabulary", description: "Words for ordering, cooking, ingredients", duration: 30, category: "vocabulary" as GoalCategory },
    { name: "Learn travel phrases", description: "Transportation, hotels, directions", duration: 45, category: "vocabulary" as GoalCategory },
    { name: "Business German", description: "Professional workplace vocabulary", duration: 90, category: "vocabulary" as GoalCategory }
  ],
  grammar: [
    { name: "Master cases", description: "Nominative, accusative, dative, genitive", duration: 60, category: "grammar" as GoalCategory },
    { name: "Perfect tense", description: "Past tense formation and usage", duration: 30, category: "grammar" as GoalCategory },
    { name: "Verb conjugation", description: "Present tense for regular/irregular verbs", duration: 45, category: "grammar" as GoalCategory },
    { name: "Sentence structure", description: "Word order in different sentence types", duration: 30, category: "grammar" as GoalCategory }
  ],
  conversation: [
    { name: "Basic conversations", description: "Simple exchanges, greetings, small talk", duration: 45, category: "speaking" as GoalCategory },
    { name: "Order in a restaurant", description: "Food, preferences, paying", duration: 30, category: "speaking" as GoalCategory },
    { name: "Ask for directions", description: "Navigate, understand responses", duration: 30, category: "speaking" as GoalCategory },
    { name: "Discuss current events", description: "Express opinions, understand news", duration: 90, category: "speaking" as GoalCategory }
  ],
  listening: [
    { name: "Understand slow speech", description: "Clear, slow conversations", duration: 60, category: "listening" as GoalCategory },
    { name: "Follow TV shows", description: "Main points of TV programs", duration: 90, category: "listening" as GoalCategory },
    { name: "Comprehend native speakers", description: "Natural conversations at normal speed", duration: 120, category: "listening" as GoalCategory }
  ],
  reading: [
    { name: "Read simple texts", description: "Signs, menus, short messages", duration: 30, category: "reading" as GoalCategory },
    { name: "Read news articles", description: "Current events, general topics", duration: 60, category: "reading" as GoalCategory },
    { name: "Read literature", description: "Short stories, simplified novels", duration: 90, category: "reading" as GoalCategory }
  ]
}

// Icons for goal types
const goalTypeIcons = {
  cefr: <GraduationCap className="h-5 w-5" />,
  vocabulary: <BookOpen className="h-5 w-5" />,
  grammar: <Book className="h-5 w-5" />,
  conversation: <MessageSquare className="h-5 w-5" />,
  listening: <BookIcon className="h-5 w-5" />,
  reading: <BookIcon className="h-5 w-5" />
}

// Suggested milestones for different goal types
const suggestedMilestones = {
  cefr: [
    "Complete basic vocabulary",
    "Master present tense verbs",
    "Understand simple dialogues",
    "Hold a basic conversation",
    "Pass a practice test"
  ],
  vocabulary: [
    "Learn first 100 words",
    "Create flashcards",
    "Practice with example sentences",
    "Use in conversations",
    "Review and test"
  ],
  grammar: [
    "Learn the rules",
    "Complete practice exercises",
    "Identify in texts",
    "Use in writing",
    "Apply in conversations"
  ],
  conversation: [
    "Learn key phrases",
    "Practice pronunciation",
    "Rehearse dialogues",
    "Record yourself speaking",
    "Have a conversation with a native speaker"
  ],
  listening: [
    "Listen to slow recordings",
    "Transcribe short clips",
    "Watch videos with subtitles",
    "Watch without subtitles",
    "Listen to podcasts"
  ],
  reading: [
    "Start with labeled images",
    "Read short paragraphs",
    "Read articles with a dictionary",
    "Summarize what you've read",
    "Read without translation"
  ]
}

interface GoalWizardProps {
  onComplete: () => void
  onCancel: () => void
}

export function GoalWizard({ onComplete, onCancel }: GoalWizardProps) {
  const router = useRouter()
  const { addGoal } = useProgress()
  
  // Wizard state
  const [step, setStep] = useState(1)
  const [goalType, setGoalType] = useState<keyof typeof goalTemplates>("cefr")
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customGoal, setCustomGoal] = useState(false)
  
  // Goal details
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<GoalCategory>("general")
  const [duration, setDuration] = useState(30) // days
  const [deadline, setDeadline] = useState<Date>()
  
  // Milestone tracking
  const [milestones, setMilestones] = useState<string[]>([])
  const [newMilestone, setNewMilestone] = useState("")
  
  // Difficulty and importance
  const [difficulty, setDifficulty] = useState(2) // 1-5
  const [importance, setImportance] = useState(3) // 1-5
  
  // Apply template selection
  const handleTemplateSelect = (index: number) => {
    const template = goalTemplates[goalType][index]
    setSelectedTemplate(index)
    setName(template.name)
    setDescription(template.description)
    setCategory(template.category)
    setDuration(template.duration)
    setCustomGoal(false)
    
    // Set suggested milestones
    setMilestones(suggestedMilestones[goalType].slice(0, 3))
  }
  
  // Reset to custom goal
  const handleCustomGoal = () => {
    setSelectedTemplate(null)
    setName("")
    setDescription("")
    setCategory("general")
    setDuration(30)
    setCustomGoal(true)
    setMilestones([])
  }
  
  // Add milestone
  const addMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([...milestones, newMilestone.trim()])
      setNewMilestone("")
    }
  }
  
  // Remove milestone
  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }
  
  // Create the goal
  const handleCreateGoal = () => {
    // Calculate target value based on difficulty and duration
    const target = Math.round((difficulty * duration) / 7) * 5 // ~5 units per difficulty level per week
    
    const goal = {
      name,
      description,
      category,
      target,
      unit: "sessions" as const,
      deadline: deadline?.toISOString(),
      milestones,
      difficulty,
      importance
    }
    
    addGoal(goal)
    onComplete()
  }
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Create Learning Goal</h2>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-8 h-2 rounded-full ${
                s === step 
                  ? "bg-primary" 
                  : s < step 
                    ? "bg-primary/60" 
                    : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Step 1: Select goal type */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What type of goal do you want to set?</CardTitle>
              <CardDescription>
                Choose the area you want to focus on for your German learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={goalType} onValueChange={(value) => setGoalType(value as keyof typeof goalTemplates)}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="cefr">CEFR Level</TabsTrigger>
                  <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                  <TabsTrigger value="grammar">Grammar</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="conversation">Conversation</TabsTrigger>
                  <TabsTrigger value="listening">Listening</TabsTrigger>
                  <TabsTrigger value="reading">Reading</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Choose a template or create custom goal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {goalTemplates[goalType].map((template, index) => (
                      <Card 
                        key={index}
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          selectedTemplate === index ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => handleTemplateSelect(index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-primary/10 p-2 rounded-full">
                              {goalTypeIcons[goalType]}
                            </div>
                            <div>
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-muted-foreground">{template.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  ~{template.duration} days
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card 
                    className={`cursor-pointer hover:border-primary transition-colors ${
                      customGoal ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={handleCustomGoal}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Plus className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Create Custom Goal</h4>
                          <p className="text-sm text-muted-foreground">
                            Define your own specific learning goal
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedTemplate && !customGoal}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Step 2: Configure goal details */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Define Your Goal</CardTitle>
              <CardDescription>
                Customize the details of your learning goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Master German cases"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you want to achieve?"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-category">Category</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as GoalCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Target Completion Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Difficulty Level</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[difficulty]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(values) => setDifficulty(values[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center bg-primary/10 rounded-md py-1 font-medium">
                      {difficulty}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Easy</span>
                    <span>Medium</span>
                    <span>Hard</span>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Importance</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[importance]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(values) => setImportance(values[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center bg-primary/10 rounded-md py-1 font-medium">
                      {importance}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Estimated Duration</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[duration]}
                      min={7}
                      max={365}
                      step={7}
                      onValueChange={(values) => setDuration(values[0])}
                      className="flex-1"
                    />
                    <span className="w-20 text-center bg-primary/10 rounded-md py-1 font-medium">
                      {duration} days
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 week</span>
                    <span>6 months</span>
                    <span>1 year</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!name}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Step 3: Milestones */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Milestones</CardTitle>
              <CardDescription>
                Break down your goal into achievable milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <Input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Add a milestone"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                />
                <Button variant="outline" onClick={addMilestone}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {milestones.length === 0 ? (
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <ListChecks className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-medium mb-1">No milestones yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Add milestones to track your progress
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {milestones.map((milestone, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between border bg-card rounded-md p-3 gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            {index + 1}
                          </div>
                          <span>{milestone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeMilestone(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {milestones.length === 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Suggested Milestones</h3>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0"
                      onClick={() => setMilestones(suggestedMilestones[goalType])}
                    >
                      Add All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {suggestedMilestones[goalType].map((milestone, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between border bg-card/50 rounded-md p-3 gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 opacity-70">
                            {index + 1}
                          </div>
                          <span className="text-muted-foreground">{milestone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => setMilestones([...milestones, milestone])}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleCreateGoal}>
                Create Goal
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
} 