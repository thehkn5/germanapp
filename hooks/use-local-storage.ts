"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Get from local storage by key
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Previous key ref to detect key changes
  const previousKeyRef = useRef(key)
  
  // Store the current value in a ref to avoid dependency issues
  const storedValueRef = useRef(storedValue)
  
  // Update the ref whenever storedValue changes
  useEffect(() => {
    storedValueRef.current = storedValue
  }, [storedValue])

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValueRef.current) : value

        // Save to state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key] // Remove storedValue dependency
  )

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return

    // Only run this effect if the key changes
    if (previousKeyRef.current !== key) {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}" in effect:`, error)
      }
      previousKeyRef.current = key
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue]
}
