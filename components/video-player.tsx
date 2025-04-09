"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VideoPlayerProps {
  video: any
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number | null>(null)
  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    // Reset states when video changes
    setLoading(true)
    setError(null)
    setIframeLoaded(false)
    setCurrentTime(0)
    setActiveSubtitleIndex(null)
    setPlayerReady(false)

    // Safety check for video object
    if (!video) {
      setLoading(false)
      setError("Video data not available")
      return
    }

    // Function to safely create and append the iframe
    const loadVideo = () => {
      try {
        if (!containerRef.current) {
          setLoading(false)
          setError("Container reference not available")
          return
        }

        // Clear previous content
        containerRef.current.innerHTML = ""

        // Check if we have a videoId (YouTube)
        if (video.videoId) {
          try {
            // Create a simple div first
            const wrapper = document.createElement("div")
            wrapper.style.position = "absolute"
            wrapper.style.top = "0"
            wrapper.style.left = "0"
            wrapper.style.width = "100%"
            wrapper.style.height = "100%"

            // Create YouTube iframe
            const iframe = document.createElement("iframe")
            iframe.id = "youtube-player"
            iframe.src = `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`
            iframe.title = video.title || "Video"
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            iframe.allowFullscreen = true
            iframe.style.position = "absolute"
            iframe.style.top = "0"
            iframe.style.left = "0"
            iframe.style.width = "100%"
            iframe.style.height = "100%"
            iframe.style.border = "none"

            // Store iframe reference
            iframeRef.current = iframe

            // Add load and error event listeners
            iframe.onload = () => {
              setLoading(false)
              setIframeLoaded(true)

              // Initialize YouTube API
              if (window.YT) {
                initYouTubePlayer()
              } else {
                // Load YouTube API if not already loaded
                const tag = document.createElement("script")
                tag.src = "https://www.youtube.com/iframe_api"
                const firstScriptTag = document.getElementsByTagName("script")[0]
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

                // Define callback for when API is ready
                window.onYouTubeIframeAPIReady = initYouTubePlayer
              }
            }

            iframe.onerror = () => {
              console.error("Failed to load YouTube video")
              setError("Failed to load video. Please try again later.")
              setLoading(false)
            }

            // Append iframe to wrapper, then wrapper to container
            wrapper.appendChild(iframe)
            containerRef.current.appendChild(wrapper)

            // Set a timeout to handle cases where onload doesn't fire
            setTimeout(() => {
              if (!iframeLoaded) {
                setLoading(false)
              }
            }, 5000)
          } catch (err) {
            console.error("Error creating YouTube iframe:", err)
            setError("Error loading YouTube video")
            setLoading(false)
          }
        }
        // Check if we have an embedCode
        else if (video.embedCode) {
          try {
            // Create a temporary div to parse the embed code
            const tempDiv = document.createElement("div")
            tempDiv.innerHTML = video.embedCode

            // Find the iframe in the embed code
            const iframe = tempDiv.querySelector("iframe")
            if (iframe) {
              // Create a wrapper div
              const wrapper = document.createElement("div")
              wrapper.style.position = "absolute"
              wrapper.style.top = "0"
              wrapper.style.left = "0"
              wrapper.style.width = "100%"
              wrapper.style.height = "100%"

              // Style the iframe
              iframe.style.position = "absolute"
              iframe.style.top = "0"
              iframe.style.left = "0"
              iframe.style.width = "100%"
              iframe.style.height = "100%"
              iframe.style.border = "none"

              // Store iframe reference
              iframeRef.current = iframe

              // Add event listeners
              iframe.onload = () => {
                setLoading(false)
                setIframeLoaded(true)
              }
              iframe.onerror = () => {
                setError("Failed to load embedded video")
                setLoading(false)
              }

              // Append iframe to wrapper, then wrapper to container
              wrapper.appendChild(iframe)
              containerRef.current.appendChild(wrapper)

              // Set a timeout to handle cases where onload doesn't fire
              setTimeout(() => {
                if (!iframeLoaded) {
                  setLoading(false)
                }
              }, 5000)
            } else {
              setError("Invalid embed code - no iframe found")
              setLoading(false)
            }
          } catch (err) {
            console.error("Error processing embed code:", err)
            setError("Error processing video embed code")
            setLoading(false)
          }
        } else {
          // No video available
          setLoading(false)
        }
      } catch (err) {
        console.error("Error in VideoPlayer:", err)
        setError("Error loading video: " + (err instanceof Error ? err.message : String(err)))
        setLoading(false)
      }
    }

    // Use a small timeout to ensure DOM is ready
    const timer = setTimeout(loadVideo, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }

      // Clean up YouTube API
      if (window.YT && window.YT.Player) {
        delete window.onYouTubeIframeAPIReady
      }
    }
  }, [video])

  // Initialize YouTube player
  const initYouTubePlayer = () => {
    if (!window.YT || !window.YT.Player || !iframeRef.current) {
      console.error("YouTube API not available")
      return
    }

    try {
      const player = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            setPlayerReady(true)
            console.log("YouTube player ready")
          },
          onStateChange: (event: any) => {
            // Update current time when playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTimeTracking(player)
            } else {
              stopTimeTracking()
            }
          },
        },
      })
    } catch (err) {
      console.error("Error initializing YouTube player:", err)
    }
  }

  // Track video time for subtitle highlighting
  const timeTrackingInterval = useRef<NodeJS.Timeout | null>(null)

  const startTimeTracking = (player: any) => {
    if (timeTrackingInterval.current) {
      clearInterval(timeTrackingInterval.current)
    }

    timeTrackingInterval.current = setInterval(() => {
      try {
        const currentTime = player.getCurrentTime()
        setCurrentTime(currentTime)

        // Find matching subtitle
        if (video.subtitles && video.subtitles.length > 0) {
          const index = findActiveSubtitleIndex(currentTime)
          setActiveSubtitleIndex(index)
        }
      } catch (err) {
        console.error("Error getting current time:", err)
      }
    }, 500)
  }

  const stopTimeTracking = () => {
    if (timeTrackingInterval.current) {
      clearInterval(timeTrackingInterval.current)
      timeTrackingInterval.current = null
    }
  }

  // Find which subtitle should be active based on current time
  const findActiveSubtitleIndex = (currentTime: number) => {
    if (!video.subtitles) return null

    for (let i = 0; i < video.subtitles.length; i++) {
      const subtitle = video.subtitles[i]
      const startSeconds = convertTimeToSeconds(subtitle.startTime)
      const endSeconds = convertTimeToSeconds(subtitle.endTime)

      if (currentTime >= startSeconds && currentTime <= endSeconds) {
        return i
      }
    }

    return null
  }

  // Convert time string (e.g., "1:30") to seconds
  const convertTimeToSeconds = (timeString: string) => {
    const parts = timeString.split(":")
    if (parts.length === 2) {
      return Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1])
    } else if (parts.length === 3) {
      return Number.parseInt(parts[0]) * 3600 + Number.parseInt(parts[1]) * 60 + Number.parseInt(parts[2])
    }
    return 0
  }

  // Handle subtitle click to seek video
  const handleSubtitleClick = (index: number) => {
    setActiveSubtitleIndex(index)

    if (!playerReady || !iframeRef.current || !window.YT) return

    try {
      const subtitle = video.subtitles[index]
      const startSeconds = convertTimeToSeconds(subtitle.startTime)

      // Get player instance and seek to time
      const player = window.YT.get(iframeRef.current.id)
      if (player && typeof player.seekTo === "function") {
        player.seekTo(startSeconds, true)
        player.playVideo()
      }
    } catch (err) {
      console.error("Error seeking to time:", err)
    }
  }

  // Render a fallback if video is null or undefined
  if (!video) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-black relative flex items-center justify-center">
          <div className="text-white text-center p-4">
            <p>Video not available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black relative" ref={containerRef}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
            <div className="text-center p-4">
              <p className="text-red-400 font-medium mb-2">Error loading video</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!video.videoId && !video.embedCode && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center p-4">
              <p>Video placeholder</p>
              <p className="text-sm text-gray-400">No video available</p>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{video.title || "Untitled Video"}</h2>
          <div className="flex gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Level: {video.level || "N/A"}</span>
            <span className="text-sm text-muted-foreground">Topic: {video.topic || "N/A"}</span>
          </div>
          <p className="text-muted-foreground mb-6">{video.description || "No description available."}</p>

          <Tabs defaultValue="subtitles">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
              <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            </TabsList>
            <TabsContent value="subtitles" className="p-2">
              {video.subtitles && video.subtitles.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {video.subtitles.map((subtitle: any, index: number) => (
                    <div
                      key={index}
                      className={`p-2 rounded hover:bg-muted cursor-pointer ${
                        activeSubtitleIndex === index ? "bg-primary/10 border-l-4 border-primary" : ""
                      }`}
                      onClick={() => handleSubtitleClick(index)}
                    >
                      <div className="text-xs text-muted-foreground mb-1">
                        {subtitle.startTime || "0:00"} - {subtitle.endTime || "0:00"}
                      </div>
                      <p>{subtitle.text || ""}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4">
                  No subtitles available for this video. Upload JSON data to add subtitles.
                </p>
              )}
            </TabsContent>
            <TabsContent value="vocabulary" className="p-2">
              {video.vocabulary && video.vocabulary.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">German</TableHead>
                        <TableHead>English</TableHead>
                        <TableHead className="hidden md:table-cell">Example</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {video.vocabulary.map((word: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{word.german}</TableCell>
                          <TableCell>{word.english}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {word.example || "-"}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Volume2 className="h-4 w-4" />
                              <span className="sr-only">Pronounce</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground py-4">
                  No vocabulary available for this video. Upload JSON data to add vocabulary.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
