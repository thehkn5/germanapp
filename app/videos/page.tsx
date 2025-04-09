"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, Filter, LayoutGrid, List, BookOpen } from "lucide-react"
import Link from "next/link"

// Sample video data for development
const sampleVideos = [
  {
    id: "1",
    title: "German Greetings and Introductions",
    description: "Learn the most common German greetings and how to introduce yourself.",
    level: "A1",
    topic: "Vocabulary",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Greetings",
  },
  {
    id: "2",
    title: "Basic German Sentence Structure",
    description: "Understanding the fundamentals of German sentence structure and word order.",
    level: "A1",
    topic: "Grammar",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Grammar",
  },
  {
    id: "3",
    title: "Shopping in Germany",
    description: "Essential vocabulary and phrases for shopping in German-speaking countries.",
    level: "A2",
    topic: "Daily Life",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Shopping%20in%20Germany",
  },
  {
    id: "4",
    title: "German Cases Explained",
    description: "A comprehensive guide to understanding and using German cases correctly.",
    level: "B1",
    topic: "Grammar",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Cases",
  },
  {
    id: "5",
    title: "German Food and Dining",
    description: "Learn vocabulary related to food and how to order in restaurants.",
    level: "A2",
    topic: "Daily Life",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Food",
  },
  {
    id: "6",
    title: "Advanced German Conversation",
    description: "Practice advanced conversation techniques and idiomatic expressions.",
    level: "C1",
    topic: "Vocabulary",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Advanced%20German",
  },
]

export default function VideoLibraryPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [topicFilter, setTopicFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the sample data
        setTimeout(() => {
          setVideos(sampleVideos)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching videos:", error)
        setVideos(sampleVideos) // Fallback to sample data
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Filter videos based on search query and filters
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === "all" || video.level === levelFilter
    const matchesTopic = topicFilter === "all" || video.topic === topicFilter
    return matchesSearch && matchesLevel && matchesTopic
  })

  // Get unique levels and topics for filters
  const levels = ["A1", "A2", "B1", "B2", "C1"]
  const topics = Array.from(new Set(videos.map((video) => video.topic)))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">German Video Library</h1>
          <p className="text-muted-foreground">
            Explore our collection of German learning videos with interactive learning tools
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Toggle filters</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium block mb-2">Level</label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium block mb-2">Topic</label>
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="beginner">Beginner (A1-A2)</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate (B1-B2)</TabsTrigger>
            <TabsTrigger value="advanced">Advanced (C1-C2)</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{/* All videos will be shown by default */}</TabsContent>
          <TabsContent value="beginner">{/* Filtered in the rendering below */}</TabsContent>
          <TabsContent value="intermediate">{/* Filtered in the rendering below */}</TabsContent>
          <TabsContent value="advanced">{/* Filtered in the rendering below */}</TabsContent>
        </Tabs>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground mb-4">No videos found matching your search criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setLevelFilter("all")
                setTopicFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Link href={`/videos/${video.id}`} key={video.id} className="block group">
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="aspect-video relative bg-muted overflow-hidden">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="font-bold">
                        {video.level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{video.topic}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>Learn</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <Link href={`/videos/${video.id}`} key={video.id} className="block group">
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0 bg-muted overflow-hidden">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <Badge variant="secondary" className="font-bold">
                          {video.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{video.topic}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>Learn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
