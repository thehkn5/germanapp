import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Anonymizes the display name of a user for public sharing
 * @param displayName The user's display name
 * @param userId The user's unique ID
 * @returns An anonymized string that protects the user's identity
 */
export function anonymizeUserInfo(displayName?: string | null, userId?: string): string {
  // If no display name or userId, return a generic anonymous user
  if (!displayName && !userId) return "Anonymous User"
  
  // If we have a userId but no display name, create a consistent pseudonym based on the userId
  if (!displayName && userId) {
    // Take the first 8 characters of the userId
    const shortId = userId.substring(0, 8)
    return `User ${shortId}`
  }
  
  // For display names, keep the first initial followed by •••
  if (displayName) {
    const firstChar = displayName.charAt(0).toUpperCase()
    return `${firstChar}•••`
  }
  
  return "Anonymous User"
}

/**
 * Sanitizes content for public sharing, removing any potential personal information
 * @param content The content to sanitize
 * @returns Sanitized content safe for public sharing
 */
export function sanitizeContentForSharing(content: string): string {
  // Remove email patterns
  content = content.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[email removed]")
  
  // Remove phone number patterns (various formats)
  content = content.replace(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "[phone removed]")
  
  // Remove URLs
  content = content.replace(/(https?:\/\/[^\s]+)/g, "[link removed]")
  
  return content
}
