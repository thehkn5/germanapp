"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft, BookOpen, Trash2, Volume2, Plus, PlusCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interface for custom vocabulary list
interface CustomList {
  id: string
  name: string
  words: any[]
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

// Sample vocabulary data for all words in the application
const allVocabularyCategories = {
  general: {
    title: "General Vocabulary",
    words: [
      { id: "g1", german: "Hallo", english: "Hello", category: "Greetings", example: "Hallo, wie geht's?" },
      {
        id: "g2",
        german: "Auf Wiedersehen",
        english: "Goodbye",
        category: "Greetings",
        example: "Auf Wiedersehen, bis morgen!",
      },
      { id: "g3", german: "Danke", english: "Thank you", category: "Greetings", example: "Danke für deine Hilfe." },
      // More words...
    ],
  },
  shopping: {
    title: "Shopping",
    words: [
      { id: "s1", german: "der Laden", english: "shop/store", category: "Places", example: "Ich gehe in den Laden." },
      {
        id: "s2",
        german: "das Geschäft",
        english: "business/store",
        category: "Places",
        example: "Das Geschäft ist geschlossen.",
      },
      {
        id: "s3",
        german: "der Supermarkt",
        english: "supermarket",
        category: "Places",
        example: "Ich kaufe Lebensmittel im Supermarkt.",
      },
      // More words...
    ],
  },
  // More categories...
}

export default function CustomVocabularyListPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [list, setList] = useState<CustomList | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [wordToDelete, setWordToDelete] = useState<string | null>(null)
  const [showAddWordDialog, setShowAddWordDialog] = useState(false)
  const [showAddCustomWordDialog, setShowAddCustomWordDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("general")
  const [searchAllWordsQuery, setSearchAllWordsQuery] = useState("")
  const [newCustomWord, setNewCustomWord] = useState<{
    german: string
    english: string
    example: string
    category: string
  }>({
    german: "",
    english: "",
    example: "",
    category: "Custom",
  })

  // Load custom list from localStorage
  useEffect(() => {
    const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (storedLists) {
      const lists: CustomList[] = JSON.parse(storedLists)
      const foundList = lists.find((list) => list.id === id)
      if (foundList) {
        setList(foundList)
      } else {
        router.push("/vocabulary")
      }
    } else {
      router.push("/vocabulary")
    }
  }, [id, router])

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in?redirect=/vocabulary/custom/" + id)
    }
  }, [user, router, id])

  // Filter words based on search query
  const filteredWords =
    list?.words.filter(
      (word) =>
        word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (word.example && word.example.toLowerCase().includes(searchQuery.toLowerCase())),
    ) || []

  // Filter all words based on search query
  const filteredAllWords =
    allVocabularyCategories[selectedCategory as keyof typeof allVocabularyCategories]?.words.filter(
      (word) =>
        word.german.toLowerCase().includes(searchAllWordsQuery.toLowerCase()) ||
        word.english.toLowerCase().includes(searchAllWordsQuery.toLowerCase()) ||
        (word.example && word.example.toLowerCase().includes(searchAllWordsQuery.toLowerCase())),
    ) || []

  // Delete word from list
  const deleteWord = () => {
    if (!wordToDelete || !list) return

    const updatedWords = list.words.filter((word) => word.id !== wordToDelete)
    const updatedList = { ...list, words: updatedWords }

    // Update list in state
    setList(updatedList)

    // Update list in localStorage
    const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (storedLists) {
      const lists: CustomList[] = JSON.parse(storedLists)
      const updatedLists = lists.map((l) => (l.id === list.id ? updatedList : l))
      localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    }

    setWordToDelete(null)
    setShowDeleteDialog(false)
  }

  // Add word to list
  const addWordToList = (word: Word) => {
    if (!list) return

    // Check if word already exists in the list
    if (list.words.some((w) => w.id === word.id)) {
      return
    }

    const updatedList = {
      ...list,
      words: [...list.words, word],
    }

    // Update list in state
    setList(updatedList)

    // Update list in localStorage
    const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (storedLists) {
      const lists: CustomList[] = JSON.parse(storedLists)
      const updatedLists = lists.map((l) => (l.id === list.id ? updatedList : l))
      localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    }

    setShowAddWordDialog(false)
  }

  // Add custom word to list
  const addCustomWordToList = () => {
    if (!list || !newCustomWord.german || !newCustomWord.english) return

    const customWord: Word = {
      id: `custom-${Date.now()}`,
      german: newCustomWord.german,
      english: newCustomWord.english,
      example: newCustomWord.example || undefined,
      category: newCustomWord.category || "Custom",
    }

    const updatedList = {
      ...list,
      words: [...list.words, customWord],
    }

    // Update list in state
    setList(updatedList)

    // Update list in localStorage
    const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (storedLists) {
      const lists: CustomList[] = JSON.parse(storedLists)
      const updatedLists = lists.map((l) => (l.id === list.id ? updatedList : l))
      localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    }

    // Reset form
    setNewCustomWord({
      german: "",
      english: "",
      example: "",
      category: "Custom",
    })

    setShowAddCustomWordDialog(false)
  }

  // Start study session
  const startStudySession = () => {
    if (!list || list.words.length === 0) return
    router.push(`/vocabulary/custom/${id}/study`)
  }

  if (!list) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/vocabulary")} className="gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Vocabulary
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
              <p className="text-muted-foreground">Your custom vocabulary list</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddCustomWordDialog(true)} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Custom Word
              </Button>
              <Button variant="outline" onClick={() => setShowAddWordDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add From Library
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={startStudySession} disabled={list.words.length === 0} className="gap-2">
            <BookOpen className="h-4 w-4" />
            Study Words
          </Button>
        </div>

        {list.words.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                This list is empty. Add words to this list using the buttons above.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setShowAddCustomWordDialog(true)}>
                  Add Custom Word
                </Button>
                <Button variant="outline" onClick={() => setShowAddWordDialog(true)}>
                  Add From Library
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Words in this list ({filteredWords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>German</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead className="hidden md:table-cell">Example</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">{word.german}</TableCell>
                      <TableCell>{word.english}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {word.example || "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {word.category && <Badge variant="outline">{word.category}</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Volume2 className="h-4 w-4" />
                            <span className="sr-only">Pronounce</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => {
                              setWordToDelete(word.id)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete word confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Word</DialogTitle>
            <DialogDescription>Are you sure you want to remove this word from your list?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteWord}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add word from library dialog */}
      <Dialog open={showAddWordDialog} onOpenChange={setShowAddWordDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Words from Library</DialogTitle>
            <DialogDescription>Browse and add words from our vocabulary library</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" onValueChange={(value) => setSelectedCategory(value)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
            </TabsList>

            <div className="my-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search words..."
                  value={searchAllWordsQuery}
                  onChange={(e) => setSearchAllWordsQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value="general" className="h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>German</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">{word.german}</TableCell>
                      <TableCell>{word.english}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {word.category && <Badge variant="outline">{word.category}</Badge>}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => addWordToList(word)}
                          disabled={list.words.some((w) => w.id === word.id)}
                        >
                          {list.words.some((w) => w.id === word.id) ? "Added" : "Add"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="shopping" className="h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>German</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">{word.german}</TableCell>
                      <TableCell>{word.english}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {word.category && <Badge variant="outline">{word.category}</Badge>}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => addWordToList(word)}
                          disabled={list.words.some((w) => w.id === word.id)}
                        >
                          {list.words.some((w) => w.id === word.id) ? "Added" : "Add"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="travel" className="h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>German</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">{word.german}</TableCell>
                      <TableCell>{word.english}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {word.category && <Badge variant="outline">{word.category}</Badge>}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => addWordToList(word)}
                          disabled={list.words.some((w) => w.id === word.id)}
                        >
                          {list.words.some((w) => w.id === word.id) ? "Added" : "Add"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWordDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add custom word dialog */}
      <Dialog open={showAddCustomWordDialog} onOpenChange={setShowAddCustomWordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Word</DialogTitle>
            <DialogDescription>Create your own vocabulary word</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="german">German Word</Label>
              <Input
                id="german"
                placeholder="e.g., der Apfel"
                value={newCustomWord.german}
                onChange={(e) => setNewCustomWord({ ...newCustomWord, german: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="english">English Translation</Label>
              <Input
                id="english"
                placeholder="e.g., the apple"
                value={newCustomWord.english}
                onChange={(e) => setNewCustomWord({ ...newCustomWord, english: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">Example Sentence (Optional)</Label>
              <Input
                id="example"
                placeholder="e.g., Der Apfel ist rot."
                value={newCustomWord.example}
                onChange={(e) => setNewCustomWord({ ...newCustomWord, example: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g., Food"
                value={newCustomWord.category}
                onChange={(e) => setNewCustomWord({ ...newCustomWord, category: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCustomWordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addCustomWordToList} disabled={!newCustomWord.german || !newCustomWord.english}>
              Add Word
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
