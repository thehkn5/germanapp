"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Loader2, BookOpen, TargetIcon, CheckCircle2, LightbulbIcon, FileSpreadsheet, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { roadmapService } from "@/lib/roadmap-service"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Validation schema using Zod
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters."
  }).optional(),
  roadmapType: z.enum(["custom", "template"]),
  isPublic: z.boolean().default(false),
});

// Roadmap templates for quicker creation
const roadmapTemplates = [
  {
    id: "beginner-grammar",
    title: "German Grammar Fundamentals",
    description: "Master essential German grammar concepts from A1 to B1 level",
    category: "grammar",
    steps: [
      { title: "Sentence Structure", type: "grammar", priority: "high" },
      { title: "Articles & Cases", type: "grammar", priority: "high" },
      { title: "Present Tense Verbs", type: "grammar", priority: "high" },
      { title: "Past Tense Introduction", type: "grammar", priority: "medium" },
      { title: "Modal Verbs", type: "grammar", priority: "medium" },
    ],
  },
  {
    id: "vocab-builder",
    title: "Vocabulary Builder: 1000 Words",
    description: "Structured approach to learning your first 1000 German words",
    category: "vocabulary",
    steps: [
      { title: "First 100 Common Words", type: "vocabulary", priority: "high" },
      { title: "Food & Cooking", type: "vocabulary", priority: "medium" },
      { title: "Travel & Directions", type: "vocabulary", priority: "medium" },
      { title: "Home & Family", type: "vocabulary", priority: "medium" },
      { title: "Work & Study", type: "vocabulary", priority: "medium" },
    ],
  },
  {
    id: "speaking-practice",
    title: "Speaking Practice: Daily Conversations",
    description: "Improve your spoken German with practical everyday conversation topics",
    category: "speaking",
    steps: [
      { title: "Introductions & Greetings", type: "speaking", priority: "high" },
      { title: "Ordering Food & Drinks", type: "speaking", priority: "high" },
      { title: "Asking for Directions", type: "speaking", priority: "medium" },
      { title: "Shopping Conversations", type: "speaking", priority: "medium" },
      { title: "Making Appointments", type: "speaking", priority: "medium" },
    ],
  },
];

export default function CreateRoadmapPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      toast.error("You must be logged in to create a roadmap")
      router.push("/auth/login")
    }
  }, [user, router])
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      roadmapType: "custom",
      isPublic: false,
    },
  })

  // Watch form fields to update UI
  const roadmapType = form.watch("roadmapType")
  
  // Update form when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = roadmapTemplates.find(t => t.id === selectedTemplate)
      if (template) {
        form.setValue("title", template.title)
        form.setValue("description", template.description)
      }
    }
  }, [selectedTemplate, form])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (step < 2) {
      setStep(step + 1)
      return
    }
    
    if (!user) {
      toast.error("You must be logged in to create a roadmap")
      router.push("/auth/login")
      return
    }
    
    setIsSaving(true)
    
    try {
      let retries = 3
      let roadmapId = ""
      
      while (retries > 0) {
        try {
          console.log("Attempting to create roadmap with user:", user.uid)
          // Use the roadmapService singleton
          roadmapId = await roadmapService.createRoadmap(
            user,
            values.title,
            values.description || ""
          )
          
          // If using a template, we would add the steps here
          if (values.roadmapType === "template" && selectedTemplate) {
            const template = roadmapTemplates.find(t => t.id === selectedTemplate)
            if (template && template.steps.length > 0) {
              // Add template steps to roadmap (simplified - actual implementation would need backend support)
              for (const step of template.steps) {
                await roadmapService.addStep(roadmapId, user.uid, {
                  title: step.title,
                  description: "",
                  type: step.type as any,
                  priority: step.priority as any,
                  estimatedTime: 30, // Default 30 minutes
                  status: "not_started"
                })
              }
            }
          }
          
          break // Success, exit the retry loop
        } catch (err) {
          console.error("Error in create attempt:", err)
          retries--
          if (retries === 0) throw err // Throw if all retries failed
          console.log(`Error creating roadmap, retries left: ${retries}`, err)
          await new Promise(r => setTimeout(r, 1000)) // Wait 1s before retry
        }
      }
      
      console.log("Roadmap created successfully with ID:", roadmapId)
      toast.success("Roadmap created successfully!")
      
      // Give Firestore a moment to complete the write
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to the roadmap details page
      router.push(`/roadmap/${roadmapId}`)
    } catch (error) {
      console.error("Error creating roadmap:", error)
      let errorMessage = "Failed to create roadmap. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("client is offline")) {
          errorMessage = "Firebase emulator connection failed. Please make sure the emulator is running."
        } else if (error.message.includes("permission") || error.message.includes("insufficient")) {
          errorMessage = "Permission denied. You may not have access to create roadmaps."
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const renderProgressBar = () => {
    return (
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center w-full space-x-2">
          <div 
            className={`rounded-full transition-colors flex items-center justify-center w-8 h-8 ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            1
          </div>
          <div className={`h-1 flex-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
          <div 
            className={`rounded-full transition-colors flex items-center justify-center w-8 h-8 ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            2
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/roadmap" className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to roadmaps
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          Design a structured learning path with goals and milestones
        </p>
      </div>
      
      <Card className="animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle>Create Your Roadmap</CardTitle>
          <CardDescription>
            {step === 1 ? "Choose how you want to create your roadmap" : "Enter details for your learning roadmap"}
          </CardDescription>
          {renderProgressBar()}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="roadmapType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>How would you like to create your roadmap?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className={cn(
                              "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all",
                              field.value === "custom" ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                            )}>
                              <RadioGroupItem value="custom" id="custom" />
                              <div className="flex-1 space-y-1">
                                <label htmlFor="custom" className="text-base font-medium leading-none">
                                  <div className="flex items-center">
                                    <FileSpreadsheet className="mr-2 h-5 w-5 text-muted-foreground" />
                                    Custom Roadmap
                                  </div>
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  Create a blank roadmap that you can customize with your own goals and steps
                                </p>
                              </div>
                            </div>

                            <div className={cn(
                              "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all",
                              field.value === "template" ? "border-primary bg-primary/5" : "hover:border-muted-foreground"
                            )}>
                              <RadioGroupItem value="template" id="template" />
                              <div className="flex-1 space-y-1">
                                <label htmlFor="template" className="text-base font-medium leading-none">
                                  <div className="flex items-center">
                                    <LightbulbIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                                    Use a Template
                                  </div>
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  Start with a pre-made roadmap template to save time
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {roadmapType === "template" && (
                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roadmapTemplates.map(template => (
                          <Card 
                            key={template.id}
                            className={cn(
                              "cursor-pointer transform transition-all border hover:shadow hover:-translate-y-1",
                              selectedTemplate === template.id ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground"
                            )}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <CardContent className="p-4">
                              <Badge className="mb-2 capitalize">{template.category}</Badge>
                              <h4 className="font-semibold text-base">{template.title}</h4>
                              <p className="text-muted-foreground text-sm mt-1">{template.description}</p>
                              <div className="mt-3 text-xs text-muted-foreground">
                                {template.steps.length} steps included
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My German Learning Path" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your roadmap a clear and descriptive title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the goals and structure of your learning path..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide more details about your learning objectives and roadmap
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Public Roadmap</FormLabel>
                          <FormDescription>
                            Allow other learners to view and copy your roadmap
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push("/roadmap")}
                  >
                    Cancel
                  </Button>
                )}
                
                <Button 
                  type={step < 2 ? "button" : "submit"} 
                  disabled={isSaving || (step === 1 && roadmapType === "template" && !selectedTemplate)}
                  onClick={step < 2 ? () => form.handleSubmit(onSubmit)() : undefined}
                  className="transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : step < 2 ? (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Roadmap
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 