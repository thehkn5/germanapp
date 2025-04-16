"use client"

import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Target, Clock, Calendar, ChevronLeft, ChevronRight, Search, BarChart2, X, Check } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

// Mock data for goals - replace with actual service implementation
interface Goal {
  id: string
  title: string
  description: string
  category: "vocabulary" | "grammar" | "speaking" | "listening" | "reading" | "writing" | "general"
  targetDate: Date
  progress: number
  status: "not_started" | "in_progress" | "completed"
  subGoals: {
    id: string
    title: string
    completed: boolean
  }[]
  metrics: {
    timeSpent: number // in minutes
    sessionsCompleted: number
  }
  createdAt: Date
  lastUpdated: Date
}

const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Reach B1 vocabulary level",
    description: "Learn 2000 most common German words",
    category: "vocabulary",
    targetDate: new Date(2025, 7, 15),
    progress: 42,
    status: "in_progress",
    subGoals: [
      { id: "sg1", title: "Complete A1 vocabulary list", completed: true },
      { id: "sg2", title: "Complete A2 vocabulary list", completed: false },
      { id: "sg3", title: "Master verb conjugations", completed: false },
    ],
    metrics: {
      timeSpent: 1845,
      sessionsCompleted: 32
    },
    createdAt: new Date(2024, 2, 10),
    lastUpdated: new Date(2024, 3, 28)
  },
  {
    id: "g2",
    title: "Complete German grammar basics",
    description: "Master case system and verb conjugation",
    category: "grammar",
    targetDate: new Date(2025, 5, 30),
    progress: 65,
    status: "in_progress",
    subGoals: [
      { id: "sg4", title: "Case system", completed: true },
      { id: "sg5", title: "Verb tenses", completed: true },
      { id: "sg6", title: "Adjective endings", completed: false },
    ],
    metrics: {
      timeSpent: 2340,
      sessionsCompleted: 45
    },
    createdAt: new Date(2024, 1, 15),
    lastUpdated: new Date(2024, 3, 25)
  },
  {
    id: "g3",
    title: "Daily conversation practice",
    description: "30 minutes speaking practice each day",
    category: "speaking",
    targetDate: new Date(2025, 4, 1),
    progress: 28,
    status: "in_progress",
    subGoals: [
      { id: "sg7", title: "Find language partner", completed: true },
      { id: "sg8", title: "Complete 30 sessions", completed: false },
      { id: "sg9", title: "Record progress", completed: false },
    ],
    metrics: {
      timeSpent: 980,
      sessionsCompleted: 18
    },
    createdAt: new Date(2024, 2, 20),
    lastUpdated: new Date(2024, 3, 27)
  }
]

export default function GoalsView() {
  const { user } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"title" | "progress" | "targetDate" | "lastUpdated">("lastUpdated")
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [showGoalDetails, setShowGoalDetails] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  // Filter and sort goals
  const filteredGoals = goals
    .filter(goal => 
      (categoryFilter === "all" || goal.category === categoryFilter) && 
      (statusFilter === "all" || goal.status === statusFilter) &&
      (goal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       goal.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "progress") {
        return b.progress - a.progress
      } else if (sortBy === "targetDate") {
        return a.targetDate.getTime() - b.targetDate.getTime()
      } else {
        return b.lastUpdated.getTime() - a.lastUpdated.getTime()
      }
    })

  // Handle card navigation
  const goToNextCard = () => {
    if (filteredGoals.length <= 1) return
    
    const newIndex = (focusedCardIndex + 1) % filteredGoals.length
    setFocusedCardIndex(newIndex)

    if (cardsContainerRef.current) {
      const cardWidth = cardsContainerRef.current.offsetWidth / 1.5
      cardsContainerRef.current.scrollTo({
        left: newIndex * cardWidth - cardWidth / 2,
        behavior: 'smooth'
      })
    }
  }

  const goToPrevCard = () => {
    if (filteredGoals.length <= 1) return
    
    const newIndex = (focusedCardIndex - 1 + filteredGoals.length) % filteredGoals.length
    setFocusedCardIndex(newIndex)
    
    if (cardsContainerRef.current) {
      const cardWidth = cardsContainerRef.current.offsetWidth / 1.5
      cardsContainerRef.current.scrollTo({
        left: newIndex * cardWidth - cardWidth / 2,
        behavior: 'smooth'
      })
    }
  }

  // Navigate to detailed goal view (to be implemented)
  const viewGoalDetails = (goalId: string) => {
    console.log(`View goal details for ${goalId}`)
    // router.push(`/goals/${goalId}`)
  }

  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Calculate days remaining
  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Add intersection observer for auto-highlighting cards when scrolling
  useEffect(() => {
    // Skip if no goals
    if (filteredGoals.length === 0 || !cardsContainerRef.current) return;

    // Set up intersection observer to detect visible cards
    const options = {
      root: cardsContainerRef.current,
      rootMargin: '0px',
      threshold: 0.7 // Card is considered visible when 70% is in view
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Find the index of the card that became visible
        const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
        if (entry.isIntersecting && cardIndex !== focusedCardIndex) {
          setFocusedCardIndex(cardIndex);
        }
      });
    }, options);

    // Observe all cards
    const cards = cardsContainerRef.current.querySelectorAll('.goal-card');
    cards.forEach(card => {
      observer.observe(card);
    });

    return () => {
      cards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, [filteredGoals, focusedCardIndex, cardsContainerRef.current]);

  // Function to open goal details modal
  const openGoalDetails = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowGoalDetails(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center border rounded-lg p-4 bg-muted/30">
          <div className="animate-pulse h-10 bg-muted rounded w-1/3"></div>
          <div className="animate-pulse h-10 bg-muted rounded w-1/4"></div>
        </div>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-pulse space-y-6 w-full max-w-md">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="mt-4 text-xl font-medium">No goals found</h3>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Create your first learning goal to track your progress
        </p>
        <Button 
          onClick={() => console.log("Create new goal")} 
          className="mt-6 gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Goal
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border rounded-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search goals..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-4 justify-between">
              <div className="w-full space-y-2">
                <Label htmlFor="sort-by">Sort by</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastUpdated">Last updated</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="targetDate">Target Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="mt-8" variant="outline" onClick={() => console.log("Create new goal")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Goal Cards */}
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          onClick={goToPrevCard}
          disabled={filteredGoals.length <= 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div 
          ref={cardsContainerRef}
          className="flex overflow-x-auto gap-4 px-12 py-6 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredGoals.map((goal, index) => {
            const isFocused = index === focusedCardIndex
            const daysRemaining = getDaysRemaining(goal.targetDate)
            const isOverdue = daysRemaining < 0
            
            return (
              <div 
                key={goal.id}
                data-index={index}
                className={`
                  goal-card
                  min-w-[85%] md:min-w-[500px] snap-center
                  transition-all duration-300 cursor-pointer
                  hover:shadow-md
                  transform
                  ${isFocused ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-80 translate-y-2'}
                `}
                onClick={() => setFocusedCardIndex(index)}
              >
                <Card className={`
                  h-full overflow-hidden
                  transition-all duration-300
                  ${isFocused ? 'border-primary/50 shadow-lg' : 'border-border'}
                `}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 capitalize" variant="outline">{goal.category}</Badge>
                        <CardTitle className="text-2xl">{goal.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {goal.description}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        goal.status === "completed" ? "default" : 
                        isOverdue ? "destructive" : "outline"
                      }>
                        {goal.status === "completed" ? "Completed" : 
                         goal.status === "not_started" ? "Not Started" : 
                         `${goal.progress}%`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={goal.progress} className={`h-2 mt-2 ${isFocused ? 'animate-pulse' : ''}`} />
                    
                    <Tabs defaultValue="overview" className="mt-6">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="subgoals">Sub-goals</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Time Spent</div>
                            <div className="text-xl font-semibold">{formatTime(goal.metrics.timeSpent)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Sessions</div>
                            <div className="text-xl font-semibold">{goal.metrics.sessionsCompleted}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Target Date</div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(goal.targetDate, "PP")}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Days Remaining</div>
                            <Badge variant={isOverdue ? "destructive" : "outline"}>
                              {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Last Updated</div>
                            <span className="text-sm">{format(goal.lastUpdated, "PP")}</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="subgoals" className="mt-4">
                        <div className="space-y-2">
                          {goal.subGoals.map(subgoal => (
                            <div 
                              key={subgoal.id} 
                              className="flex items-center justify-between border rounded-md p-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${subgoal.completed ? 'bg-primary' : 'bg-muted'}`}></div>
                                <span>{subgoal.title}</span>
                              </div>
                              <Badge variant={subgoal.completed ? "default" : "outline"}>
                                {subgoal.completed ? "Done" : "Pending"}
                              </Badge>
                            </div>
                          ))}
                          
                          {goal.subGoals.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground">
                              No sub-goals defined
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button 
                      className="w-full transition-all hover:bg-primary/90 hover:translate-y-[-1px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoalDetails(goal);
                      }}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )
          })}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          onClick={goToNextCard}
          disabled={filteredGoals.length <= 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Dot Indicator */}
      {filteredGoals.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {filteredGoals.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`w-3 h-3 rounded-full p-0 ${index === focusedCardIndex ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => {
                setFocusedCardIndex(index)
                
                if (cardsContainerRef.current) {
                  const cardWidth = cardsContainerRef.current.offsetWidth / 1.5
                  cardsContainerRef.current.scrollTo({
                    left: index * cardWidth - cardWidth / 2,
                    behavior: 'smooth'
                  })
                }
              }}
            />
          ))}
        </div>
      )}

      {showGoalDetails && selectedGoal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200"
          onClick={() => setShowGoalDetails(false)}
        >
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto bg-background shadow-lg rounded-lg animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2 capitalize">{selectedGoal.category}</Badge>
                  <h2 className="text-2xl font-bold">{selectedGoal.title}</h2>
                  <p className="text-muted-foreground mt-2">{selectedGoal.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowGoalDetails(false)}
                  className="rounded-full hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Progress:</span>
                  <span 
                    className={`font-semibold ${
                      selectedGoal.progress === 100 ? 'text-green-500' : 
                      selectedGoal.progress > 50 ? 'text-amber-500' : 'text-blue-500'
                    }`}
                  >
                    {selectedGoal.progress}%
                  </span>
                </div>
                <Progress value={selectedGoal.progress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Time Spent</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">{formatTime(selectedGoal.metrics.timeSpent)}</div>
                    <div className="text-sm text-muted-foreground">{selectedGoal.metrics.sessionsCompleted} sessions</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-lg font-semibold">{format(selectedGoal.targetDate, "PP")}</div>
                    <div className={`text-sm ${getDaysRemaining(selectedGoal.targetDate) < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {getDaysRemaining(selectedGoal.targetDate) < 0 
                       ? `${Math.abs(getDaysRemaining(selectedGoal.targetDate))} days overdue` 
                       : `${getDaysRemaining(selectedGoal.targetDate)} days left`}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-lg mb-4">Sub-goals</h3>
                <div className="space-y-3">
                  {selectedGoal.subGoals.map(subgoal => (
                    <div 
                      key={subgoal.id} 
                      className={`flex items-center justify-between border rounded-md p-3 transition-all duration-200 ${
                        subgoal.completed ? 'bg-primary/10 border-primary/20' : 'hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          subgoal.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {subgoal.completed && <Check className="h-3 w-3" />}
                        </div>
                        <span className={`${subgoal.completed ? 'line-through opacity-70' : ''}`}>
                          {subgoal.title}
                        </span>
                      </div>
                      <Badge variant={subgoal.completed ? "default" : "outline"}>
                        {subgoal.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                  
                  {selectedGoal.subGoals.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground border rounded-md">
                      No sub-goals defined
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="outline">Edit Goal</Button>
                <Button>Update Progress</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 