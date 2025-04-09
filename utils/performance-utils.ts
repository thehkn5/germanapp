import type React from "react"
// Utility functions for performance optimization

// Throttle function to limit how often a function can be called
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return function (this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  }
}

// Memoize function to cache results of expensive function calls
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map()

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func.apply(this, args)
    cache.set(key, result)
    return result
  } as T
}

// Image preloading function
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.crossOrigin = "anonymous"
    img.src = src
  })
}

// Batch DOM updates to reduce layout thrashing
export function batchDOMUpdates(updates: (() => void)[]): void {
  // Request animation frame to batch updates
  requestAnimationFrame(() => {
    // Force a style recalculation
    document.body.getBoundingClientRect()

    // Apply all updates
    updates.forEach((update) => update())
  })
}

// Detect if the device is a mobile device
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}

// Optimize rendering of large lists
export function optimizeListRendering<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  itemHeight = 50,
  overscan = 5,
): {
  containerStyle: React.CSSProperties
  renderedItems: React.ReactNode[]
} {
  if (typeof window === "undefined") {
    // Server-side rendering fallback
    return {
      containerStyle: {},
      renderedItems: items.map(renderItem),
    }
  }

  const viewportHeight = window.innerHeight
  const totalHeight = items.length * itemHeight
  const scrollTop = window.scrollY

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan)

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const renderedItems = visibleItems.map((item, index) => renderItem(item, startIndex + index))

  const containerStyle: React.CSSProperties = {
    height: `${totalHeight}px`,
    position: "relative",
  }

  return {
    containerStyle,
    renderedItems,
  }
}
