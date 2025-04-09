"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface AuthCheckProps {
  children: React.ReactNode
  requireVerification?: boolean
}

export function AuthCheck({ children, requireVerification = true }: AuthCheckProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/sign-in")
      } else if (requireVerification && !user.emailVerified) {
        router.push("/auth/verify-email")
      }
    }
  }, [user, loading, router, requireVerification])

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not authenticated or not verified (when required), don't render children
  if (!user || (requireVerification && !user.emailVerified)) {
    return null
  }

  // User is authenticated and verified (if required)
  return <>{children}</>
}
