"use client"

import { useState, useCallback } from 'react';
import { Word, CustomList } from '@/types/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { getAllLists, updateLocalStorage } from '@/lib/vocabulary-utils';

/**
 * Hook for managing word operations in vocabulary lists
 */
export function useWordOperations() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Add a word to a vocabulary list
   */
  const addWord = useCallback((listId: string, word: Omit<Word, 'id'>): boolean => {
    setIsSaving(true);
    try {
      const lists = getAllLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        toast({
          title: "Error",
          description: "List not found",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      // Check for duplicates
      const isDuplicate = lists[listIndex].words.some(w => 
        w.german.toLowerCase() === word.german.toLowerCase() && 
        w.english.toLowerCase() === word.english.toLowerCase()
      );
      
      if (isDuplicate) {
        toast({
          title: "Duplicate Word",
          description: `"${word.german}" already exists in this list.`
        });
        setIsSaving(false);
        return false;
      }
      
      // Create word with ID
      const wordToAdd: Word = {
        ...word,
        id: `word_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      };
      
      // Update list
      const updatedList = {...lists[listIndex]};
      updatedList.words = [...updatedList.words, wordToAdd];
      updatedList.updatedAt = new Date().toISOString();
      
      lists[listIndex] = updatedList;
      updateLocalStorage(lists);
      
      toast({
        title: "Word Added",
        description: `"${word.german}" has been added to the list.`
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error adding word:", error);
      toast({
        title: "Error",
        description: "Failed to add word to list",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  }, [toast]);

  /**
   * Update a word in a vocabulary list
   */
  const updateWord = useCallback((listId: string, wordId: string, updates: Partial<Word>): boolean => {
    setIsSaving(true);
    try {
      const lists = getAllLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        toast({
          title: "Error",
          description: "List not found",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      const wordIndex = lists[listIndex].words.findIndex(word => word.id === wordId);
      
      if (wordIndex === -1) {
        toast({
          title: "Error",
          description: "Word not found in this list",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      // Create updated word
      const updatedWord = {
        ...lists[listIndex].words[wordIndex],
        ...updates
      };
      
      // Update list
      const updatedList = {...lists[listIndex]};
      updatedList.words = [
        ...updatedList.words.slice(0, wordIndex),
        updatedWord,
        ...updatedList.words.slice(wordIndex + 1)
      ];
      updatedList.updatedAt = new Date().toISOString();
      
      lists[listIndex] = updatedList;
      updateLocalStorage(lists);
      
      toast({
        title: "Word Updated",
        description: `"${updatedWord.german}" has been updated.`
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error updating word:", error);
      toast({
        title: "Error",
        description: "Failed to update word",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  }, [toast]);

  /**
   * Delete a word from a vocabulary list
   */
  const deleteWord = useCallback((listId: string, wordId: string): boolean => {
    setIsSaving(true);
    try {
      const lists = getAllLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        toast({
          title: "Error",
          description: "List not found",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      const wordToDelete = lists[listIndex].words.find(word => word.id === wordId);
      
      if (!wordToDelete) {
        toast({
          title: "Error",
          description: "Word not found in this list",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      // Update list
      const updatedList = {...lists[listIndex]};
      updatedList.words = updatedList.words.filter(word => word.id !== wordId);
      updatedList.updatedAt = new Date().toISOString();
      
      lists[listIndex] = updatedList;
      updateLocalStorage(lists);
      
      toast({
        title: "Word Removed",
        description: `"${wordToDelete.german}" has been removed from the list.`
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error deleting word:", error);
      toast({
        title: "Error",
        description: "Failed to delete word",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  }, [toast]);

  /**
   * Move multiple words from one list to another
   */
  const moveWords = useCallback((sourceListId: string, targetListId: string, wordIds: string[]): boolean => {
    if (sourceListId === targetListId) return true; // No need to move if same list
    
    setIsSaving(true);
    try {
      const lists = getAllLists();
      const sourceListIndex = lists.findIndex(list => list.id === sourceListId);
      const targetListIndex = lists.findIndex(list => list.id === targetListId);
      
      if (sourceListIndex === -1 || targetListIndex === -1) {
        toast({
          title: "Error",
          description: "Source or target list not found",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      // Get words to move
      const wordsToMove = lists[sourceListIndex].words.filter(word => wordIds.includes(word.id));
      
      if (wordsToMove.length === 0) {
        toast({
          title: "Error",
          description: "No words found to move",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      // Check for duplicates in target list
      const duplicateWords = wordsToMove.filter(word => 
        lists[targetListIndex].words.some(targetWord => 
          targetWord.german.toLowerCase() === word.german.toLowerCase() && 
          targetWord.english.toLowerCase() === word.english.toLowerCase()
        )
      );
      
      // Remove words from source list
      const updatedSourceList = {...lists[sourceListIndex]};
      updatedSourceList.words = updatedSourceList.words.filter(word => !wordIds.includes(word.id));
      updatedSourceList.updatedAt = new Date().toISOString();
      
      // Add words to target list (excluding duplicates)
      const updatedTargetList = {...lists[targetListIndex]};
      const wordsToAdd = wordsToMove.filter(word => 
        !duplicateWords.some(dupWord => dupWord.id === word.id)
      );
      
      updatedTargetList.words = [...updatedTargetList.words, ...wordsToAdd];
      updatedTargetList.updatedAt = new Date().toISOString();
      
      // Update lists in storage
      lists[sourceListIndex] = updatedSourceList;
      lists[targetListIndex] = updatedTargetList;
      updateLocalStorage(lists);
      
      // Show appropriate toast
      if (duplicateWords.length > 0) {
        toast({
          title: "Words Moved Partially",
          description: `${wordsToAdd.length} words moved. ${duplicateWords.length} duplicates skipped.`
        });
      } else {
        toast({
          title: "Words Moved",
          description: `${wordsToAdd.length} words moved to "${lists[targetListIndex].name}".`
        });
      }
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error moving words:", error);
      toast({
        title: "Error",
        description: "Failed to move words between lists",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  }, [toast]);

  return {
    addWord,
    updateWord,
    deleteWord,
    moveWords,
    isSaving
  };
} 