"use client"

import { useState, useCallback } from "react"

// This hook optimizes state updates by memoizing the setter function
export function useOptimizedState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState)

  // Memoize the setter function to prevent unnecessary re-renders
  const optimizedSetState = useCallback((value: T | ((prev: T) => T)) => {
    setState(value)
  }, [])

  return [state, optimizedSetState]
}

// This hook is similar to useState but with deep comparison for objects
export function useDeepState<T extends object>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState)

  const setDeepState = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newState = typeof value === "function" ? (value as (prev: T) => T)(prev) : value

      // Only update if there's an actual change (deep comparison)
      if (JSON.stringify(prev) !== JSON.stringify(newState)) {
        return newState
      }
      return prev
    })
  }, [])

  return [state, setDeepState]
}
