"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface VideoSubtitlesProps {
  video: any
}

export function VideoSubtitles({ video }: VideoSubtitlesProps) {
  const [activeSubtitle, setActiveSubtitle] = useState<number | null>(null)

  if (!video.subtitles || video.subtitles.length === 0) {
    return (
      <div className="text-center py-4 bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No subtitles available for this video.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {video.subtitles.map((subtitle: any, index: number) => (
        <div
          key={index}
          className={`p-3 rounded-md flex items-start gap-2 transition-colors ${
            activeSubtitle === index ? "bg-primary/10" : "hover:bg-muted"
          }`}
          onClick={() => setActiveSubtitle(index)}
        >
          <Button variant="ghost" size="icon" className="h-6 w-6 mt-0.5 flex-shrink-0">
            <Play className="h-3 w-3" />
            <span className="sr-only">Play from this point</span>
          </Button>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {subtitle.startTime} - {subtitle.endTime}
            </div>
            <p>{subtitle.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
