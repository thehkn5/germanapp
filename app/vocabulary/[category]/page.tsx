"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft, Grid, ListIcon, BookOpen, ArrowUpDown } from "lucide-react"

// Sample vocabulary data
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

type SortDirection = "asc" | "desc"

export default function VocabularyListPage() {
  const { category } = useParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortField, setSortField] = useState<"german" | "english">("german")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [studiedWords, setStudiedWords] = useState<Set<string>>(new Set())

  // Get vocabulary data for the selected category
  const vocabularyList = vocabularyData[category as keyof typeof vocabularyData] || {
    title: "Unknown Category",
    description: "Category not found",
    words: [],
  }

  // Get unique subcategories
  const subcategories = ["all", ...new Set(vocabularyList.words.map((word) => word.category))].filter(Boolean)

  // Filter and sort words
  const filteredWords = vocabularyList.words
    .filter(
      (word) =>
        (filterCategory === "all" || word.category === filterCategory) &&
        (word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (word.example && word.example.toLowerCase().includes(searchQuery.toLowerCase()))),
    )
    .sort((a, b) => {
      const fieldA = a[sortField].toLowerCase()
      const fieldB = b[sortField].toLowerCase()

      if (sortDirection === "asc") {
        return fieldA.localeCompare(fieldB)
      } else {
        return fieldB.localeCompare(fieldA)
      }
    })

  // Toggle sort direction
  const toggleSort = (field: "german" | "english") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Toggle studied status
  const toggleStudied = (wordId: string) => {
    setStudiedWords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(wordId)) {
        newSet.delete(wordId)
      } else {
        newSet.add(wordId)
      }
      return newSet
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/vocabulary")} className="gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold">{vocabularyList.title}</h1>
          <p className="text-muted-foreground">{vocabularyList.description}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search vocabulary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-muted" : ""}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-muted" : ""}
            >
              <ListIcon className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-muted-foreground">
              {filteredWords.length} {filteredWords.length === 1 ? "word" : "words"}
            </span>
          </div>
          <Button onClick={() => router.push(`/vocabulary/${category}/study`)} className="gap-2">
            <BookOpen className="h-4 w-4" />
            Study Words
          </Button>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <Card
                key={word.id}
                className={`overflow-hidden hover:shadow-md transition-shadow ${
                  studiedWords.has(word.id) ? "border-green-200 bg-green-50" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{word.german}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStudied(word.id)}
                      className={studiedWords.has(word.id) ? "text-green-600" : "text-muted-foreground"}
                    >
                      {studiedWords.has(word.id) ? "Studied" : "Mark as Studied"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{word.english}</p>
                  {word.example && <p className="text-sm text-muted-foreground mt-2 italic">"{word.example}"</p>}
                  <Badge variant="outline" className="mt-2">
                    {word.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] cursor-pointer" onClick={() => toggleSort("german")}>
                      <div className="flex items-center">
                        German
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("english")}>
                      <div className="flex items-center">
                        English
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Example</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWords.map((word) => (
                    <TableRow key={word.id} className={studiedWords.has(word.id) ? "bg-green-50" : ""}>
                      <TableCell className="font-medium">{word.german}</TableCell>
                      <TableCell>{word.english}</TableCell>
                      <TableCell className="text-muted-foreground">{word.example || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{word.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStudied(word.id)}
                          className={studiedWords.has(word.id) ? "text-green-600" : "text-muted-foreground"}
                        >
                          {studiedWords.has(word.id) ? "Studied" : "Mark as Studied"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
