"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Brain,
  FlaskConical,
  Loader2,
  Play,
  Volume2,
  Timer,
  CheckCircle,
  Globe,
  Lock,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

// Import custom lists functionality
import { getAllLists, updateLocalStorage } from "@/lib/vocabulary-utils"
import { Word, CustomList } from "@/types/vocabulary"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, Check, Plus as PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// Sample video data for development
const sampleVideos = [
  {
    id: "1",
    title: "German Greetings and Introductions",
    description: "Learn the most common German greetings and how to introduce yourself in different situations.",
    level: "A1",
    topic: "Vocabulary",
    videoId: "xpumLsaAWGM",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Greetings",
    subtitles: [
      { startTime: "0:00", endTime: "0:05", text: "Hallo! Wie geht's?" },
      { startTime: "0:06", endTime: "0:10", text: "Ich heiße Max. Wie heißt du?" },
      { startTime: "0:11", endTime: "0:15", text: "Freut mich, dich kennenzulernen." },
      { startTime: "0:16", endTime: "0:20", text: "Guten Morgen! Wie geht es Ihnen?" },
      { startTime: "0:21", endTime: "0:25", text: "Guten Tag! Schön, Sie kennenzulernen." },
    ],
    vocabulary: [
      { german: "Hallo", english: "Hello", example: "Hallo, wie geht's?" },
      { german: "Wie geht's?", english: "How are you? (informal)", example: "Hallo, wie geht's?" },
      {
        german: "Wie geht es Ihnen?",
        english: "How are you? (formal)",
        example: "Guten Tag, wie geht es Ihnen?",
      },
      { german: "Ich heiße", english: "My name is", example: "Ich heiße Anna." },
      { german: "Wie heißt du?", english: "What's your name? (informal)", example: "Wie heißt du?" },
      { german: "Wie heißen Sie?", english: "What's your name? (formal)", example: "Wie heißen Sie?" },
      { german: "Freut mich", english: "Nice to meet you", example: "Freut mich, dich kennenzulernen." },
      { german: "Guten Morgen", english: "Good morning", example: "Guten Morgen! Wie geht es dir?" },
      { german: "Guten Tag", english: "Good day", example: "Guten Tag! Kann ich Ihnen helfen?" },
      { german: "Guten Abend", english: "Good evening", example: "Guten Abend! Schön, Sie zu sehen." },
    ],
    quiz: {
      questions: [
        {
          question: "How do you say 'Hello' in German?",
          options: ["Hallo", "Tschüss", "Danke", "Bitte"],
          answer: 0,
        },
        {
          question: "What does 'Wie geht's?' mean?",
          options: ["What's your name?", "How are you?", "Where are you from?", "How old are you?"],
          answer: 1,
        },
      ],
    },
    exercises: [
      {
        title: "Fill in the blank",
        instruction: "Complete the sentence: '_______ Max. Wie heißt du?'",
        answer: "Ich heiße",
      },
      {
        title: "Translation",
        instruction: "Translate to German: 'Nice to meet you'",
        answer: "Freut mich",
      },
    ],
    flashcards: [
      { front: "Hallo", back: "Hello" },
      { front: "Wie geht's?", back: "How are you? (informal)" },
      { front: "Ich heiße", back: "My name is" },
    ],
  },
  // Add more sample videos as needed
]

export default function VideoDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSubtitle, setActiveSubtitle] = useState<number | null>(null)
  const { toast } = useToast()
  const [customLists, setCustomLists] = useState<CustomList[]>([])
  const [recentlySavedWords, setRecentlySavedWords] = useState<{[key: string]: string[]}>({})
  
  // New list dialog state
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [isNewListPublic, setIsNewListPublic] = useState(false)
  const [wordToAddToNewList, setWordToAddToNewList] = useState<any>(null)

  // Fetch custom lists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lists = getAllLists();
      setCustomLists(lists);
    }
  }, []);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the sample data
        setTimeout(() => {
          const videoId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : String(id)
          const foundVideo = sampleVideos.find((v) => v.id === videoId)

          if (foundVideo) {
            setVideo(foundVideo)
          } else {
            setError("Video not found")
          }

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching video:", error)
        setError("Failed to load video data")
        setLoading(false)
      }
    }

    fetchVideo()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Video not found"}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push("/videos")}>Return to Video Library</Button>
        </div>
      </div>
    )
  }

  // Function to handle saving word to custom list
const handleSaveToCustomList = (word: any, listId: string) => {
    try {
      // Get all lists
      const allLists = getAllLists();
      
      // Find the target list
      const targetListIndex = allLists.findIndex(list => list.id === listId);
      
      if (targetListIndex === -1) {
        toast({
          title: "Error",
          description: "Selected list not found",
          variant: "destructive"
        });
        return;
      }
      
      // Check if word already exists in the list to avoid duplicates
      const targetList = allLists[targetListIndex];
      const wordExists = targetList.words.some(w => 
        w.german.toLowerCase() === word.german.toLowerCase() && 
        w.english.toLowerCase() === word.english.toLowerCase()
      );
      
      if (wordExists) {
        toast({
          title: "Already saved",
          description: `"${word.german}" is already in "${targetList.name}"`,
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
        });
        return;
      }
      
      // Format the word to match the Word interface
      const wordToAdd: Word = {
        id: Date.now().toString(), // Generate a unique ID
        german: word.german,
        english: word.english,
        example: word.example || "",
        category: "Video Vocabulary",
        notes: `From video: ${video.title}`
      };
      
      // Add word to the list
      const updatedList = {...targetList};
      updatedList.words = [...updatedList.words, wordToAdd];
      updatedList.updatedAt = new Date().toISOString();
      
      // Update the list in local storage
      allLists[targetListIndex] = updatedList;
      updateLocalStorage(allLists);
      
      // Update state for UI feedback
      setRecentlySavedWords(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), word.german]
      }));
      
      // Reset the recently saved status after 3 seconds
      setTimeout(() => {
        setRecentlySavedWords(prev => {
          const updated = {...prev};
          if (updated[listId]) {
            updated[listId] = updated[listId].filter(w => w !== word.german);
            if (updated[listId].length === 0) {
              delete updated[listId];
            }
          }
          return updated;
        });
      }, 3000);
      
      // Show success toast
      toast({
        title: "Word saved",
        description: `"${word.german}" added to "${targetList.name}"`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      // Update lists in state
      setCustomLists(allLists);
      
    } catch (error) {
      console.error("Error saving word:", error);
      toast({
        title: "Error",
        description: "Failed to save word to list",
        variant: "destructive"
      });
    }
  }

  // Function to open new list dialog
  const openNewListDialog = (word: any) => {
    setWordToAddToNewList(word);
    setNewListName(`Video: ${video.title}`);
    setNewListDescription(`Vocabulary from ${video.title}`);
    setIsNewListPublic(false);
    setIsNewListDialogOpen(true);
  }

  // Function to create a new list and add word to it
  const handleCreateListAndAddWord = () => {
    if (!wordToAddToNewList || !newListName.trim()) return;
    
    try {
      // Get all lists
      const allLists = getAllLists();
      
      // Generate a unique ID for the new list
      const newListId = `list_${Date.now()}`;
      
      // Format the word to match the Word interface
      const wordToAdd: Word = {
        id: Date.now().toString(), // Generate a unique ID
        german: wordToAddToNewList.german,
        english: wordToAddToNewList.english,
        example: wordToAddToNewList.example || "",
        category: "Video Vocabulary",
        notes: `From video: ${video.title}`
      };
      
      // Create new list - explicitly set isPublic based on user choice
      const newList: CustomList = {
        id: newListId,
        name: newListName.trim(),
        description: newListDescription.trim(),
        words: [wordToAdd],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: isNewListPublic === true // Ensure private by default
      };
      
      // Add new list to all lists
      const updatedLists = [...allLists, newList];
      updateLocalStorage(updatedLists);
      
      // Update state for UI feedback
      setRecentlySavedWords(prev => ({
        ...prev,
        [newListId]: [wordToAddToNewList.german]
      }));
      
      // Reset the recently saved status after 3 seconds
      setTimeout(() => {
        setRecentlySavedWords(prev => {
          const updated = {...prev};
          if (updated[newListId]) {
            delete updated[newListId];
          }
          return updated;
        });
      }, 3000);
      
      // Show success toast
      toast({
        title: "New list created",
        description: `"${wordToAddToNewList.german}" added to new list "${newList.name}" (${isNewListPublic ? 'Public' : 'Private'})`,
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
      
      // Update lists in state
      setCustomLists(updatedLists);
      
      // Close dialog and reset state
      setIsNewListDialogOpen(false);
      setWordToAddToNewList(null);
      setNewListName("");
      setNewListDescription("");
      
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        title: "Error",
        description: "Failed to create new list",
        variant: "destructive"
      });
    }
}

return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/videos")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Video Library
          </Button>
        </div>

        {/* Video title and info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary" className="font-bold">
              {video.level}
            </Badge>
            <Badge variant="outline">{video.topic}</Badge>
          </div>
          <p className="text-muted-foreground">{video.description}</p>
        </div>

        {/* Video player and content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video player */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                {video.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p>Video not available</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Subtitles */}
            <Card>
              <CardHeader>
                <CardTitle>Subtitles</CardTitle>
                <CardDescription>Follow along with the video transcript</CardDescription>
              </CardHeader>
              <CardContent>
                {video.subtitles && video.subtitles.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {video.subtitles.map((subtitle: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md flex items-start gap-2 transition-colors cursor-pointer ${
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
                ) : (
                  <div className="text-center py-4 bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">No subtitles available for this video.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Learning tools */}
          <div className="space-y-6">
            {/* Learning tools navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Tools</CardTitle>
                <CardDescription>Interactive tools to help you learn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2" onClick={() => router.push(`/videos/${id}/quiz`)}>
                    <BookOpen className="h-4 w-4" />
                    Quizzes
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => router.push(`/videos/${id}/flashcards`)}>
                    <Brain className="h-4 w-4" />
                    Flashcards
                  </Button>
                  <Button variant="outline" className="gap-2 opacity-50" disabled>
                    <FlaskConical className="h-4 w-4" />
                    Exercises
                  </Button>
                  <Button variant="outline" className="gap-2 opacity-50" disabled>
                    <Timer className="h-4 w-4" />
                    Practice Sessions
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                  Note: Exercises and Practice Sessions features are currently under development and coming soon!
                </div>
              </CardContent>
            </Card>

            {/* Vocabulary list */}
            <Card>
              <CardHeader>
                <CardTitle>Vocabulary</CardTitle>
                <CardDescription>Key words and phrases from this video</CardDescription>
              </CardHeader>
              <CardContent>
                {video.vocabulary && video.vocabulary.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto pr-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>German</TableHead>
                          <TableHead>English</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {video.vocabulary.map((word: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{word.german}</TableCell>
                            <TableCell>{word.english}</TableCell>
                            <TableCell className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Volume2 className="h-4 w-4" />
                                <span className="sr-only">Pronounce</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <PlusIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <div className="p-2 text-sm font-medium text-center text-muted-foreground">
                                    Save to list
                                  </div>
                                  <DropdownMenuSeparator />
                                  {customLists.length > 0 ? (
                                    customLists.map((list) => (
                                    <DropdownMenuItem 
                                      key={list.id}
                                      onClick={() => handleSaveToCustomList(word, list.id)}
                                      className="flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-1">
                                        {list.isPublic ? 
                                          <Globe className="h-3 w-3 text-blue-500" /> : 
                                          <Lock className="h-3 w-3 text-muted-foreground" />
                                        }
                                        <span>{list.name}</span>
                                      </div>
                                      {recentlySavedWords[list.id]?.includes(word.german) && (
                                        <Check className="h-4 w-4 text-green-500" />
                                      )}
                                    </DropdownMenuItem>
                                    ))
                                  ) : (
                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                      No lists found
                                    </div>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => openNewListDialog(word)}
                                    className="flex items-center gap-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span>Create New List</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">No vocabulary available for this video.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress tracker (for logged in users) */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Watched</span>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-yellow-500" />
                        <span>Quiz</span>
                      </div>
                      <Badge variant="outline">2/5 completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-blue-500" />
                        <span>Exercises</span>
                      </div>
                      <Badge variant="outline">1/4 completed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        <span>Flashcards</span>
                      </div>
                      <Badge variant="outline">Not started</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/profile/progress" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Progress
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New List Dialog */}
      <Dialog open={isNewListDialogOpen} onOpenChange={(open) => setIsNewListDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Vocabulary List</DialogTitle>
            <DialogDescription>
              Enter a name and details for your new vocabulary list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="col-span-3"
                placeholder="List name"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublic" className="text-right">
                Sharing
              </Label>
              <div className="flex flex-col space-y-1.5 col-span-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={isNewListPublic}
                    onCheckedChange={setIsNewListPublic}
                  />
                  <Label htmlFor="isPublic" className="font-normal">
                    Share this list publicly
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isNewListPublic 
                    ? "This list will be visible to other users of the platform." 
                    : "This list will only be visible to you."}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateListAndAddWord} disabled={!newListName.trim()}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
