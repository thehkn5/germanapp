"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { ArrowLeft, Calendar, Clock, Flag, PlusCircle, Trash2, Edit, FileText, MapPin } from "lucide-react"
import { format } from "date-fns"
import AddStepDialog from "../components/AddStepDialog"
import RoadmapStepsList from "../components/RoadmapStepsList"
import RoadmapJourneyMap from "../components/RoadmapJourneyMap"
import EditRoadmapDialog from "../components/EditRoadmapDialog"
import { roadmapService, RoadmapStep, Roadmap } from "@/lib/roadmap-service"

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddStepOpen, setIsAddStepOpen] = useState(false)
  const [isEditRoadmapOpen, setIsEditRoadmapOpen] = useState(false)
  const [isDeletingRoadmap, setIsDeletingRoadmap] = useState(false)

  // Fetch roadmap data
  useEffect(() => {
    if (!user) return

    const fetchRoadmap = async () => {
      try {
        setLoading(true)
        console.log("Fetching roadmap:", params.id, "for user:", user.uid)
        
        const roadmapData = await roadmapService.getRoadmap(params.id, user.uid)
        
        if (!roadmapData) {
          setError("Roadmap not found")
          setLoading(false)
          return
        }

        setRoadmap(roadmapData)
      } catch (error) {
        console.error("Error fetching roadmap:", error)
        setError("Failed to fetch roadmap data. You may not have permission to access this roadmap.")
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmap()
  }, [user, params.id])

  // Calculate roadmap progress
  const calculateProgress = () => {
    if (!roadmap?.steps.length) return 0
    const completedSteps = roadmap.steps.filter(step => step.status === "done").length
    return Math.round((completedSteps / roadmap.steps.length) * 100)
  }

  // Handle adding a new step
  const handleAddStep = async (newStep: Omit<RoadmapStep, "id" | "createdAt">) => {
    if (!user || !roadmap) return

    try {
      // Create a temporary local ID for optimistic UI update
      const tempStepId = crypto.randomUUID()
      
      // Update local state first for immediate UI update
      setRoadmap(prev => {
        if (!prev) return prev
        return {
          ...prev,
          steps: [...prev.steps, {
            ...newStep,
            id: tempStepId,
            createdAt: new Date(),
          }],
          lastModified: new Date(),
        }
      })

      // Add the step using the service
      const stepId = await roadmapService.addStep(
        roadmap.id,
        user.uid,
        newStep
      )

      // Update the local state with the actual ID from the server
      setRoadmap(prev => {
        if (!prev) return prev
        return {
          ...prev,
          steps: prev.steps.map(step => 
            step.id === tempStepId 
              ? { ...step, id: stepId } 
              : step
          ),
        }
      })

      toast.success("Step added successfully")
      setIsAddStepOpen(false)
    } catch (error) {
      console.error("Error adding step:", error)
      toast.error("Failed to add step")
    }
  }

  // Handle updating a step's status
  const handleUpdateStepStatus = async (stepId: string, newStatus: RoadmapStep["status"]) => {
    if (!user || !roadmap) return

    try {
      // Update local state first
      setRoadmap(prev => {
        if (!prev) return prev
        return {
          ...prev,
          steps: prev.steps.map(step => 
            step.id === stepId ? { ...step, status: newStatus } : step
          ),
          lastModified: new Date(),
        }
      })

      // Update the step using the service
      await roadmapService.updateStep(
        roadmap.id,
        user.uid,
        stepId,
        { status: newStatus }
      )

      toast.success("Step updated successfully")
    } catch (error) {
      console.error("Error updating step:", error)
      toast.error("Failed to update step")
    }
  }

  // Handle updating the roadmap details
  const handleUpdateRoadmap = async (title: string, description: string) => {
    if (!user || !roadmap) return

    try {
      // Update local state
      setRoadmap(prev => {
        if (!prev) return prev
        return {
          ...prev,
          title,
          description,
          lastModified: new Date(),
        }
      })

      // Update the roadmap using the service
      await roadmapService.updateRoadmap(
        roadmap.id,
        user.uid,
        { 
          title, 
          description 
        }
      )

      toast.success("Roadmap updated successfully")
      setIsEditRoadmapOpen(false)
    } catch (error) {
      console.error("Error updating roadmap:", error)
      toast.error("Failed to update roadmap")
    }
  }

  // Handle deleting the roadmap
  const handleDeleteRoadmap = async () => {
    if (!user || !roadmap) return

    try {
      setIsDeletingRoadmap(true)
      
      // Delete the roadmap using the service
      await roadmapService.deleteRoadmap(roadmap.id, user.uid)
      
      toast.success("Roadmap deleted successfully")
      router.push("/roadmap")
    } catch (error) {
      console.error("Error deleting roadmap:", error)
      toast.error("Failed to delete roadmap")
      setIsDeletingRoadmap(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="container py-8 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>{error || "Failed to load roadmap"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/roadmap">Back to Roadmaps</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/roadmap" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to roadmaps
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{roadmap.title}</h1>
            <p className="text-muted-foreground mt-1">{roadmap.description}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddStepOpen(true)}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Step
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditRoadmapOpen(true)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this roadmap and all its steps. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteRoadmap}
                    disabled={isDeletingRoadmap}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeletingRoadmap ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-2xl font-bold">{calculateProgress()}%</div>
                </div>
                <Badge variant={calculateProgress() === 100 ? "default" : "outline"}>
                  {calculateProgress() === 100 ? "Completed" : "In Progress"}
                </Badge>
              </div>
              <Progress value={calculateProgress()} className="h-2 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created {format(roadmap.createdAt, "PP")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>Last updated {format(roadmap.lastModified, "PP")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{roadmap.steps.length} steps</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="journey" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="journey">Journey Map</TabsTrigger>
          <TabsTrigger value="list">Steps List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journey" className="space-y-6">
          {roadmap.steps.length > 0 ? (
            <RoadmapJourneyMap 
              steps={roadmap.steps} 
              onStatusChange={handleUpdateStepStatus} 
            />
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-xl font-medium">No steps added yet</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Start building your learning roadmap by adding steps and milestones
              </p>
              <Button onClick={() => setIsAddStepOpen(true)} className="mt-6 gap-2">
                <PlusCircle className="h-4 w-4" />
                Add your first step
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="space-y-6">
          {roadmap.steps.length > 0 ? (
            <RoadmapStepsList 
              steps={roadmap.steps} 
              onStatusChange={handleUpdateStepStatus} 
            />
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-xl font-medium">No steps added yet</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Start building your learning roadmap by adding steps and milestones
              </p>
              <Button onClick={() => setIsAddStepOpen(true)} className="mt-6 gap-2">
                <PlusCircle className="h-4 w-4" />
                Add your first step
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Step Dialog */}
      <AddStepDialog 
        open={isAddStepOpen} 
        onOpenChange={setIsAddStepOpen}
        onAddStep={handleAddStep}
      />
      
      {/* Edit Roadmap Dialog */}
      <EditRoadmapDialog
        open={isEditRoadmapOpen}
        onOpenChange={setIsEditRoadmapOpen}
        roadmap={roadmap}
        onUpdateRoadmap={handleUpdateRoadmap}
      />
    </div>
  )
} 