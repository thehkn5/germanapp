"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft, BookOpen, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Import Components
import { ListHeader } from "./components/ListHeader"
import { WordTable } from "./components/WordTable"
import { AddWordDialog } from "./components/AddWordDialog"
import { AddCustomWordDialog } from "./components/AddCustomWordDialog"
import { EditWordDialog } from "./components/EditWordDialog"

// Import centralized types
import { Word, CustomList } from "@/types/vocabulary" // Ensure these types are correctly defined in this path

// Import helper functions
import { getAllLists, updateLocalStorage } from "@/lib/vocabulary-utils" // Ensure these functions are correctly defined in this path
import { useListManagement } from '@/hooks/use-list-management'
import { useWordOperations } from '@/hooks/use-word-operations'
import { exportListData } from '@/lib/list-export-utils'

// --- Constants ---
const CUSTOM_LISTS_KEY = "custom_vocabulary_lists"

// --- Sample Data (Replace with API call or context if needed) ---
const allVocabularyCategories: Record<string, { title: string; words: Word[] }> = {
  general: {
    title: "General Vocabulary",
    words: [
      { id: "g1", german: "Hallo", english: "Hello", category: "Greetings", example: "Hallo, wie geht's?" },
      { id: "g2", german: "Auf Wiedersehen", english: "Goodbye", category: "Greetings", example: "Auf Wiedersehen, bis morgen!" },
      { id: "g3", german: "Danke", english: "Thank you", category: "Greetings", example: "Danke für deine Hilfe." },
      { id: "g4", german: "Bitte", english: "Please / You're welcome", category: "Greetings", example: "Bitte sehr." },
      // More words...
    ],
  },
  shopping: {
    title: "Shopping",
    words: [
      { id: "s1", german: "der Laden", english: "shop/store", category: "Places", example: "Ich gehe in den Laden." },
      { id: "s2", german: "das Geschäft", english: "business/store", category: "Places", example: "Das Geschäft ist geschlossen." },
      { id: "s3", german: "der Supermarkt", english: "supermarket", category: "Places", example: "Ich kaufe Lebensmittel im Supermarkt." },
      { id: "s4", german: "kaufen", english: "to buy", category: "Verbs", example: "Ich möchte Brot kaufen." },
      // More words...
    ],
  },
  travel: {
    title: "Travel",
    words: [
        { id: "t1", german: "der Flughafen", english: "airport", category: "Places", example: "Wir fahren zum Flughafen." },
        { id: "t2", german: "der Bahnhof", english: "train station", category: "Places", example: "Der Zug fährt vom Bahnhof ab." },
        { id: "t3", german: "das Flugzeug", english: "airplane", category: "Transport", example: "Das Flugzeug fliegt hoch." },
        { id: "t4", german: "der Zug", english: "train", category: "Transport", example: "Ich nehme den Zug nach Berlin." },
        // More words...
    ],
  },
  // More categories...
};

// --- Helper Functions for Export (Moved outside component) ---

// Escape CSV/TSV field content
const escapeField = (field: string | undefined = '', delimiter: string): string => {
  const str = String(field);
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Convert list data to CSV
const convertToCSV = (list: CustomList): string => {
  const header = ['id', 'german', 'english', 'example', 'category', 'notes'];
  const rows = list.words.map(word =>
    header.map(field => escapeField(word[field as keyof Word], ',')).join(',')
  );
  return [header.join(','), ...rows].join('\n');
};

// Convert list data to TSV
const convertToTSV = (list: CustomList): string => {
  const header = ['id', 'german', 'english', 'example', 'category', 'notes'];
  const rows = list.words.map(word =>
    header.map(field => escapeField(word[field as keyof Word], '\t')).join('\t')
  );
  return [header.join('\t'), ...rows].join('\n');
};

// Convert list data to simple Text
const convertToTXT = (list: CustomList): string => {
  return list.words.map(word =>
    `${word.german} - ${word.english}${word.example ? ` (e.g., "${word.example}")` : ''}${word.notes ? ` [Notes: ${word.notes}]` : ''}`
  ).join('\n');
};

// Convert list data to Markdown Table
const convertToMD = (list: CustomList): string => {
  const header = '| German | English | Example | Category | Notes |';
  const separator = '|---|---|---|---|---|';
  const rows = list.words.map(word =>
    `| ${word.german || ''} | ${word.english || ''} | ${word.example || ''} | ${word.category || ''} | ${word.notes || ''} |`
  );
  return [`# ${list.name}`, list.description || '', '', header, separator, ...rows].join('\n');
};

// --- Main Component ---
export default function CustomVocabularyListPage() {
  // --- Hooks ---
  const params = useParams()
  const id = params?.id as string;
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // --- State ---
  const [list, setList] = useState<CustomList | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Removed unused showSavedNotification and savedWord states

  // Dialog visibility state
  const [showDeleteListDialog, setShowDeleteListDialog] = useState(false)
  const [showDeleteWordDialog, setShowDeleteWordDialog] = useState(false)
  const [wordToDelete, setWordToDelete] = useState<string | null>(null)
  const [showAddWordDialog, setShowAddWordDialog] = useState(false)
  const [showAddCustomWordDialog, setShowAddCustomWordDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showEditWordDialog, setShowEditWordDialog] = useState(false)
  const [wordToEdit, setWordToEdit] = useState<Word | null>(null)

  // Edit List State
  const [listDetailsToEdit, setListDetailsToEdit] = useState({ 
    name: "", 
    description: "", 
    isPublic: false 
  });

  // --- Effects ---

  // Load custom list from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      setIsLoading(true);
      const lists = getAllLists(); // Assumes getAllLists is correctly implemented in vocabulary-utils
      const foundList = lists.find((list) => list.id === id);

      if (foundList) {
        setList(foundList);
        setListDetailsToEdit({ name: foundList.name, description: foundList.description || "", isPublic: !!foundList.isPublic });
      } else {
        toast({
          title: "List Not Found",
          description: "The requested vocabulary list could not be found. Redirecting...",
          variant: "destructive",
        });
        router.push("/vocabulary");
      }
      setIsLoading(false);
    } else if (!id && typeof window !== 'undefined') {
        console.error("List ID is missing.");
        toast({ title: "Error", description: "List ID is missing in the URL.", variant: "destructive" });
        router.push("/vocabulary");
        setIsLoading(false);
    }
    // Removed getAllLists from dependency array if it's a stable import function
  }, [id, router, toast]);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoading && !user && id) {
      router.push(`/auth/sign-in?redirect=/vocabulary/custom/${id}`)
    }
  }, [user, router, id, isLoading]);

  // --- Data Filtering (Using useMemo for performance) ---
  const filteredWords = useMemo(() => {
    return list?.words.filter(
      (word) =>
        word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (word.example && word.example.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (word.notes && word.notes.toLowerCase().includes(searchQuery.toLowerCase())) // Include notes in search
    ) ?? []
  }, [list?.words, searchQuery]);


  // --- Event Handlers ---

  // Delete the entire list
  const handleDeleteList = useCallback(() => {
    if (!list || typeof window === 'undefined') return;
    setIsSaving(true);
    try {
        const lists = getAllLists();
        const updatedLists = lists.filter((l) => l.id !== list.id);
        updateLocalStorage(updatedLists); // Assumes updateLocalStorage handles saving
        toast({ title: "List Deleted", description: `The list "${list.name}" has been successfully deleted.` });
        setShowDeleteListDialog(false);
        router.push("/vocabulary");
    } catch (error) {
        console.error("Error deleting list:", error);
        toast({ title: "Error Deleting List", description: "Could not delete the list.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
    // Removed dependencies like getAllLists, updateLocalStorage if they are stable imports
  }, [list, toast, router]);

  // Delete a specific word from the list
  const handleDeleteWord = useCallback(() => {
     if (!wordToDelete || !list || typeof window === 'undefined') return
    setIsSaving(true);
    try {
        const wordToRemove = list.words.find(w => w.id === wordToDelete);
        const updatedWords = list.words.filter((word) => word.id !== wordToDelete)
        const updatedList = { ...list, words: updatedWords }

        setList(updatedList)
        const lists = getAllLists();
        const updatedLists = lists.map((l) => (l.id === list.id ? updatedList : l))
        updateLocalStorage(updatedLists);

        toast({ title: "Word Removed", description: `"${wordToRemove?.german || 'Word'}" removed.` });
        setWordToDelete(null)
        setShowDeleteWordDialog(false)
    } catch (error) {
        console.error("Error deleting word:", error);
        toast({ title: "Error Removing Word", description: "Could not remove the word.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
    // Removed dependencies like getAllLists, updateLocalStorage if they are stable imports
  }, [list, wordToDelete, toast]);

  // Add a word (from library) to the list
  const handleAddWord = useCallback((word: Word) => {
    if (!list || typeof window === 'undefined') return

    if (list.words.some((w) => w.id === word.id)) {
      toast({ title: "Word Already Exists", description: `"${word.german}" is already in this list.`, variant: "default" });
      return
    }
    try {
        const updatedList = { ...list, words: [...list.words, word] }
        setList(updatedList)
        const lists = getAllLists();
        const updatedLists = lists.map((l) => (l.id === list.id ? updatedList : l))
        updateLocalStorage(updatedLists);
        toast({ title: "Word Added", description: `"${word.german}" added from library.` });
    } catch (error) {
        console.error("Error adding word:", error);
        toast({ title: "Error Adding Word", description: "Could not add the word.", variant: "destructive" });
    }
    // Removed dependencies like getAllLists, updateLocalStorage if they are stable imports
  });

  // Add a custom word to the list
  const handleAddCustomWord = useCallback((customWordData: { german: string; english: string; example?: string; category?: string; notes?: string }) => {
    if (!list || !customWordData.german || !customWordData.english || typeof window === 'undefined') {
        toast({ title: "Missing Information", description: "German and English words are required.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    try {
        const customWord: Word = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          german: customWordData.german.trim(),
          english: customWordData.english.trim(),
          example: customWordData.example?.trim() || undefined,
          category: customWordData.category?.trim() || "Custom",
          notes: customWordData.notes?.trim() || undefined,
        }
        const updatedList = { ...list, words: [...list.words, customWord] }
        setList(updatedList)
        const lists = getAllLists();
        const updatedLists = lists.map((l) => (l.id === list.id ? updatedList : l))
        updateLocalStorage(updatedLists);
        toast({ title: "Custom Word Added", description: `"${customWord.german}" added.` });
        setShowAddCustomWordDialog(false)
    } catch (error) {
        console.error("Error adding custom word:", error);
        toast({ title: "Error Adding Custom Word", description: "Could not add the custom word.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
    // Removed dependencies like getAllLists, updateLocalStorage if they are stable imports
  });

  // Update list details
  const handleUpdateListDetails = useCallback(() => {
    if (!list || typeof window === 'undefined') return;
    setIsSaving(true);

    try {
      const updatedList = {
        ...list,
        name: listDetailsToEdit.name,
        description: listDetailsToEdit.description,
        isPublic: listDetailsToEdit.isPublic,
        updatedAt: new Date().toISOString()
      };

      setList(updatedList);
      const lists = getAllLists();
      const updatedLists = lists.map(l => l.id === list.id ? updatedList : l);
      updateLocalStorage(updatedLists);

      // Show success message
      toast({ 
        title: "List Updated", 
        description: `Your list "${updatedList.name}" has been updated.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });
      
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating list:", error);
      toast({ 
        title: "Error Updating List", 
        description: "Could not update list details.", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  }, [list, listDetailsToEdit, toast]);

  // Toggle list public status
  const handleTogglePublic = useCallback(() => {
    if (!list || typeof window === 'undefined') return;
    setIsSaving(true);

    try {
      const updatedList = {
        ...list,
        isPublic: !list.isPublic,
        updatedAt: new Date().toISOString()
      };

      setList(updatedList);
      const lists = getAllLists();
      const updatedLists = lists.map(l => l.id === list.id ? updatedList : l);
      updateLocalStorage(updatedLists);

      // Show success message
      toast({ 
        title: updatedList.isPublic ? "List Made Public" : "List Made Private", 
        description: updatedList.isPublic 
          ? `Your list "${updatedList.name}" is now visible to the community.` 
          : `Your list "${updatedList.name}" is now private.`,
        className: updatedList.isPublic 
          ? "bg-blue-50 border-blue-200 text-blue-800" 
          : "bg-gray-50 border-gray-200 text-gray-800"
      });
    } catch (error) {
      console.error("Error toggling list privacy:", error);
      toast({ 
        title: "Error", 
        description: "Could not update list privacy settings.", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  }, [list, toast]);

  // Set edit form fields when dialog opens
  useEffect(() => {
    if (showEditDialog && list) {
      setListDetailsToEdit({ 
        name: list.name, 
        description: list.description || "",
        isPublic: !!list.isPublic
      });
    }
  }, [showEditDialog, list]);

  // Handler to open the Edit Word dialog
  const handleOpenEditWordDialog = useCallback((word: Word) => {
    setWordToEdit(word);
    setShowEditWordDialog(true);
  }, []);

  // Handler to save the edited word
  const handleSaveEditedWord = useCallback((updatedWord: Word) => {
     if (!list || !updatedWord) return;
     setIsSaving(true);
     try {
        const updatedWords = list.words.map(w => w.id === updatedWord.id ? updatedWord : w);
        const updatedList = { ...list, words: updatedWords };

        setList(updatedList);

        const lists = getAllLists();
        const updatedLists = lists.map(l => (l.id === list.id ? updatedList : l));
        updateLocalStorage(updatedLists);

        toast({ title: "Word Updated", description: `"${updatedWord.german}" saved successfully.` });
        setShowEditWordDialog(false);
        setWordToEdit(null);
     } catch (error) {
        console.error("Error saving edited word:", error);
        toast({ title: "Error Saving Word", description: "Could not save changes to the word.", variant: "destructive" });
     } finally {
        setIsSaving(false);
     }
     // Removed dependencies like getAllLists, updateLocalStorage if they are stable imports
  });

  // Export the list in various formats
  const handleExportList = useCallback((format: 'json' | 'csv' | 'tsv' | 'txt' | 'md' | 'pdf' | 'docx') => {
    if (!list) return;
    exportListData(list, format, toast);
  }, [list, toast]);

  // Import a list from JSON, CSV, or TSV file (APPEND MODE)
  const handleImportList = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !list) return; // Ensure list is loaded

    setIsSaving(true);
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      let importedWords: Word[] = [];
      let importedListName = list.name; // Keep original list name by default

      try {
        // --- Parse file content based on extension ---
        if (fileExtension === 'json') {
          const importedData = JSON.parse(content);
          if (importedData && Array.isArray(importedData.words)) {
            // Basic validation
            importedWords = importedData.words;
            if (importedData.name) {
              importedListName = importedData.name;
            }
          } else {
             throw new Error("Invalid JSON format. Expected 'words' (array).");
          }
        } else if (fileExtension === 'csv' || fileExtension === 'tsv') {
          const delimiter = fileExtension === 'csv' ? ',' : '\t';
          const lines = content.trim().split('\n');
          if (lines.length < 1) throw new Error(`Invalid ${fileExtension.toUpperCase()} format. At least one data row required.`);

          // Try to detect header, otherwise assume no header
          const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
          const germanIndex = headers.indexOf('german');
          const englishIndex = headers.indexOf('english');
          const hasHeader = germanIndex !== -1 && englishIndex !== -1;
          const dataLines = hasHeader ? lines.slice(1) : lines;

          const exampleIndex = headers.indexOf('example');
          const categoryIndex = headers.indexOf('category');
          const notesIndex = headers.indexOf('notes');

          importedWords = dataLines.map((line, index) => {
            const values = line.split(delimiter);
            // Adjust indices if no header was detected
            const currentGermanIndex = hasHeader ? germanIndex : 0;
            const currentEnglishIndex = hasHeader ? englishIndex : 1;

            const german = values[currentGermanIndex]?.trim();
            const english = values[currentEnglishIndex]?.trim();

            if (!german || !english) return null;

            return {
              id: `imported-${fileExtension}-${Date.now()}-${index}`,
              german,
              english,
              example: hasHeader && exampleIndex > -1 ? values[exampleIndex]?.trim() || undefined : undefined,
              category: hasHeader && categoryIndex > -1 ? values[categoryIndex]?.trim() || "Custom" : "Custom",
              notes: hasHeader && notesIndex > -1 ? values[notesIndex]?.trim() || undefined : undefined,
            };
          }).filter((word): word is Word => word !== null);

        } else {
          throw new Error(`Unsupported file type: .${fileExtension}. Please use JSON, CSV, or TSV.`);
        }

        // --- Deduplication ---
        const existingWordKeys = new Set(list.words.map(w => `${w.german.toLowerCase()}|${w.english.toLowerCase()}`));
        const uniqueNewWords = importedWords.reduce((acc, current) => {
            const currentKey = `${current.german.toLowerCase()}|${current.english.toLowerCase()}`;
            const existsInAcc = acc.some(item => `${item.german.toLowerCase()}|${item.english.toLowerCase()}` === currentKey);
            const existsInList = existingWordKeys.has(currentKey);

            if (!existsInAcc && !existsInList) {
                // Basic validation for imported word structure
                if (current && typeof current.german === 'string' && typeof current.english === 'string') {
                    acc.push({
                        id: current.id || `imported-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Ensure ID exists
                        german: current.german,
                        english: current.english,
                        example: current.example,
                        category: current.category,
                        notes: current.notes,
                    });
                } else {
                    console.warn("Skipping invalid word structure during import:", current);
                }
            } else {
                 console.warn(`Duplicate word found during import and skipped: "${current.german}" / "${current.english}"`);
            }
            return acc;
        }, [] as Word[]);
        // --- End Deduplication ---

        if (uniqueNewWords.length === 0) {
             toast({
                title: "No New Words Imported",
                description: `All words from the file already exist in the list or were duplicates/invalid.`,
                variant: "default",
            });
            setShowImportDialog(false);
            return;
        }

        // --- Append new words to the existing list ---
        const updatedList: CustomList = {
          ...list,
          words: [...list.words, ...uniqueNewWords],
        };

        setList(updatedList);

        const lists = getAllLists();
        const updatedLists = lists.map(l => l.id === list.id ? updatedList : l);
        updateLocalStorage(updatedLists);

        toast({
          title: "Import Successful",
          description: `${uniqueNewWords.length} new word(s) added to the list "${list.name}" from ${file.name}.`,
        });
        setShowImportDialog(false);

      } catch (error) {
        console.error('Error parsing or validating imported file:', error);
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Could not read or process the file.",
          variant: "destructive",
        });
      } finally {
        if (event.target) event.target.value = '';
        setIsSaving(false);
      }
    };

    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
        if (event.target) event.target.value = '';
        setIsSaving(false);
    }
    reader.readAsText(file);
    // Removed dependencies like getAllLists, updateLocalStorage if they are stable imports
  });


  // Pronounce word
  const pronounceWord = useCallback((text: string, lang: string = 'de-DE') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onerror = (event) => {
          console.error('SpeechSynthesisUtterance.onerror', event);
          toast({ title: "Pronunciation Error", description: "Could not pronounce the word.", variant: "destructive" });
      };
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: "Unsupported Feature", description: "Text-to-speech is not supported.", variant: "destructive" });
    }
  }, [toast]);

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!list) {
      return (
          <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-muted-foreground mb-4">List not found or failed to load.</p>
              <Button onClick={() => router.push("/vocabulary")}>
                  Go to Vocabulary
              </Button>
          </div>
      );
  }

  const editListDialog = (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit List Details</DialogTitle>
          <DialogDescription>
            Update the name and description for your list
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={listDetailsToEdit.name}
              onChange={(e) => setListDetailsToEdit({...listDetailsToEdit, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={listDetailsToEdit.description}
              onChange={(e) => setListDetailsToEdit({...listDetailsToEdit, description: e.target.value})}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-isPublic" className="text-right">
              Sharing
            </Label>
            <div className="flex flex-col space-y-1.5 col-span-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isPublic"
                  checked={listDetailsToEdit.isPublic}
                  onCheckedChange={(checked) => setListDetailsToEdit({...listDetailsToEdit, isPublic: checked})}
                />
                <Label htmlFor="edit-isPublic" className="font-normal">
                  Share this list publicly
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                {listDetailsToEdit.isPublic 
                  ? "This list will be visible to other users in the community." 
                  : "This list will only be visible to you."}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowEditDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateListDetails} 
            disabled={!listDetailsToEdit.name.trim() || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Removed unused notification div */}
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/vocabulary")} className="mb-6 -ml-4 gap-1 px-2 hover:bg-transparent text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Vocabulary
        </Button>

        {/* Header Section */}
        <ListHeader
          list={list}
          onAddCustomWord={() => setShowAddCustomWordDialog(true)}
          onAddFromLibrary={() => setShowAddWordDialog(true)}
          onDeleteList={() => setShowDeleteListDialog(true)}
          onEditList={() => {
            setListDetailsToEdit({ name: list.name, description: list.description || "", isPublic: !!list.isPublic });
            setShowEditDialog(true);
          }}
          onTogglePublic={handleTogglePublic}
          onExportList={(format) => handleExportList(format)}
          onImportList={() => setShowImportDialog(true)}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder={`Search ${list.words.length} words (incl. notes)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* List Content */}
        {list.words.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                This list is empty
              </p>
              <p className="text-muted-foreground mb-6">
                Add words from the library or create your own custom entries.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button variant="default" onClick={() => setShowAddCustomWordDialog(true)}>
                   Add Custom Word
                </Button>
                <Button variant="outline" onClick={() => setShowAddWordDialog(true)}>
                   Add From Library
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <WordTable
            words={filteredWords}
            searchQuery={searchQuery}
            onDeleteWord={(wordId) => {
              setWordToDelete(wordId)
              setShowDeleteWordDialog(true)
            }}
            onPronounceWord={pronounceWord}
            onEditWord={handleOpenEditWordDialog}
          />
        )}
      </div>

      {/* --- Dialogs --- */}

      {/* Delete LIST confirmation dialog */}
      <Dialog open={showDeleteListDialog} onOpenChange={setShowDeleteListDialog}>
         <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete the list "{list.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowDeleteListDialog(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteList} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete WORD confirmation dialog */}
      <Dialog open={showDeleteWordDialog} onOpenChange={setShowDeleteWordDialog}>
         <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Word</DialogTitle>
            <DialogDescription>
                Are you sure you want to remove "{list.words.find(w => w.id === wordToDelete)?.german}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => { setWordToDelete(null); setShowDeleteWordDialog(false); }} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWord} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remove Word
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit list details dialog */}
      {editListDialog}

      {/* Import list dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
         <DialogContent>
          <DialogHeader>
            <DialogTitle>Import & Add Words</DialogTitle>
            <DialogDescription>
              Add words to the list "{list.name}" from a JSON, CSV, or TSV file. Duplicates will be skipped.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="import-file" className="sr-only">Choose file</Label>
            <Input
              id="import-file"
              type="file"
              accept=".json,.csv,.tsv,application/json,text/csv,text/tab-separated-values"
              onChange={handleImportList}
              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              disabled={isSaving || !list}
            />
            {isSaving && <p className="text-sm text-muted-foreground mt-2 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing file...</p>}
            <p className="text-xs text-muted-foreground mt-2">Note: Words already present in the list (based on German/English pair) will be skipped. Required CSV/TSV columns: 'german', 'english'. Optional: 'example', 'category', 'notes'.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)} disabled={isSaving}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Word From Library Dialog */}
      <AddWordDialog
        open={showAddWordDialog}
        onOpenChange={setShowAddWordDialog}
        onAddWord={handleAddWord}
        allVocabularyCategories={allVocabularyCategories}
      />

      {/* Add Custom Word Dialog */}
      <AddCustomWordDialog
        open={showAddCustomWordDialog}
        onOpenChange={setShowAddCustomWordDialog}
        onAddCustomWord={handleAddCustomWord}
        isSaving={isSaving}
      />

      {/* Edit Word Dialog */}
      <EditWordDialog
        word={wordToEdit}
        open={showEditWordDialog}
        onOpenChange={setShowEditWordDialog}
        onSaveWord={handleSaveEditedWord}
        isSaving={isSaving}
      />

    </div>
  );
}