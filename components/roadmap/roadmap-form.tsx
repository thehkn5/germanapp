"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, Video, Plus, Check, AlertCircle, BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProgress } from "@/contexts/progress-context"

interface RoadmapFormProps {
  videos: any[]
  vocabularyLists: any[]
  onComplete: () => void
  onCancel: () => void
}

export function RoadmapForm({ videos, vocabularyLists, onComplete, onCancel }: RoadmapFormProps) {
  const { roadmaps, addRoadmap } = useProgress()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [roadmapName, setRoadmapName] = useState("")
  const [roadmapDescription, setRoadmapDescription] = useState("")
  const [roadmapCategory, setRoadmapCategory] = useState("general")
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [selectedVocabLists, setSelectedVocabLists] = useState<string[]>([])
  const [weeklyTime, setWeeklyTime] = useState(120) // minutes
  const [primarySkill, setPrimarySkill] = useState("vocabulary")
  const [secondarySkill, setSecondarySkill] = useState("listening")
  const [deadline, setDeadline] = useState<Date>()
  const [customItems, setCustomItems] = useState<Array<{ name: string; url?: string }>>([])
  const [customItemName, setCustomItemName] = useState("")
  const [customItemUrl, setCustomItemUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user already has 3 roadmaps
  const hasMaxRoadmaps = roadmaps.length >= 3

  // Check if user already has a roadmap in this category
  const categoryExists = roadmaps.some((rm) => rm.category === roadmapCategory)

  // Handle video selection
  const toggleVideoSelection = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter((id) => id !== videoId))
    } else {
      setSelectedVideos([...selectedVideos, videoId])
    }
  }

  // Handle vocabulary list selection
  const toggleVocabListSelection = (listId: string) => {
    if (selectedVocabLists.includes(listId)) {
      setSelectedVocabLists(selectedVocabLists.filter((id) => id !== listId))
    } else {
      setSelectedVocabLists([...selectedVocabLists, listId])
    }
  }

  // Add custom item
  const addCustomItem = () => {
    if (!customItemName.trim()) return

    setCustomItems([
      ...customItems,
      {
        name: customItemName,
        url: customItemUrl.trim() || undefined,
      },
    ])

    setCustomItemName("")
    setCustomItemUrl("")
  }

  // Create roadmap
  const createRoadmap = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Validate
      if (!roadmapName.trim()) {
        setError("Please provide a name for your roadmap")
        setIsSubmitting(false)
        return
      }

      if (selectedVideos.length === 0 && customItems.length === 0 && selectedVocabLists.length === 0) {
        setError("Please select at least one video, vocabulary list, or add a custom item")
        setIsSubmitting(false)
        return
      }

      // Create roadmap goals
      const goals = [
        // Add video goals
        ...selectedVideos.map((videoId) => {
          const video = videos.find((v) => v.id === videoId)
          return {
            id: `video-${videoId}-${Date.now()}`,
            name: video?.title || "Watch Video",
            type: "video" as const,
            resourceId: videoId,
            resourceName: video?.title || "Unknown Video",
            completed: false,
            priority: "medium" as const,
          }
        }),

        // Add vocabulary list goals
        ...selectedVocabLists.map((listId) => {
          const list = vocabularyLists.find((l) => l.id === listId)
          return {
            id: `vocab-${listId}-${Date.now()}`,
            name: `Learn ${list?.name || "Vocabulary List"}`,
            type: "vocabulary" as const,
            resourceId: listId,
            resourceName: list?.name || "Unknown List",
            completed: false,
            priority: "medium" as const,
          }
        }),

        // Add custom items
        ...customItems.map((item) => ({
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: item.name,
          type: "custom" as const,
          customUrl: item.url,
          completed: false,
          priority: "medium" as const,
        })),
      ]

      // Create the roadmap
      const newRoadmap = {
        name: roadmapName,
        description: roadmapDescription,
        category: roadmapCategory,
        goals,
        deadline: deadline?.toISOString(),
      }

      await addRoadmap(newRoadmap)

      // Notify parent component
      onComplete()

      // Navigate to goal center
      router.push("/goals")
    } catch (err) {
      console.error("Error creating roadmap:", err)
      setError("An error occurred while creating your roadmap. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      {/* Step indicator */}
      <CardHeader>
        <CardTitle>Create Learning Roadmap</CardTitle>
        <CardDescription>Plan your German learning journey with a personalized roadmap</CardDescription>

        <div className="mt-4">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <span className="text-sm mt-1">Basics</span>
            </div>
            <div className="flex-1 flex items-center mx-2">
              <div className={`h-1 w-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="text-sm mt-1">Content</span>
            </div>
            <div className="flex-1 flex items-center mx-2">
              <div className={`h-1 w-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
              <span className="text-sm mt-1">Review</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roadmap-name">Roadmap Name</Label>
              <Input
                id="roadmap-name"
                placeholder="e.g., German Grammar Mastery"
                value={roadmapName}
                onChange={(e) => setRoadmapName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadmap-description">Description (Optional)</Label>
              <Textarea
                id="roadmap-description"
                placeholder="Describe your learning goals and what you want to achieve with this roadmap"
                value={roadmapDescription}
                onChange={(e) => setRoadmapDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roadmap-category">Category</Label>
              <Select value={roadmapCategory} onValueChange={setRoadmapCategory}>
                <SelectTrigger id="roadmap-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              {hasMaxRoadmaps && categoryExists && (
                <p className="text-sm text-red-500 mt-1">
                  You already have a roadmap in this category. Please choose a different category or edit your existing
                  roadmap.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-skill">Primary Skill Focus</Label>
              <Select value={primarySkill} onValueChange={setPrimarySkill}>
                <SelectTrigger id="primary-skill">
                  <SelectValue placeholder="Select primary skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-skill">Secondary Skill Focus (Optional)</Label>
              <Select value={secondarySkill} onValueChange={setSecondarySkill}>
                <SelectTrigger id="secondary-skill">
                  <SelectValue placeholder="Select secondary skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Weekly Time Commitment: {Math.floor(weeklyTime / 60)} hours {weeklyTime % 60} minutes
              </Label>
              <Slider
                min={30}
                max={600}
                step={30}
                value={[weeklyTime]}
                onValueChange={(value) => setWeeklyTime(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30 min</span>
                <span>5 hours</span>
                <span>10 hours</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Target Completion Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="deadline">
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
        )}

        {/* Step 2: Content Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Select Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`video-${video.id}`}
                      checked={selectedVideos.includes(video.id)}
                      onCheckedChange={() => toggleVideoSelection(video.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`video-${video.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {video.title}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {video.level} • {video.topic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Select Vocabulary Lists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto p-2">
                {vocabularyLists.map((list) => (
                  <div key={list.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`list-${list.id}`}
                      checked={selectedVocabLists.includes(list.id)}
                      onCheckedChange={() => toggleVocabListSelection(list.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`list-${list.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {list.name}
                      </label>
                      <p className="text-sm text-muted-foreground">{list.words?.length || 0} words</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Custom Resources
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Resource name (e.g., German Grammar Article)"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="URL (optional)"
                      value={customItemUrl}
                      onChange={(e) => setCustomItemUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={addCustomItem} disabled={!customItemName.trim()}>
                    Add
                  </Button>
                </div>

                {customItems.length > 0 && (
                  <div className="border rounded-md p-4 space-y-2">
                    <h4 className="text-sm font-medium">Added Custom Resources:</h4>
                    <ul className="space-y-2">
                      {customItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{item.name}</span>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:underline"
                            >
                              (link)
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review and Create */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">{roadmapName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{roadmapDescription || "No description provided"}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Category:</p>
                    <p className="text-sm">{roadmapCategory.charAt(0).toUpperCase() + roadmapCategory.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Primary Skill:</p>
                    <p className="text-sm">{primarySkill.charAt(0).toUpperCase() + primarySkill.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weekly Time:</p>
                    <p className="text-sm">
                      {Math.floor(weeklyTime / 60)} hours {weeklyTime % 60} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Target Completion:</p>
                    <p className="text-sm">{deadline ? format(deadline, "PPP") : "No deadline set"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      Selected Videos ({selectedVideos.length})
                    </h4>
                    {selectedVideos.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {selectedVideos.map((videoId) => {
                          const video = videos.find((v) => v.id === videoId)
                          return (
                            <li key={videoId} className="text-sm">
                              • {video?.title || "Unknown Video"}
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">No videos selected</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Selected Vocabulary Lists ({selectedVocabLists.length})
                    </h4>
                    {selectedVocabLists.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {selectedVocabLists.map((listId) => {
                          const list = vocabularyLists.find((l) => l.id === listId)
                          return (
                            <li key={listId} className="text-sm">
                              • {list?.name || "Unknown List"}
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">No vocabulary lists selected</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" />
                      Custom Resources ({customItems.length})
                    </h4>
                    {customItems.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {customItems.map((item, index) => (
                          <li key={index} className="text-sm">
                            • {item.name} {item.url && <span className="text-blue-500">(has link)</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">No custom resources added</p>
                    )}
                  </div>
                </div>
              </div>

              {hasMaxRoadmaps && categoryExists && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You already have a roadmap in the {roadmapCategory} category. Creating this roadmap will replace
                    your existing roadmap in this category.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {step === 1 ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => setStep(2)} disabled={!roadmapName.trim()}>
              Next Step
            </Button>
          </>
        ) : step === 2 ? (
          <>
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={selectedVideos.length === 0 && customItems.length === 0 && selectedVocabLists.length === 0}
            >
              Next Step
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={createRoadmap} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Roadmap"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
