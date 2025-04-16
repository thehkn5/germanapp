"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageSquare, GraduationCap, RefreshCw, Flag, Check, Clock, ArrowRight } from "lucide-react"
import type { RoadmapStep } from "../[id]/page"

// Helper to get step type icon
const getStepTypeIcon = (type: RoadmapStep['type']) => {
  switch (type) {
    case 'vocabulary':
      return <BookOpen className="h-5 w-5" />
    case 'grammar':
      return <GraduationCap className="h-5 w-5" />
    case 'speaking':
      return <MessageSquare className="h-5 w-5" />
    case 'review':
      return <RefreshCw className="h-5 w-5" />
    case 'milestone':
      return <Flag className="h-5 w-5" />
    default:
      return <BookOpen className="h-5 w-5" />
  }
}

// Helper to get step status class
const getStepStatusClass = (status: RoadmapStep['status']) => {
  switch (status) {
    case 'not_started':
      return 'border-dashed'
    case 'in_progress':
      return 'border-primary bg-primary/5'
    case 'done':
      return 'border-green-500 bg-green-500/10'
    default:
      return 'border-dashed'
  }
}

interface RoadmapJourneyMapProps {
  steps: RoadmapStep[]
  onStatusChange: (stepId: string, status: RoadmapStep['status']) => void
}

export default function RoadmapJourneyMap({ steps, onStatusChange }: RoadmapJourneyMapProps) {
  return (
    <div className="p-6 bg-muted/30 rounded-lg space-y-8">
      <div className="relative">
        {/* Main journey line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border z-0" />
        
        {/* Steps */}
        <div className="space-y-10 relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-6">
              {/* Step circle indicator */}
              <div 
                className={`h-16 w-16 rounded-full border-2 flex items-center justify-center shrink-0
                ${getStepStatusClass(step.status)}`}
              >
                {getStepTypeIcon(step.type)}
              </div>
              
              {/* Step content */}
              <Card className="flex-1">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{step.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant={
                        step.priority === 'high' ? 'destructive' : 
                        step.priority === 'medium' ? 'secondary' : 
                        'outline'
                      }>
                        {step.priority} priority
                      </Badge>
                      
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {step.estimatedTime} {step.estimatedTime === 1 ? 'hour' : 'hours'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="capitalize">
                      {step.type}
                    </Badge>
                    
                    {step.status === 'not_started' && (
                      <Button 
                        size="sm" 
                        onClick={() => onStatusChange(step.id, 'in_progress')}
                        className="gap-1"
                      >
                        Start <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {step.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onStatusChange(step.id, 'done')}
                        className="gap-1"
                      >
                        <Check className="h-3 w-3" /> Mark Complete
                      </Button>
                    )}
                    
                    {step.status === 'done' && (
                      <Badge variant="default" className="bg-green-500/10 text-green-500">
                        <Check className="mr-1 h-3 w-3" /> Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 