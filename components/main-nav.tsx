"use client"

import { BookOpen, Video, Info, Sparkles, LineChart, Target } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6 overflow-x-auto">
      <a
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/") && "text-primary",
        )}
      >
        Home
      </a>
      <a
        href="/videos"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/videos") && "text-primary",
        )}
      >
        <Video className="h-4 w-4" />
        Video Library
      </a>
      <a
        href="/vocabulary"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/vocabulary") && "text-primary",
        )}
      >
        <BookOpen className="h-4 w-4" />
        Vocabulary
      </a>
      {user && (
        <>
          <a
            href="/progress"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
              isActive("/progress") && "text-primary",
            )}
          >
            <LineChart className="h-4 w-4" />
            My Progress
          </a>
          <a
            href="/goals"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
              isActive("/goals") && "text-primary",
            )}
          >
            <Target className="h-4 w-4" />
            Goal Center
          </a>
        </>
      )}
      <a
        href="/features"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/features") && "text-primary",
        )}
      >
        <Sparkles className="h-4 w-4" />
        Features
      </a>
      <a
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/about") && "text-primary",
        )}
      >
        <Info className="h-4 w-4" />
        About
      </a>
    </nav>
  )
}
