"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, FileText, Video, Headphones, Users, Filter, Globe } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomList } from "@/types/vocabulary"
import { getAllLists } from "@/lib/vocabulary-utils"

// Resource type definition
type ResourceType = "vocabulary" | "video" | "audio" | "article" | "course" | "all"

export default function CommunityPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [resourceType, setResourceType] = useState<ResourceType>(
    (searchParams.get("type") as ResourceType) || "all"
  )
  const [publicLists, setPublicLists] = useState<CustomList[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load public lists from local storage
  useEffect(() => {
    setIsLoading(true)
    // Get all lists and filter for public ones
    const allLists = getAllLists()
    const publicLists = allLists.filter(list => list.isPublic === true)
    setPublicLists(publicLists)
    setIsLoading(false)
    
    // If there's a filter param, use it
    const typeParam = searchParams.get("type") as ResourceType
    if (typeParam) {
      setResourceType(typeParam)
    }
  }, [searchParams])

  // Filter lists based on search query
  const filteredLists = publicLists.filter(
    list => 
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (list.description && list.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Community Resources</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and share learning resources created by the community. Browse public vocabulary lists, 
          videos, articles, and more to enhance your German learning experience.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Resource type filter */}
      <div className="mb-8">
        <Tabs defaultValue={resourceType} onValueChange={(value) => setResourceType(value as ResourceType)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Browse Resources</h2>
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="vocabulary" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Vocabulary
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-1">
                <Headphones className="h-4 w-4" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="article" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="course" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Courses
              </TabsTrigger>
            </TabsList>
          </div>

          {/* All resources */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLists.length > 0 && (
                <>
                  {filteredLists.map((list) => (
                    <VocabularyListCard key={list.id} list={list} />
                  ))}
                </>
              )}
              
              {/* Placeholder for when we have more resource types */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                  <CardDescription>More community resources are on the way!</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We're working on adding more types of community resources. Stay tuned for videos, audio lessons, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {filteredLists.length === 0 && searchQuery === "" && resourceType === "all" && (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No community resources yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your vocabulary lists with the community!
                </p>
                <Link href="/vocabulary">
                  <Button>Create a List</Button>
                </Link>
              </div>
            )}
            
            {filteredLists.length === 0 && searchQuery !== "" && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any resources matching "{searchQuery}".
                </p>
              </div>
            )}
          </TabsContent>

          {/* Vocabulary lists */}
          <TabsContent value="vocabulary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <VocabularyListCard key={list.id} list={list} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  {searchQuery === "" ? (
                    <>
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No public vocabulary lists yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Share your vocabulary lists with the community by making them public.
                      </p>
                      <Link href="/vocabulary">
                        <Button>Create a List</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-medium mb-2">No results found</h3>
                      <p className="text-muted-foreground">
                        We couldn't find any vocabulary lists matching "{searchQuery}".
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Placeholder tabs for future resource types */}
          {["video", "audio", "article", "course"].map((type) => (
            <TabsContent key={type} value={type}>
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  We're working on adding {type} resources to the community.
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

// Vocabulary List Card Component
function VocabularyListCard({ list }: { list: CustomList }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="mr-2">{list.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            <Globe className="h-3 w-3 mr-1" />
            Public
          </Badge>
        </div>
        <CardDescription>
          {list.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Badge variant="outline">{list.words.length} words</Badge>
      </CardContent>
      <CardFooter>
        <Link href={`/vocabulary/custom/${list.id}`} className="w-full">
          <Button variant="outline" className="w-full gap-2">
            <BookOpen className="h-4 w-4" />
            View List
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 