"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { roadmapService, Roadmap } from "@/lib/roadmap-service"
import { PlusIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function RoadmapsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    if (user) {
      fetchRoadmaps()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchRoadmaps = async () => {
    try {
      setLoading(true)
      if (!user) return
      
      const roadmapsData = await roadmapService.getUserRoadmaps(user.uid)
      setRoadmaps(roadmapsData)
    } catch (error) {
      toast({
        title: "Error loading roadmaps",
        description: "There was an error loading your roadmaps. Please try again.",
        variant: "destructive",
      })
      console.error("Error fetching roadmaps:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (roadmap: Roadmap): number => {
    if (!roadmap.steps || roadmap.steps.length === 0) return 0
    
    const completedSteps = roadmap.steps.filter(step => step.status === "done").length
    return Math.round((completedSteps / roadmap.steps.length) * 100)
  }

  const handleCreateRoadmap = () => {
    router.push("/roadmap/create")
  }

  const handleRoadmapClick = (roadmap: Roadmap) => {
    router.push(`/roadmap/${roadmap.id}`)
  }

  const getActiveRoadmaps = () => {
    return roadmaps.filter(roadmap => {
      const progress = calculateProgress(roadmap)
      return progress < 100 && progress > 0
    })
  }

  const renderRoadmapCard = (roadmap: Roadmap) => {
    const progress = calculateProgress(roadmap)
    const stepsCount = roadmap.steps.length
    const completedSteps = roadmap.steps.filter(step => step.status === "done").length
    
    return (
      <Card 
        key={roadmap.id} 
        className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group"
        onClick={() => handleRoadmapClick(roadmap)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {roadmap.title}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {roadmap.description || "No description provided"}
              </CardDescription>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {roadmap.tags && roadmap.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {roadmap.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
          <span>{completedSteps} of {stepsCount} steps completed</span>
          <span>
            {new Date(roadmap.lastModified).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric'
            })}
          </span>
        </CardFooter>
      </Card>
    )
  }

  const renderSkeletonCards = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="hover:border-primary/50 transition-all">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex gap-1.5 mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </CardFooter>
      </Card>
    ))
  }
  
  // Handle not logged in state
  if (!loading && !user) {
    return (
      <div className="container max-w-5xl py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Learning Roadmaps</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view and create your German learning roadmaps.
          </p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Learning Roadmaps</h1>
        <Button onClick={handleCreateRoadmap}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Roadmap
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-8">
          <TabsTrigger value="active">Active Roadmaps</TabsTrigger>
          <TabsTrigger value="all">All Roadmaps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {renderSkeletonCards()}
            </div>
          ) : getActiveRoadmaps().length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {getActiveRoadmaps().map(renderRoadmapCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You don't have any active roadmaps yet.
              </p>
              <Button onClick={handleCreateRoadmap} variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First Roadmap
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {renderSkeletonCards()}
            </div>
          ) : roadmaps.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {roadmaps.map(renderRoadmapCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't created any roadmaps yet.
              </p>
              <Button onClick={handleCreateRoadmap} variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First Roadmap
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 