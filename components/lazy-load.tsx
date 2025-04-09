"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface LazyLoadProps {
  children: ReactNode
  delay?: number // Optional delay before showing loader
  placeholder?: ReactNode // Optional custom placeholder
}

export function LazyLoad({ children, delay = 200, placeholder }: LazyLoadProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    // Set a timeout to show the loader after the delay
    const loaderTimeout = setTimeout(() => {
      if (!isLoaded) {
        setShowLoader(true)
      }
    }, delay)

    // Set a timeout to load the content
    const loadTimeout = setTimeout(() => {
      setIsLoaded(true)
    }, 0)

    return () => {
      clearTimeout(loaderTimeout)
      clearTimeout(loadTimeout)
    }
  }, [delay, isLoaded])

  if (!isLoaded) {
    if (!showLoader) return null

    return (
      placeholder || (
        <div className="flex justify-center items-center p-4 min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    )
  }

  return <>{children}</>
}
