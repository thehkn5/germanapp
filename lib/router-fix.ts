/**
 * This is a utility to fix routing issues by using direct navigation
 * instead of Next.js router when needed
 */

export function navigateTo(path: string) {
  // Use direct navigation to avoid routing issues
  window.location.href = path
}

export function createHref(path: string): string {
  // Ensure path starts with a slash
  if (!path.startsWith("/")) {
    path = "/" + path
  }
  return path
}
