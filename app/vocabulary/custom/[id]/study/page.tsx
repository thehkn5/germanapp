"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff, Volume2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Progress } from "@/components/ui/progress" // Import Progress component

// Interface for custom vocabulary list
interface CustomList {
  id: string
  name: string
  words: Word[]
}

// Interface for word
interface Word {
  id: string
  german: string
  english: string
  example?: string
  category?: string
}

// Storage key for custom vocabulary lists
const CUSTOM_LISTS_KEY = "custom_vocabulary_lists"

export default function StudyPage() {
  const params = useParams()
  const id = params?.id as string;
  const router = useRouter()
  const { user } = useAuth()

  const [list, setList] = useState<CustomList | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showEnglish, setShowEnglish] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Loading state

  // Load custom list from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      setIsLoading(true); // Start loading
      const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
      if (storedLists) {
        try {
          const lists: CustomList[] = JSON.parse(storedLists)
          const foundList = lists.find((list) => list.id === id)
          if (foundList) {
            // Filter out words with empty german or english fields just in case
            foundList.words = foundList.words.filter(word => word.german && word.english);
            setList(foundList)
          } else {
            console.error("Study list not found, redirecting...");
            router.push("/vocabulary") // Redirect if list doesn't exist
          }
        } catch (error) {
          console.error("Error parsing lists from localStorage:", error)
          localStorage.removeItem(CUSTOM_LISTS_KEY); // Clear potentially corrupted data
          router.push("/vocabulary")
        }
      } else {
        router.push("/vocabulary") // Redirect if no lists stored
      }
      setIsLoading(false); // Finish loading
    }
  }, [id, router])

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !user && id) { // Check only after loading attempt
      router.push(`/auth/sign-in?redirect=/vocabulary/custom/${id}/study`)
    }
  }, [user, router, id, isLoading])

  // Go to the next word
  const goToNextWord = () => {
    if (list && currentIndex < list.words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowEnglish(false) // Hide English for the new word
    }
    // Optional: Loop back to start?
    // else if (list && list.words.length > 0) {
    //   setCurrentIndex(0);
    //   setShowEnglish(false);
    // }
  }

  // Go to the previous word
  const goToPreviousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowEnglish(false) // Hide English for the previous word
    }
  }

  // Toggle English visibility
  const toggleShowEnglish = () => {
    setShowEnglish(!showEnglish)
  }

   // Pronounce word (reuse from list page or define here)
   const pronounceWord = (text: string, lang: string = 'de-DE') => {
    if ('speechSynthesis' in window) {
      // Cancel any previous speech first to avoid overlap
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  }


  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // List not found or empty state
  if (!list || list.words.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
           <Button variant="ghost" onClick={() => router.push(`/vocabulary/custom/${id}`)} className="mb-6 gap-1 px-0 hover:bg-transparent text-muted-foreground">
             <ArrowLeft className="h-4 w-4" />
             Back to List
           </Button>
          <Card>
            <CardHeader>
              <CardTitle>{list ? list.name : "Study Session"}</CardTitle>
              <CardDescription>List Not Found or Empty</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {!list ? "Could not load this vocabulary list." : "This vocabulary list is empty. Add some words before studying."}
              </p>
            </CardContent>
             <CardFooter>
               <Button onClick={() => router.push(`/vocabulary/custom/${id}`)} className="w-full">
                 Go Back to List Page
               </Button>
             </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Get the current word
  const currentWord = list.words[currentIndex];
  const progressValue = list.words.length > 0 ? ((currentIndex + 1) / list.words.length) * 100 : 0;

  // Main Study UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push(`/vocabulary/custom/${id}`)} className="mb-6 gap-1 px-0 hover:bg-transparent text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to List "{list.name}"
        </Button>

        {/* Study Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Study: {list.name}</CardTitle>
            <CardDescription>
              Word {currentIndex + 1} of {list.words.length}
            </CardDescription>
            <Progress value={progressValue} className="mt-2 h-2" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[250px] text-center gap-4">
             {/* Pronounce Button for German */}
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent card click if any
                    pronounceWord(currentWord.german, 'de-DE');
                }}
                title="Pronounce German"
                >
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Pronounce German</span>
            </Button>

            {/* German Word */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">German</p>
              <p className="text-4xl font-semibold">{currentWord.german}</p>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={toggleShowEnglish}
                className="gap-2"
            >
                {showEnglish ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showEnglish ? "Hide" : "Show"} English
            </Button>

            {/* English Translation (Conditional) */}
            {showEnglish && (
              <div className="mt-4 p-4 bg-secondary/50 rounded-md w-full">
                 <p className="text-sm text-muted-foreground mb-1">English</p>
                 <p className="text-2xl">{currentWord.english}</p>
                 {currentWord.example && (
                     <p className="text-sm text-muted-foreground mt-2 italic">
                         Example: {currentWord.example}
                     </p>
                 )}
                 {currentWord.category && currentWord.category !== "Custom" && ( // Don't show "Custom" category maybe
                     <p className="text-sm text-muted-foreground mt-1">
                         Category: {currentWord.category}
                     </p>
                 )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousWord}
              disabled={currentIndex === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={goToNextWord}
              disabled={currentIndex === list.words.length - 1}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}