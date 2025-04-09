"use client"

import { useState, useEffect, useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, Check, X, RotateCcw, Trophy, Keyboard, BookmarkPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Sample vocabulary data (same as in the previous file)
const vocabularyData = {
  general: {
    title: "General Vocabulary",
    description: "Essential German vocabulary for everyday use",
    words: [
      { id: "1", german: "Hallo", english: "Hello", category: "Greetings", example: "Hallo, wie geht's?" },
      {
        id: "2",
        german: "Auf Wiedersehen",
        english: "Goodbye",
        category: "Greetings",
        example: "Auf Wiedersehen, bis morgen!",
      },
      { id: "3", german: "Danke", english: "Thank you", category: "Greetings", example: "Danke für deine Hilfe." },
      { id: "4", german: "Bitte", english: "Please/You're welcome", category: "Greetings", example: "Bitte schön!" },
      { id: "5", german: "Ja", english: "Yes", category: "Basic", example: "Ja, das stimmt." },
      { id: "6", german: "Nein", english: "No", category: "Basic", example: "Nein, das ist falsch." },
      {
        id: "7",
        german: "Entschuldigung",
        english: "Excuse me/Sorry",
        category: "Greetings",
        example: "Entschuldigung, wo ist der Bahnhof?",
      },
      {
        id: "8",
        german: "Guten Morgen",
        english: "Good morning",
        category: "Greetings",
        example: "Guten Morgen! Wie geht es dir?",
      },
      {
        id: "9",
        german: "Guten Tag",
        english: "Good day",
        category: "Greetings",
        example: "Guten Tag, kann ich Ihnen helfen?",
      },
      {
        id: "10",
        german: "Guten Abend",
        english: "Good evening",
        category: "Greetings",
        example: "Guten Abend! Schön, Sie zu sehen.",
      },
      {
        id: "11",
        german: "Wie heißt du?",
        english: "What's your name?",
        category: "Questions",
        example: "Hallo, wie heißt du?",
      },
      {
        id: "12",
        german: "Ich heiße...",
        english: "My name is...",
        category: "Introductions",
        example: "Ich heiße Maria.",
      },
      {
        id: "13",
        german: "Woher kommst du?",
        english: "Where are you from?",
        category: "Questions",
        example: "Woher kommst du?",
      },
      {
        id: "14",
        german: "Ich komme aus...",
        english: "I come from...",
        category: "Introductions",
        example: "Ich komme aus Deutschland.",
      },
      {
        id: "15",
        german: "Wie alt bist du?",
        english: "How old are you?",
        category: "Questions",
        example: "Wie alt bist du?",
      },
      {
        id: "16",
        german: "Ich bin ... Jahre alt",
        english: "I am ... years old",
        category: "Introductions",
        example: "Ich bin 25 Jahre alt.",
      },
      {
        id: "17",
        german: "Was machst du?",
        english: "What do you do?",
        category: "Questions",
        example: "Was machst du beruflich?",
      },
      { id: "18", german: "Ich bin...", english: "I am...", category: "Introductions", example: "Ich bin Lehrer." },
      {
        id: "19",
        german: "Wo wohnst du?",
        english: "Where do you live?",
        category: "Questions",
        example: "Wo wohnst du?",
      },
      {
        id: "20",
        german: "Ich wohne in...",
        english: "I live in...",
        category: "Introductions",
        example: "Ich wohne in Berlin.",
      },
    ],
  },
  shopping: {
    title: "Shopping",
    description: "Words and phrases for shopping and commerce",
    words: [
      { id: "1", german: "der Laden", english: "shop/store", category: "Places", example: "Ich gehe in den Laden." },
      {
        id: "2",
        german: "das Geschäft",
        english: "business/store",
        category: "Places",
        example: "Das Geschäft ist geschlossen.",
      },
      {
        id: "3",
        german: "der Supermarkt",
        english: "supermarket",
        category: "Places",
        example: "Ich kaufe Lebensmittel im Supermarkt.",
      },
      {
        id: "4",
        german: "die Bäckerei",
        english: "bakery",
        category: "Places",
        example: "Die Bäckerei hat frisches Brot.",
      },
      {
        id: "5",
        german: "die Metzgerei",
        english: "butcher shop",
        category: "Places",
        example: "Ich kaufe Fleisch in der Metzgerei.",
      },
      { id: "6", german: "kaufen", english: "to buy", category: "Verbs", example: "Ich möchte ein Buch kaufen." },
      { id: "7", german: "verkaufen", english: "to sell", category: "Verbs", example: "Sie verkauft Kleidung." },
      { id: "8", german: "der Preis", english: "price", category: "Commerce", example: "Was ist der Preis?" },
      { id: "9", german: "teuer", english: "expensive", category: "Adjectives", example: "Das Auto ist sehr teuer." },
      { id: "10", german: "billig", english: "cheap", category: "Adjectives", example: "Die Schuhe sind billig." },
      {
        id: "11",
        german: "die Kasse",
        english: "cash register/checkout",
        category: "Commerce",
        example: "Bitte zahlen Sie an der Kasse.",
      },
      {
        id: "12",
        german: "die Rechnung",
        english: "bill/invoice",
        category: "Commerce",
        example: "Kann ich die Rechnung haben?",
      },
      {
        id: "13",
        german: "das Geld",
        english: "money",
        category: "Commerce",
        example: "Ich habe nicht genug Geld dabei.",
      },
      {
        id: "14",
        german: "die Kreditkarte",
        english: "credit card",
        category: "Commerce",
        example: "Kann ich mit Kreditkarte bezahlen?",
      },
      {
        id: "15",
        german: "bar bezahlen",
        english: "to pay cash",
        category: "Verbs",
        example: "Ich möchte bar bezahlen.",
      },
    ],
  },
  // Add more categories as needed
}

// Study session states
type StudyState = "settings" | "studying" | "results"

// Storage key for studied words
const getStudiedWordsKey = (category: string) => `studied_words_${category}`

// Storage key for custom vocabulary lists
const CUSTOM_LISTS_KEY = "custom_vocabulary_lists"

// Interface for custom vocabulary list
interface CustomList {
  id: string
  name: string
  words: any[]
}

export default function VocabularyStudyPage() {
  const { category } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  // Study settings
  const [studyState, setStudyState] = useState<StudyState>("settings")
  const [sessionDuration, setSessionDuration] = useState(15) // minutes
  const [wordCount, setWordCount] = useState(10)
  const [shuffleWords, setShuffleWords] = useState(true)
  const [hideStudied, setHideStudied] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  // Study session data
  const [studyWords, setStudyWords] = useState<any[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set())
  const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set())
  const [unknownWordsList, setUnknownWordsList] = useState<any[]>([])
  const [waitingForNext, setWaitingForNext] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [startTime, setStartTime] = useState(0)

  // Custom vocabulary lists
  const [customLists, setCustomLists] = useState<CustomList[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [currentWordToSave, setCurrentWordToSave] = useState<any | null>(null)

  // Get vocabulary data for the selected category
  const vocabularyList = vocabularyData[category as keyof typeof vocabularyData] || {
    title: "Unknown Category",
    description: "Category not found",
    words: [],
  }

  // Check if user is logged in
  useEffect(() => {
    if (!user && studyState === "settings") {
      router.push(`/auth/sign-in?redirect=/vocabulary/${category}/study`)
    }
  }, [user, studyState, router, category])

  // Load previously studied words from localStorage
  useEffect(() => {
    const storedStudied = localStorage.getItem(getStudiedWordsKey(category as string))
    const studiedSet = storedStudied ? new Set(JSON.parse(storedStudied)) : new Set()

    // Initialize study words
    prepareStudyWords(studiedSet)

    // Load custom vocabulary lists
    const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (storedLists) {
      setCustomLists(JSON.parse(storedLists))
    }
  }, [category])

  // Timer for study session
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (studyState === "studying" && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            endSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [studyState, timeRemaining])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (studyState === "studying") {
        switch (e.key) {
          case " ": // Space
            e.preventDefault()
            if (!waitingForNext) {
              if (showAnswer) {
                handleKnow()
              } else {
                setShowAnswer(!showAnswer)
              }
            }
            break
          case "1":
            e.preventDefault()
            if (!waitingForNext && showAnswer) {
              handleKnow()
            }
            break
          case "2":
            e.preventDefault()
            if (!waitingForNext && showAnswer) {
              handleDontKnow()
            }
            break
          case "ArrowRight":
          case "Enter":
            e.preventDefault()
            if (waitingForNext) {
              handleNext()
            } else if (!showAnswer) {
              setShowAnswer(true)
            }
            break
          case "ArrowLeft":
            e.preventDefault()
            if (currentWordIndex > 0 && !waitingForNext) {
              setCurrentWordIndex(currentWordIndex - 1)
              setShowAnswer(false)
            }
            break
          case "Escape":
            e.preventDefault()
            if (confirm("Are you sure you want to end this study session?")) {
              endSession()
            }
            break
          case "h":
          case "H":
          case "?":
            e.preventDefault()
            setShowKeyboardHelp((prev) => !prev)
            break
        }
      } else if (studyState === "results") {
        switch (e.key) {
          case "r":
          case "R":
            e.preventDefault()
            resetSession()
            break
          case "Escape":
            e.preventDefault()
            router.push(`/vocabulary/${category}`)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [studyState, waitingForNext, showAnswer, router, category, currentWordIndex])

  // Prepare words for study session
  const prepareStudyWords = (studiedSet: Set<string>) => {
    let availableWords = [...vocabularyList.words]

    // Filter out studied words if requested
    if (hideStudied) {
      availableWords = availableWords.filter((word) => !studiedSet.has(word.id))
    }

    // Shuffle if requested
    if (shuffleWords) {
      availableWords = shuffleArray(availableWords)
    }

    // Limit to requested word count
    availableWords = availableWords.slice(0, wordCount)

    setStudyWords(availableWords)
  }

  // Shuffle array helper function
  const shuffleArray = (array: any[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Start study session
  const startSession = () => {
    if (!user) {
      router.push(`/auth/sign-in?redirect=/vocabulary/${category}/study`)
      return
    }

    setStudyState("studying")
    setCurrentWordIndex(0)
    setShowAnswer(false)
    setKnownWords(new Set())
    setUnknownWords(new Set())
    setUnknownWordsList([])
    setWaitingForNext(false)
    setTimeRemaining(sessionDuration * 60)
    setStartTime(Date.now())
  }

  // End study session
  const endSession = () => {
    setStudyState("results")

    // Save studied words to localStorage
    const storedStudied = localStorage.getItem(getStudiedWordsKey(category as string))
    const studiedSet = storedStudied ? new Set(JSON.parse(storedStudied)) : new Set()

    // Add known words to studied set
    knownWords.forEach((id) => studiedSet.add(id))

    localStorage.setItem(getStudiedWordsKey(category as string), JSON.stringify([...studiedSet]))
  }

  // Handle "Know" button
  const handleKnow = useCallback(() => {
    if (waitingForNext) return

    const currentWord = studyWords[currentWordIndex]
    setKnownWords((prev) => new Set(prev).add(currentWord.id))

    // Show answer and wait for next
    setShowAnswer(true)
    setWaitingForNext(true)
  }, [waitingForNext, currentWordIndex, studyWords])

  // Handle "Don't Know" button
  const handleDontKnow = useCallback(() => {
    if (waitingForNext) return

    const currentWord = studyWords[currentWordIndex]
    setUnknownWords((prev) => new Set(prev).add(currentWord.id))

    // Add to unknown words list
    setUnknownWordsList((prev) => [...prev, currentWord])

    // Show answer and wait for next
    setShowAnswer(true)
    setWaitingForNext(true)
  }, [waitingForNext, currentWordIndex, studyWords])

  // Handle "Next" button after showing answer
  const handleNext = useCallback(() => {
    if (!waitingForNext) return

    setShowAnswer(false)
    setWaitingForNext(false)

    // Move to next word
    if (currentWordIndex >= studyWords.length - 1) {
      endSession()
    } else {
      setCurrentWordIndex((prev) => prev + 1)
    }
  }, [waitingForNext, currentWordIndex, studyWords.length])

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  // Reset session
  const resetSession = () => {
    setStudyState("settings")
  }

  // Start review session with unknown words
  const startReviewSession = () => {
    // Set up a new study session with only the unknown words
    setStudyWords(unknownWordsList)
    setCurrentWordIndex(0)
    setShowAnswer(false)
    setKnownWords(new Set())
    setUnknownWords(new Set())
    setUnknownWordsList([])
    setWaitingForNext(false)
    setTimeRemaining(sessionDuration * 60)
    setStartTime(Date.now())
    setStudyState("studying")
  }

  // Save word to custom list
  const handleSaveWord = (word: any) => {
    setCurrentWordToSave(word)
    setShowSaveDialog(true)
  }

  // Create new custom list
  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: CustomList = {
      id: Date.now().toString(),
      name: newListName,
      words: [],
    }

    const updatedLists = [...customLists, newList]
    setCustomLists(updatedLists)
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    setNewListName("")
    setSelectedList(newList.id)
  }

  // Save word to selected list
  const saveWordToList = () => {
    if (!selectedList || !currentWordToSave) return

    const updatedLists = customLists.map((list) => {
      if (list.id === selectedList) {
        // Check if word already exists in the list
        const wordExists = list.words.some((w) => w.id === currentWordToSave.id)
        if (!wordExists) {
          return {
            ...list,
            words: [...list.words, currentWordToSave],
          }
        }
      }
      return list
    })

    setCustomLists(updatedLists)
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    setShowSaveDialog(false)
    setCurrentWordToSave(null)
    setSelectedList(null)
  }

  // If user is not logged in, show sign-in prompt
  if (!user && studyState === "settings") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>You need to sign in to access the vocabulary study feature</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please sign in to track your progress and access all learning features.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/vocabulary/${category}`)}>
                Go Back
              </Button>
              <Button onClick={() => router.push(`/auth/sign-in?redirect=/vocabulary/${category}/study`)}>
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <a href={`/vocabulary/${category}`} className="inline-block">
            <Button variant="ghost" className="gap-1 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Vocabulary List
            </Button>
          </a>
          <h1 className="text-3xl font-bold">{vocabularyList.title} - Study Session</h1>
        </div>

        {studyState === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Study Session Settings</CardTitle>
              <CardDescription>Configure your vocabulary study session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="duration">Session Duration: {sessionDuration} minutes</Label>
                </div>
                <Slider
                  id="duration"
                  min={1}
                  max={120}
                  step={1}
                  value={[sessionDuration]}
                  onValueChange={(value) => setSessionDuration(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="wordCount">Number of Words: {wordCount}</Label>
                </div>
                <Slider
                  id="wordCount"
                  min={5}
                  max={Math.min(100, vocabularyList.words.length)}
                  step={5}
                  value={[wordCount]}
                  onValueChange={(value) => setWordCount(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5</span>
                  <span>25</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shuffle">Shuffle Words</Label>
                  <p className="text-sm text-muted-foreground">Randomize the order of words</p>
                </div>
                <Switch id="shuffle" checked={shuffleWords} onCheckedChange={setShuffleWords} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hideStudied">Hide Studied Words</Label>
                  <p className="text-sm text-muted-foreground">Only show words you haven't studied yet</p>
                </div>
                <Switch id="hideStudied" checked={hideStudied} onCheckedChange={setHideStudied} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startSession} className="w-full">
                Start Study Session
              </Button>
            </CardFooter>
          </Card>
        )}

        {studyState === "studying" && studyWords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main flashcard area */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentWordIndex + 1} of {studyWords.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeyboardHelp((prev) => !prev)}
                    aria-label="Keyboard shortcuts"
                  >
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Progress value={(currentWordIndex / studyWords.length) * 100} />

              {showKeyboardHelp && (
                <Alert>
                  <div className="space-y-2">
                    <h3 className="font-medium">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> Flip card / Mark as known
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">1</kbd> Mark as known
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">2</kbd> Mark as don't know
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> or{" "}
                        <kbd className="px-2 py-1 bg-muted rounded">→</kbd> Next card
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">←</kbd> Previous card
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> End session
                      </div>
                      <div>
                        <kbd className="px-2 py-1 bg-muted rounded">H</kbd> or{" "}
                        <kbd className="px-2 py-1 bg-muted rounded">?</kbd> Toggle help
                      </div>
                    </div>
                  </div>
                </Alert>
              )}

              <Card className="perspective">
                <div
                  className={`relative h-64 w-full cursor-pointer ${showAnswer ? "[transform:rotateY(180deg)]" : ""} transition-all duration-500 [transform-style:preserve-3d]`}
                  onClick={() => !waitingForNext && setShowAnswer(!showAnswer)}
                  tabIndex={0}
                  role="button"
                  aria-label={showAnswer ? "Show German word" : "Show English translation"}
                  onKeyDown={(e: ReactKeyboardEvent) => {
                    if (e.key === " " && !waitingForNext) {
                      e.preventDefault()
                      setShowAnswer(!showAnswer)
                    }
                  }}
                >
                  <CardContent className="absolute inset-0 flex items-center justify-center p-6 [backface-visibility:hidden]">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">German</p>
                      <h2 className="text-3xl font-bold">{studyWords[currentWordIndex].german}</h2>
                      {studyWords[currentWordIndex].example && (
                        <p className="mt-4 text-sm italic">"{studyWords[currentWordIndex].example}"</p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveWord(studyWords[currentWordIndex])
                        }}
                      >
                        <BookmarkPlus className="h-4 w-4 mr-1" />
                        Save to List
                      </Button>
                    </div>
                  </CardContent>

                  <CardContent className="absolute inset-0 flex items-center justify-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">English</p>
                      <h2 className="text-3xl font-bold">{studyWords[currentWordIndex].english}</h2>
                      <Badge className="mt-4">{studyWords[currentWordIndex].category}</Badge>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex justify-between gap-4">
                  {!waitingForNext ? (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={handleDontKnow}
                        tabIndex={0}
                        aria-label="Don't know this word"
                        onKeyDown={(e: ReactKeyboardEvent) => {
                          if (e.key === "2") {
                            e.preventDefault()
                            handleDontKnow()
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                        Don't Know
                      </Button>

                      <Button
                        className="flex-1 gap-2"
                        onClick={handleKnow}
                        tabIndex={0}
                        aria-label="I know this word"
                        onKeyDown={(e: ReactKeyboardEvent) => {
                          if (e.key === "1") {
                            e.preventDefault()
                            handleKnow()
                          }
                        }}
                      >
                        <Check className="h-4 w-4" />
                        Know
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={handleNext}
                      tabIndex={0}
                      aria-label="Next word"
                      onKeyDown={(e: ReactKeyboardEvent) => {
                        if (e.key === "Enter" || e.key === "ArrowRight") {
                          e.preventDefault()
                          handleNext()
                        }
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                      Next
                    </Button>
                  )}
                </CardFooter>
              </Card>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={endSession}
                  tabIndex={0}
                  aria-label="End session"
                  onKeyDown={(e: ReactKeyboardEvent) => {
                    if (e.key === "Escape") {
                      e.preventDefault()
                      if (confirm("Are you sure you want to end this study session?")) {
                        endSession()
                      }
                    }
                  }}
                >
                  End Session
                </Button>
              </div>
            </div>

            {/* Unknown words sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Words to Review</CardTitle>
                  <CardDescription>Words you've marked as "Don't Know" will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  {unknownWordsList.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No words to review yet. Words you mark as "Don't Know" will appear here.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {unknownWordsList.map((word, index) => (
                        <div key={index} className="p-2 border rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{word.german}</span>
                            <span className="text-muted-foreground">{word.english}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                              {word.category}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => handleSaveWord(word)}>
                              <BookmarkPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {studyState === "results" && (
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-center">Study Session Complete!</CardTitle>
              <CardDescription className="text-center">
                You've completed your study session for {vocabularyList.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <div className="text-5xl font-bold mb-2">
                  {knownWords.size} / {studyWords.length}
                </div>
                <p className="text-muted-foreground">Words marked as known</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span>{Math.round((knownWords.size / studyWords.length) * 100)}%</span>
                </div>
                <Progress value={(knownWords.size / studyWords.length) * 100} />
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Session Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Time spent:</span>
                    <span>{formatTime(Math.floor((Date.now() - startTime) / 1000))}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Words studied:</span>
                    <span>{studyWords.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Words known:</span>
                    <span>{knownWords.size}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Words to review:</span>
                    <span>{unknownWords.size}</span>
                  </li>
                </ul>
              </div>

              {unknownWordsList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Words to Review</h3>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {unknownWordsList.map((word, index) => (
                      <div key={index} className="p-2 border rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{word.german}</span>
                          <span className="text-muted-foreground">{word.english}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            {word.category}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleSaveWord(word)}>
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={startReviewSession}
                    className="w-full mt-4"
                    tabIndex={0}
                    aria-label="Review unknown words"
                  >
                    Review Unknown Words
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <a href={`/vocabulary/${category}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  tabIndex={0}
                  aria-label="Return to vocabulary list"
                  onKeyDown={(e: ReactKeyboardEvent) => {
                    if (e.key === "Escape") {
                      e.preventDefault()
                      router.push(`/vocabulary/${category}`)
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to List
                </Button>
              </a>
              <Button
                onClick={resetSession}
                className="flex-1 gap-2"
                tabIndex={0}
                aria-label="Start new session"
                onKeyDown={(e: ReactKeyboardEvent) => {
                  if (e.key === "r" || e.key === "R") {
                    e.preventDefault()
                    resetSession()
                  }
                }}
              >
                <RotateCcw className="h-4 w-4" />
                New Session
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Save to custom list dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save to Vocabulary List</DialogTitle>
              <DialogDescription>
                Save this word to one of your custom vocabulary lists or create a new list.
              </DialogDescription>
            </DialogHeader>

            {customLists.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="select-list">Select a list</Label>
                <select
                  id="select-list"
                  value={selectedList || ""}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>
                    Select a list
                  </option>
                  {customLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-list">Or create a new list</Label>
              <div className="flex gap-2">
                <Input
                  id="new-list"
                  placeholder="New list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button onClick={createNewList} disabled={!newListName.trim()}>
                  Create
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveWordToList} disabled={!selectedList}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
