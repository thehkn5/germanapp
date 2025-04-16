// /Users/hakan/Desktop/German App/V0 App/DE-Lern-08 April 2025 v24/app/vocabulary/custom/[id]/components/ListHeader.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, PlusCircle, BookOpen, Menu, Pencil, Download, Upload, Trash, FileText, FileJson, FileSpreadsheet, FileDown, FileUp, FileCode2, Globe, Lock, Share2 } from "lucide-react" // Added more icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Added Separator
  DropdownMenuSub, // Added Submenu
  DropdownMenuSubTrigger, // Added Submenu Trigger
  DropdownMenuSubContent, // Added Submenu Content
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { type CustomList } from "@/types/vocabulary" // Updated import

type ListHeaderProps = {
  list: CustomList
  onAddCustomWord: () => void
  onAddFromLibrary: () => void
  onDeleteList: () => void
  onEditList: () => void
  onTogglePublic: () => void
  onExportList: (format: 'json' | 'csv' | 'tsv' | 'txt' | 'md' | 'pdf' | 'docx') => void
  onImportList: () => void
}

export function ListHeader({
  list,
  onAddCustomWord,
  onAddFromLibrary,
  onDeleteList,
  onEditList,
  onTogglePublic,
  onExportList,
  onImportList,
}: ListHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight mb-1 truncate" title={list.name}>{list.name}</h1>
          {list.isPublic && (
            <Badge variant="secondary" className="shrink-0 mb-1 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Public
            </Badge>
          )}
        </div>
        {/* Display Description */}
        {list.description && (
            <p className="text-sm text-muted-foreground mb-2">{list.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
            {list.words.length} {list.words.length === 1 ? "word" : "words"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-start md:justify-end shrink-0">
        {/* Add Buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Word
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddCustomWord}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Custom Word</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFromLibrary}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Add From Library</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Study Button */}
        <Button
          variant="outline"
          onClick={() => router.push(`/vocabulary/custom/${list.id}/study`)}
          disabled={list.words.length === 0}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Study
        </Button>
        
        {/* Share Button - only show if list is public */}
        {list.isPublic && (
          <Button
            variant="outline"
            onClick={() => {
              // Copy the URL to clipboard
              navigator.clipboard.writeText(window.location.href);
              // Could show a toast here
            }}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
              <span className="sr-only">More Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEditList}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit List Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onTogglePublic}>
              {list.isPublic ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Make Private</span>
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Make Public</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Export Submenu */}
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <FileDown className="mr-2 h-4 w-4" />
                    <span>Export List</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onExportList('json')}>
                        <FileJson className="mr-2 h-4 w-4" /> JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExportList('csv')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExportList('tsv')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> TSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExportList('txt')}>
                        <FileText className="mr-2 h-4 w-4" /> Text
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onExportList('md')}>
                        <FileCode2 className="mr-2 h-4 w-4" /> Markdown
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onExportList('pdf')} disabled>
                        <FileText className="mr-2 h-4 w-4" /> PDF (Coming Soon)
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onExportList('docx')} disabled>
                        <FileText className="mr-2 h-4 w-4" /> Word (Coming Soon)
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            {/* Import Item */}
            <DropdownMenuItem onClick={onImportList}>
              <FileUp className="mr-2 h-4 w-4" />
              <span>Import / Replace List</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDeleteList} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete List</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
