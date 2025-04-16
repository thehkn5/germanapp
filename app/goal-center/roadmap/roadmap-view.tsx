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
import { PlusCircle, Clock, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { roadmapService, Roadmap } from "@/lib/roadmap-service"

export default function RoadmapView() {
  const { user } = useAuth()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "lastModified" | "progress">("lastModified")
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  // Fetch roadmaps
  useEffect(() => {
    const fetchRoadmaps = async () => {
      if (!user) return
      try {
        setLoading(true)
        const data = await roadmapService.getUserRoadmaps(user.uid)
        setRoadmaps(data)
        
        if (data.length > 0 && !selectedRoadmap) {
          setSelectedRoadmap(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmaps()
  }, [user])

  // Filter and sort roadmaps
  const filteredRoadmaps = roadmaps
    .filter(roadmap => 
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "progress") {
        const progressA = calculateProgress(a)
        const progressB = calculateProgress(b)
        return progressB - progressA
      } else {
        return b.lastModified.getTime() - a.lastModified.getTime()
      }
    })

  // Calculate progress for a roadmap
  const calculateProgress = (roadmap: Roadmap) => {
    if (!roadmap.steps.length) return 0
    const completedSteps = roadmap.steps.filter(step => step.status === "done").length
    return Math.round((completedSteps / roadmap.steps.length) * 100)
  }

  // Handle card navigation
  const goToNextCard = () => {
    if (filteredRoadmaps.length <= 1) return
    
    const newIndex = (focusedCardIndex + 1) % filteredRoadmaps.length
    setFocusedCardIndex(newIndex)
    setSelectedRoadmap(filteredRoadmaps[newIndex].id)

    if (cardsContainerRef.current) {
      const cardWidth = cardsContainerRef.current.offsetWidth / 1.5
      cardsContainerRef.current.scrollTo({
        left: newIndex * cardWidth - cardWidth / 2,
        behavior: 'smooth'
      })
    }
  }

  const goToPrevCard = () => {
    if (filteredRoadmaps.length <= 1) return
    
    const newIndex = (focusedCardIndex - 1 + filteredRoadmaps.length) % filteredRoadmaps.length
    setFocusedCardIndex(newIndex)
    setSelectedRoadmap(filteredRoadmaps[newIndex].id)
    
    if (cardsContainerRef.current) {
      const cardWidth = cardsContainerRef.current.offsetWidth / 1.5
      cardsContainerRef.current.scrollTo({
        left: newIndex * cardWidth - cardWidth / 2,
        behavior: 'smooth'
      })
    }
  }

  // Navigate to full roadmap view
  const viewRoadmapDetails = (roadmapId: string) => {
    router.push(`/roadmap/${roadmapId}`)
  }

  // Add intersection observer to automatically highlight cards when they come into view
  useEffect(() => {
    // Skip if no roadmaps
    if (filteredRoadmaps.length === 0 || !cardsContainerRef.current) return;

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
          setSelectedRoadmap(filteredRoadmaps[cardIndex].id);
        }
      });
    }, options);

    // Observe all cards
    const cards = cardsContainerRef.current.querySelectorAll('.roadmap-card');
    cards.forEach(card => {
      observer.observe(card);
    });

    return () => {
      cards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, [filteredRoadmaps, focusedCardIndex, cardsContainerRef.current]);

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

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="mt-4 text-xl font-medium">No roadmaps found</h3>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Create your first roadmap to start planning your learning journey
        </p>
        <Button 
          onClick={() => router.push("/roadmap/create")} 
          className="mt-6 gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Roadmap
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border rounded-lg">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search roadmaps..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-[200px] space-y-2">
              <Label htmlFor="sort-by">Sort by</Label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "title" | "lastModified" | "progress")}
              >
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastModified">Last updated</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={() => router.push("/roadmap/create")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Roadmap Cards */}
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          onClick={goToPrevCard}
          disabled={filteredRoadmaps.length <= 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div 
          ref={cardsContainerRef}
          className="flex overflow-x-auto gap-4 px-12 py-6 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredRoadmaps.map((roadmap, index) => {
            const progress = calculateProgress(roadmap)
            const isFocused = index === focusedCardIndex
            
            return (
              <div 
                key={roadmap.id}
                data-index={index}
                className={`
                  roadmap-card
                  min-w-[85%] md:min-w-[500px] snap-center
                  transition-all duration-300 cursor-pointer
                  hover:shadow-md
                  transform 
                  ${isFocused ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-80 translate-y-2'}
                `}
                onClick={() => {
                  setFocusedCardIndex(index)
                  setSelectedRoadmap(roadmap.id)
                }}
              >
                <Card className={`
                  h-full overflow-hidden
                  transition-all duration-300
                  ${isFocused ? 'border-primary/50 shadow-lg' : 'border-border'}
                `}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{roadmap.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {roadmap.description || "No description provided"}
                        </CardDescription>
                      </div>
                      <Badge variant={progress === 100 ? "default" : "outline"}>
                        {progress === 100 ? "Completed" : `${progress}%`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className={`h-2 mt-2 ${isFocused ? 'animate-pulse' : ''}`} />
                    
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Steps</div>
                          <div className="text-xl font-semibold">{roadmap.steps.length}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Completed</div>
                          <div className="text-xl font-semibold">
                            {roadmap.steps.filter(step => step.status === "done").length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Recent Activity</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Updated {format(roadmap.lastModified, "PP")}</span>
                        </div>
                        
                        {/* Step Types */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {Array.from(new Set(roadmap.steps.map(step => step.type))).map(type => (
                            <Badge key={type} variant="secondary" className="capitalize">
                              {type.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button 
                      className="w-full transition-all hover:bg-primary/90 hover:translate-y-[-1px]"
                      onClick={(e) => {
                        e.stopPropagation()
                        viewRoadmapDetails(roadmap.id)
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
          disabled={filteredRoadmaps.length <= 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Dot Indicator */}
      {filteredRoadmaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {filteredRoadmaps.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`w-3 h-3 rounded-full p-0 ${index === focusedCardIndex ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => {
                setFocusedCardIndex(index)
                setSelectedRoadmap(filteredRoadmaps[index].id)
                
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
    </div>
  )
} 