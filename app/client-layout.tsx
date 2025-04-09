"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useEffect, useState, useMemo, Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminProvider } from "@/contexts/admin-context"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClientRouterProvider } from "@/lib/client-router"
import { ProgressProvider } from "@/contexts/progress-context"
import { PomodoroProvider, usePomodoro } from "@/contexts/pomodoro-context"
import { MiniTimer } from "@/components/pomodoro/mini-timer"
import { Loader2 } from "lucide-react"
import { RoadmapProvider } from "@/contexts/roadmap-context"
import { QuizProvider } from "@/contexts/quiz-context"

const inter = Inter({ subsets: ["latin"] })

// Lazy loading components
const LazyComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// Mini Timer Wrapper
const MiniTimerWrapper = () => {
  return <MiniTimer />
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  // Only show the UI after first render to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize the providers to prevent unnecessary re-renders
  const providers = useMemo(
    () => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AdminProvider>
            <ProgressProvider>
              <PomodoroProvider>
                <RoadmapProvider>
                  <QuizProvider>
                    <ClientRouterProvider>
                  {mounted ? (
                    <div className="flex min-h-screen flex-col">
                      <header className="border-b sticky top-0 z-50 bg-background">
                        <div className="container flex h-16 items-center justify-between">
                          <MainNav />
                          <div className="flex items-center gap-4">
                            <MiniTimerWrapper />
                            <ThemeToggle />
                            <UserNav />
                          </div>
                        </div>
                      </header>
                      <main className="flex-1">
                        <LazyComponent>{children}</LazyComponent>
                      </main>
                      <footer className="border-t py-6">
                        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                          <p className="text-center text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} German Learning Video Platform. All rights reserved.
                          </p>
                        </div>
                      </footer>
                    </div>
                  ) : (
                    <div className="flex min-h-screen items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                    </ClientRouterProvider>
                  </QuizProvider>
                </RoadmapProvider>
              </PomodoroProvider>
            </ProgressProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    ),
    [children, mounted],
  )

  return <div className={inter.className}>{providers}</div>
}
