"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Brain, ChevronLeft, FlaskConical, Timer, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface VideoNavigationProps {
  video: any
}

export function VideoNavigation({ video }: VideoNavigationProps) {
  const { user } = useAuth()

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/videos")} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Videos
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {user ? (
          // Show learning tools for authenticated users
          <div className="flex flex-wrap">
            <a
              href={`/videos/${video.id}/quiz`}
              className="rounded-none h-12 flex-1 gap-2 border-r flex items-center justify-center hover:bg-gray-100"
            >
              <Brain className="h-4 w-4" />
              <span>Quiz</span>
            </a>

            <a
              href={`/videos/${video.id}/exercises`}
              className="rounded-none h-12 flex-1 gap-2 border-r flex items-center justify-center hover:bg-gray-100"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Exercises</span>
            </a>

            <a
              href={`/videos/${video.id}/flashcards`}
              className="rounded-none h-12 flex-1 gap-2 border-r flex items-center justify-center hover:bg-gray-100"
            >
              <BookOpen className="h-4 w-4" />
              <span>Flashcards</span>
            </a>

            <a
              href={`/videos/${video.id}/practice`}
              className="rounded-none h-12 flex-1 gap-2 flex items-center justify-center hover:bg-gray-100"
            >
              <Timer className="h-4 w-4" />
              <span>Practice</span>
            </a>
          </div>
        ) : (
          // Show sign-in prompt for unauthenticated users
          <div className="p-4 text-center">
            <p className="mb-3">Sign in to access quizzes, exercises, flashcards, and practice tools</p>
            <div className="flex justify-center">
              <a href="/auth/sign-in">
                <Button className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In to Access Learning Tools
                </Button>
              </a>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium text-green-600">100% Free</span> - Create an account to unlock all learning
              tools
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
