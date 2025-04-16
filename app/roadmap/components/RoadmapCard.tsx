import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, MapPin } from "lucide-react"
import { type Roadmap } from "../page"

interface RoadmapCardProps {
  roadmap: Roadmap
  onClick: () => void
}

export default function RoadmapCard({ roadmap, onClick }: RoadmapCardProps) {
  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return (
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
        </Badge>
      )
    } else if (progress > 0) {
      return (
        <Badge variant="secondary">
          In Progress
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline">
          Not Started
        </Badge>
      )
    }
  }

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{roadmap.title}</CardTitle>
          {getStatusBadge(roadmap.progress)}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2 h-10 mb-4">
          {roadmap.description || "No description provided"}
        </p>
        
        <div className="space-y-1 mb-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{roadmap.progress}%</span>
          </div>
          <Progress value={roadmap.progress} className="h-2" />
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-4">
          <MapPin className="h-4 w-4" />
          <span>{roadmap.stepsCount} {roadmap.stepsCount === 1 ? 'step' : 'steps'}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 text-xs text-muted-foreground border-t bg-muted/30 px-6 py-2">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Last updated {format(roadmap.lastModified, 'MMM d, yyyy')}</span>
        </div>
      </CardFooter>
    </Card>
  )
} 