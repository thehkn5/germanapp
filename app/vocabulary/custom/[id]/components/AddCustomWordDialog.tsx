// /Users/hakan/Desktop/German App/V0 App/DE-Lern-08 April 2025 v24/app/vocabulary/custom/[id]/components/AddCustomWordDialog.tsx
"use client"

import { useState, useEffect } from "react" // Added useEffect
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Use Textarea for notes
import { Loader2 } from "lucide-react"
import { type Word } from "../page" // Adjust path if types are moved

type AddCustomWordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCustomWord: (word: { german: string; english: string; example?: string; category?: string; notes?: string }) => void
  isSaving: boolean // Added isSaving prop
}

export function AddCustomWordDialog({ open, onOpenChange, onAddCustomWord, isSaving }: AddCustomWordDialogProps) {
  const [newCustomWord, setNewCustomWord] = useState({
    german: "",
    english: "",
    example: "",
    category: "Custom",
    notes: "", // Added notes
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewCustomWord({
        german: "",
        english: "",
        example: "",
        category: "Custom",
        notes: "",
      })
    }
  }, [open])

  const handleSubmit = () => {
    if (!newCustomWord.german || !newCustomWord.english) return
    onAddCustomWord(newCustomWord)
    // Don't reset here, parent closes dialog on success
  }

  // Close handler ensures state is reset if closed via overlay click or Escape key
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
       setNewCustomWord({ german: "", english: "", example: "", category: "Custom", notes: "" }); // Clear state on close
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Word</DialogTitle>
          <DialogDescription>
            Create your own custom vocabulary entry.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* German */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-german" className="text-right">
              German*
            </Label>
            <Input
              id="add-german"
              value={newCustomWord.german}
              onChange={(e) => setNewCustomWord({ ...newCustomWord, german: e.target.value })}
              className="col-span-3"
              placeholder="Enter German word/phrase"
              disabled={isSaving}
              required
            />
          </div>
          {/* English */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-english" className="text-right">
              English*
            </Label>
            <Input
              id="add-english"
              value={newCustomWord.english}
              onChange={(e) => setNewCustomWord({ ...newCustomWord, english: e.target.value })}
              className="col-span-3"
              placeholder="Enter English translation"
              disabled={isSaving}
              required
            />
          </div>
          {/* Example */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-example" className="text-right">
              Example
            </Label>
            <Input
              id="add-example"
              value={newCustomWord.example}
              onChange={(e) => setNewCustomWord({ ...newCustomWord, example: e.target.value })}
              className="col-span-3"
              placeholder="Optional example sentence"
              disabled={isSaving}
            />
          </div>
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-category" className="text-right">
              Category
            </Label>
            <Input
              id="add-category"
              value={newCustomWord.category}
              onChange={(e) => setNewCustomWord({ ...newCustomWord, category: e.target.value })}
              className="col-span-3"
              placeholder='Optional category (default: "Custom")'
              disabled={isSaving}
            />
          </div>
           {/* Notes */}
           <div className="grid grid-cols-4 items-start gap-4"> {/* Use items-start for textarea */}
            <Label htmlFor="add-notes" className="text-right pt-2"> {/* Adjust label alignment */}
              Notes
            </Label>
            <Textarea
              id="add-notes"
              value={newCustomWord.notes}
              onChange={(e) => setNewCustomWord({ ...newCustomWord, notes: e.target.value })}
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
            disabled={isSaving || !newCustomWord.german || !newCustomWord.english}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add Word
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
