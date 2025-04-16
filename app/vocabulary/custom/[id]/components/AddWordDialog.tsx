"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Word } from "../page"

type AddWordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddWord: (word: Word) => void
  allVocabularyCategories: Record<string, { title: string; words: Word[] }>
}

export function AddWordDialog({ open, onOpenChange, onAddWord, allVocabularyCategories }: AddWordDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("general")
  const [searchAllWordsQuery, setSearchAllWordsQuery] = useState("")

  const categoryWords = allVocabularyCategories[selectedCategory]?.words ?? []
  const filteredAllWords = categoryWords.filter(
    (word) =>
      word.german.toLowerCase().includes(searchAllWordsQuery.toLowerCase()) ||
      word.english.toLowerCase().includes(searchAllWordsQuery.toLowerCase()) ||
      (word.example && word.example.toLowerCase().includes(searchAllWordsQuery.toLowerCase())),
  ) ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Words from Library</DialogTitle>
          <DialogDescription>
            Select words from our vocabulary library to add to your custom list.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(allVocabularyCategories).map((category) => (
              <TabsTrigger key={category} value={category}>
                {allVocabularyCategories[category].title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative mt-4">
            <Input
              placeholder="Search words in library..."
              value={searchAllWordsQuery}
              onChange={(e) => setSearchAllWordsQuery(e.target.value)}
            />
          </div>

          {Object.keys(allVocabularyCategories).map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredAllWords.length > 0 ? (
                  filteredAllWords.map((word) => (
                    <div key={word.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{word.german}</p>
                        <p className="text-sm text-muted-foreground">{word.english}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddWord(word)}
                      >
                        Add
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No words match your search query "{searchAllWordsQuery}".
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}