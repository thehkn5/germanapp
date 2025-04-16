"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Form schema
const roadmapFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters."
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters."
  }).optional(),
})

type RoadmapFormValues = z.infer<typeof roadmapFormSchema>

// Roadmap interface
interface RoadmapData {
  id: string
  title: string
  description: string
  [key: string]: any
}

interface EditRoadmapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roadmap: RoadmapData
  onUpdateRoadmap: (title: string, description: string) => void
}

export default function EditRoadmapDialog({
  open,
  onOpenChange,
  roadmap,
  onUpdateRoadmap,
}: EditRoadmapDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form
  const form = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapFormSchema),
    defaultValues: {
      title: roadmap?.title || "",
      description: roadmap?.description || "",
    },
  })
  
  // Update form when roadmap changes
  useEffect(() => {
    if (roadmap) {
      form.reset({
        title: roadmap.title,
        description: roadmap.description || "",
      })
    }
  }, [roadmap, form])
  
  // Handle form submission
  const onSubmit = async (values: RoadmapFormValues) => {
    setIsSubmitting(true)
    try {
      await onUpdateRoadmap(values.title, values.description || "")
      // Dialog will be closed by the parent component
    } catch (error) {
      console.error("Error updating roadmap:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Roadmap</DialogTitle>
          <DialogDescription>
            Update your roadmap details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My German Learning Path" {...field} />
                  </FormControl>
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
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 