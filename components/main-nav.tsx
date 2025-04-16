"use client"

import { BookOpen, Video, Info, Globe, Map, Pencil, BarChart2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function MainNav() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6 overflow-x-auto">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/") && "text-primary",
        )}
      >
        Home
      </Link>
      <Link
        href="/videos"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          isActive("/videos") && "text-primary"
        }`}
      >
        <Video className="h-4 w-4" />
        Videos
      </Link>
      <Link
        href="/vocabulary"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          isActive("/vocabulary") && "text-primary"
        }`}
      >
        <BookOpen className="h-4 w-4" />
        Vocabulary
      </Link>
      <Link
        href="/community"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          isActive("/community") && "text-primary",
        )}
      >
        <Globe className="h-4 w-4" />
        Community
      </Link>
      {user && (
        <>
          <Link
            href="/goal-center"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
              (isActive("/goal-center") || isActive("/roadmap")) && "text-primary",
            )}
          >
            <BarChart2 className="h-4 w-4" />
            Goal Center
          </Link>
        </>
      )}
      <Link
        href="/exercises"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          isActive("/exercises") && "text-primary"
        }`}
      >
        <Pencil className="h-4 w-4" />
        Exercises
      </Link>
      <Link
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap",
          (isActive("/about") || isActive("/features")) && "text-primary",
        )}
      >
        <Info className="h-4 w-4" />
        About
      </Link>
    </nav>
  )
}
