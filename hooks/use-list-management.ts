"use client"

import { useState, useCallback } from 'react';
import { CustomList } from '@/types/vocabulary';
import { useToast } from '@/hooks/use-toast';
import { getAllLists, updateLocalStorage } from '@/lib/vocabulary-utils';

/**
 * Hook for managing vocabulary list operations
 */
export function useListManagement() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Create a new vocabulary list
   */
  const createList = useCallback((newList: Omit<CustomList, 'id'>): string => {
    setIsSaving(true);
    try {
      const lists = getAllLists();
      const id = `list_${Date.now()}`;
      
      const listToSave: CustomList = {
        ...newList,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        words: newList.words || []
      };
      
      const updatedLists = [...lists, listToSave];
      updateLocalStorage(updatedLists);
      
      toast({
        title: "List Created",
        description: `"${newList.name}" has been created successfully.`
      });
      
      setIsSaving(false);
      return id;
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        title: "Error",
        description: "Failed to create vocabulary list",
        variant: "destructive"
      });
      setIsSaving(false);
      return '';
    }
  }, [toast]);

  /**
   * Update an existing vocabulary list
   */
  const updateList = useCallback((listId: string, updates: Partial<CustomList>): boolean => {
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
      
      const updatedList = {
        ...lists[listIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      lists[listIndex] = updatedList;
      updateLocalStorage(lists);
      
      toast({
        title: "List Updated",
        description: `"${updatedList.name}" has been updated.`
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error updating list:", error);
      toast({
        title: "Error",
        description: "Failed to update vocabulary list",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  }, [toast]);

  /**
   * Delete a vocabulary list
   */
  const deleteList = useCallback((listId: string): boolean => {
    setIsSaving(true);
    try {
      const lists = getAllLists();
      const listToDelete = lists.find(list => list.id === listId);
      
      if (!listToDelete) {
        toast({
          title: "Error",
          description: "List not found",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      const updatedLists = lists.filter(list => list.id !== listId);
      updateLocalStorage(updatedLists);
      
      toast({
        title: "List Deleted",
        description: `"${listToDelete.name}" has been deleted.`
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        title: "Error",
        description: "Failed to delete vocabulary list",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  }, [toast]);

  return {
    createList,
    updateList,
    deleteList,
    isSaving
  };
} 