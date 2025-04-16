// /Users/hakan/Desktop/German App/V0 App/DE-Lern-08 April 2025 v24/app/vocabulary/custom/[id]/components/EditWordDialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Use Textarea for notes
import { Loader2 } from "lucide-react"
import { type Word } from "../page" // Adjust path if types are moved

type EditWordDialogProps = {
  word: Word | null // Pass the word to edit
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveWord: (updatedWord: Word) => void
  isSaving: boolean
}

export function EditWordDialog({ word, open, onOpenChange, onSaveWord, isSaving }: EditWordDialogProps) {
  const [editedWord, setEditedWord] = useState<Word | null>(null)

  useEffect(() => {
    // Reset form when dialog opens or word changes
    if (open && word) {
      setEditedWord({ ...word }) // Create a copy to edit
    } else {
      setEditedWord(null) // Clear when closed
    }
  }, [open, word])

  const handleInputChange = (field: keyof Word, value: string) => {
    if (editedWord) {
      setEditedWord({ ...editedWord, [field]: value })
    }
  }

  const handleSubmit = () => {
    if (!editedWord || !editedWord.german || !editedWord.english) return
    onSaveWord({
        ...editedWord,
        german: editedWord.german.trim(),
        english: editedWord.english.trim(),
        example: editedWord.example?.trim() || undefined,
        category: editedWord.category?.trim() || "Custom",
        notes: editedWord.notes?.trim() || undefined,
    })
    // Keep dialog open until save is confirmed by parent
  }

  // Close handler ensures state is reset if closed via overlay click or Escape key
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditedWord(null); // Clear state on close
    }
    onOpenChange(isOpen);
  };

  if (!editedWord) return null; // Don't render if no word is being edited

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Word</DialogTitle>
          <DialogDescription>
            Update the details for "{word?.german}".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* German */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-german" className="text-right">
              German
            </Label>
            <Input
              id="edit-german"
              value={editedWord.german}
              onChange={(e) => handleInputChange('german', e.target.value)}
              className="col-span-3"
              placeholder="Enter German word/phrase"
              disabled={isSaving}
            />
          </div>
          {/* English */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-english" className="text-right">
              English
            </Label>
            <Input
              id="edit-english"
              value={editedWord.english}
              onChange={(e) => handleInputChange('english', e.target.value)}
              className="col-span-3"
              placeholder="Enter English translation"
              disabled={isSaving}
            />
          </div>
          {/* Example */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-example" className="text-right">
              Example
            </Label>
            <Input
              id="edit-example"
              value={editedWord.example || ""}
              onChange={(e) => handleInputChange('example', e.target.value)}
              className="col-span-3"
              placeholder="Optional example sentence"
              disabled={isSaving}
            />
          </div>
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Category
            </Label>
            <Input
              id="edit-category"
              value={editedWord.category || ""}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="col-span-3"
              placeholder="Optional category (e.g., Noun, Verb)"
              disabled={isSaving}
            />
          </div>
           {/* Notes */}
           <div className="grid grid-cols-4 items-start gap-4"> {/* Use items-start for textarea */}
            <Label htmlFor="edit-notes" className="text-right pt-2"> {/* Adjust label alignment */}
              Notes
            </Label>
            <Textarea
              id="edit-notes"
              value={editedWord.notes || ""}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="col-span-3 min-h-[80px]" // Give textarea some height
              placeholder="Optional notes about the word"
              disabled={isSaving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || !editedWord.german || !editedWord.english}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
