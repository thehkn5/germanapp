"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Grid, ListIcon, Plus, Trash2, Globe } from "lucide-react"
import Link from "next/link"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Import templates for easy content creation
import { vocabularyTemplates } from "@/types/vocabulary"

// Sample vocabulary categories
const vocabularyCategories = [
  {
    id: "general",
    title: "General Vocabulary",
    count: 250,
    description: "Essential German vocabulary for everyday use",
  },
  { id: "shopping", title: "Shopping", count: 75, description: "Words and phrases for shopping and commerce" },
  { id: "travel", title: "Travel", count: 120, description: "Vocabulary for traveling in German-speaking countries" },
  { id: "food", title: "Food & Dining", count: 90, description: "Food, cooking, and restaurant vocabulary" },
  { id: "school", title: "School & Education", count: 85, description: "Academic and educational terms" },
  { id: "business", title: "Business", count: 110, description: "Professional and business terminology" },
  { id: "health", title: "Health & Medical", count: 65, description: "Health, body parts, and medical terms" },
  { id: "family", title: "Family & Relationships", count: 50, description: "Family members and relationship terms" },
  { id: "home", title: "Home & Furniture", count: 70, description: "Household items and furniture vocabulary" },
]

// Import centralized types
import { CustomList, Word } from "@/types/vocabulary"

// Storage key for custom vocabulary lists
const CUSTOM_LISTS_KEY = "custom_vocabulary_lists"

export default function VocabularyPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [customLists, setCustomLists] = useState<CustomList[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [isListPublic, setIsListPublic] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [listToDelete, setListToDelete] = useState<string | null>(null)

  // Load custom lists from localStorage
  useEffect(() => {
    const storedLists = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (storedLists) {
      setCustomLists(JSON.parse(storedLists))
    }
  }, [])

  // Filter categories based on search
  const filteredCategories = vocabularyCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Create new custom list
  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: CustomList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      words: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: isListPublic
    }

    const updatedLists = [...customLists, newList]
    setCustomLists(updatedLists)
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    
    // Reset form
    setNewListName("")
    setNewListDescription("")
    setIsListPublic(false)
    setShowCreateDialog(false)
  }

  // Delete custom list
  const deleteList = () => {
    if (!listToDelete) return

    const updatedLists = customLists.filter((list) => list.id !== listToDelete)
    setCustomLists(updatedLists)
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updatedLists))
    setListToDelete(null)
    setShowDeleteDialog(false)
  }

  // Handle delete button click
  const handleDeleteClick = (listId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setListToDelete(listId)
    setShowDeleteDialog(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Side panel for custom lists */}
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  My Lists
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateDialog(true)} disabled={!user}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  {user ? "Your custom vocabulary lists" : "Sign in to create custom lists"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">Sign in to create and manage custom lists</p>
                    <Link href="/auth/sign-in">
                      <Button size="sm">Sign In</Button>
                    </Link>
                  </div>
                ) : customLists.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">You don't have any custom lists yet</p>
                    <Button size="sm" onClick={() => setShowCreateDialog(true)}>
                      Create Your First List
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {customLists.map((list) => (
                        <Link href={`/vocabulary/custom/${list.id}`} key={list.id} className="block">
                          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted group">
                            <div>
                              <p className="font-medium">{list.name}</p>
                              <p className="text-xs text-muted-foreground">{list.words.length} words</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleDeleteClick(list.id, e)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                            </Button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6">German Vocabulary</h1>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vocabulary categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Vocabulary Categories</h2>
            <div className="flex gap-2">
              <Link href="/community?type=vocabulary">
                <Button variant="outline" size="sm" className="gap-1">
                  <Globe className="h-4 w-4" />
                  Explore Community Lists
                </Button>
              </Link>
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

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Badge variant="secondary">{category.count} words</Badge>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/vocabulary/${category.id}`} className="w-full">
                      <Button variant="outline" className="w-full gap-2">
                        <BookOpen className="h-4 w-4" />
                        View Words
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {category.count} words
                      </Badge>
                    </div>
                    <Link href={`/vocabulary/${category.id}`}>
                      <Button variant="outline" className="gap-2 md:w-auto w-full">
                        <BookOpen className="h-4 w-4" />
                        View Words
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create List Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Vocabulary List</DialogTitle>
            <DialogDescription>
              Create a custom list to save and organize vocabulary words
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
                placeholder="My Vocabulary List"
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
                placeholder="Optional description for your list"
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
                    checked={isListPublic}
                    onCheckedChange={setIsListPublic}
                  />
                  <Label htmlFor="isPublic" className="font-normal">
                    Share this list publicly
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isListPublic 
                    ? "This list will be visible to other users in the community." 
                    : "This list will only be visible to you."}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewList} disabled={!newListName.trim()}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete list confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteList}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
