import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sorts an array of items by moving an item from one position to another
 * @param items The array of items to sort
 * @param activeIndex The current index of the item being moved
 * @param overIndex The index where the item should be moved to
 * @returns A new array with the item moved to the new position
 */
export function arrayMove<T>(items: T[], activeIndex: number, overIndex: number): T[] {
  const newItems = [...items]
  const [movedItem] = newItems.splice(activeIndex, 1)
  newItems.splice(overIndex, 0, movedItem)
  return newItems
}

/**
 * Returns color hex code based on priority level
 * @param priority The priority level (high, medium, low)
 * @returns The color hex code for the priority
 */
export function getPriorityColor(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high":
      return "#ef4444" // red-500
    case "medium":
      return "#f59e0b" // amber-500
    case "low":
      return "#3b82f6" // blue-500
    default:
      return "#6b7280" // gray-500
  }
}

/**
 * Returns color hex code based on type
 * @param type The type (vocabulary, grammar, speaking, review, milestone)
 * @returns The color hex code for the type
 */
export function getTypeColor(type: "vocabulary" | "grammar" | "speaking" | "review" | "milestone"): string {
  switch (type) {
    case "vocabulary":
      return "#3b82f6" // blue-500
    case "grammar":
      return "#8b5cf6" // purple-500
    case "speaking":
      return "#22c55e" // green-500
    case "review":
      return "#f59e0b" // amber-500
    case "milestone":
      return "#ef4444" // red-500
    default:
      return "#6b7280" // gray-500
  }
} 