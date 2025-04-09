import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface VideoListProps {
  videos: any[]
}

export function VideoList({ videos }: VideoListProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No videos found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div key={video.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-card">
          <div className="sm:w-48 flex-shrink-0">
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              <img
                src={video.thumbnail || `/placeholder.svg?height=120&width=200&text=${encodeURIComponent(video.title)}`}
                alt={video.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <h3 className="font-medium">{video.title}</h3>
              <div className="flex gap-2">
                <Badge variant="outline">{video.level}</Badge>
                <Badge variant="secondary">{video.topic}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
            <a href={`/videos/${video.id}`}>
              <Button variant="default" size="sm">
                Watch & Learn
              </Button>
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
