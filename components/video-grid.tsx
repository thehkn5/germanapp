import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface VideoGridProps {
  videos: any[]
}

export function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No videos found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="aspect-video relative bg-muted">
            <img
              src={video.thumbnail || `/placeholder.svg?height=200&width=350&text=${encodeURIComponent(video.title)}`}
              alt={video.title}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="font-medium line-clamp-2">{video.title}</h3>
              <Badge variant="outline">{video.level}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
            <Badge variant="secondary">{video.topic}</Badge>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <a href={`/videos/${video.id}`} className="w-full">
              <Button variant="default" className="w-full">
                Watch & Learn
              </Button>
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
