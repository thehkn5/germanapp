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
