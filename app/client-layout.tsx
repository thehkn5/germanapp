"use client"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { AdminProvider } from "@/contexts/admin-context"
import { AuthProvider } from "@/contexts/auth-context"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClientRouterProvider } from "./client-router-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

/**
 * ClientLayout is used to wrap the entire application.
 * It provides context for authentication, theme, and admin functionality.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const providers = (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <ClientRouterProvider>
            {mounted ? (
              <div className={cn("flex min-h-screen flex-col", inter.className)} suppressHydrationWarning>
                <header className="sticky top-0 z-50 w-full border-b bg-background">
                  <div className="container flex h-16 items-center justify-between">
                    <MainNav />
                    <div className="flex items-center gap-4">
                      <ThemeToggle />
                      <UserNav />
                    </div>
                  </div>
                </header>
                <main className="flex-1">
                  {children}
                </main>
                <footer className="border-t py-6">
                  <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-center text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} German Learning App. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                      <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                        About
                      </Link>
                      <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
                        Features
                      </Link>
                    </div>
                  </div>
                </footer>
              </div>
            ) : null}
          </ClientRouterProvider>
        </AdminProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )

  return providers
}
