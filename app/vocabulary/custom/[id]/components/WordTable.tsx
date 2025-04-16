// /Users/hakan/Desktop/German App/V0 App/DE-Lern-08 April 2025 v24/app/vocabulary/custom/[id]/components/WordTable.tsx
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2, Trash2, Pencil, Info } from "lucide-react" // Added Pencil, Info
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip" // For notes tooltip
import { type Word } from "../page" // Adjust path if types are moved

type WordTableProps = {
  words: Word[]
  searchQuery: string
  onDeleteWord: (wordId: string) => void
  onPronounceWord: (text: string) => void
  onEditWord: (word: Word) => void // Added handler for editing
}

export function WordTable({ words, searchQuery, onDeleteWord, onPronounceWord, onEditWord }: WordTableProps) {
  return (
    <TooltipProvider delayDuration={100}> {/* Wrap table in TooltipProvider */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>German</TableHead>
            <TableHead>English</TableHead>
            <TableHead className="hidden lg:table-cell">Example</TableHead> {/* Changed breakpoint */}
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead> {/* Increased width */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {words.length > 0 ? (
            words.map((word) => (
              <TableRow key={word.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{word.german}</span>
                    {/* Notes Tooltip */}
                    {word.notes && (
                       <Tooltip>
                        <TooltipTrigger asChild>
                           <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">{word.notes}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>{word.english}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground italic">
                  {word.example || "-"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {word.category ? <Badge variant="secondary">{word.category}</Badge> : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {/* Pronounce */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onPronounceWord(word.german)}
                        >
                          <Volume2 className="h-4 w-4" />
                          <span className="sr-only">Pronounce</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Pronounce</p></TooltipContent>
                    </Tooltip>
                    {/* Edit */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onEditWord(word)} // Call edit handler
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Edit Word</p></TooltipContent>
                    </Tooltip>
                    {/* Delete */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" // Ensure hover color
                          onClick={() => onDeleteWord(word.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top"><p>Remove Word</p></TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                {searchQuery ? `No words match your search query "${searchQuery}".` : "This list has no words yet."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
