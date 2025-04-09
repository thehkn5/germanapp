"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, Lock, LineChartIcon as ChartLineUp } from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user, updateUserProfile } = useAuth()

  useEffect(() => {
    // Initialize display name from user profile when user data is loaded
    if (user?.displayName) {
      setDisplayName(user.displayName)
    } else if (user?.email) {
      setDisplayName(user.email.split("@")[0])
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!displayName.trim()) {
      setError("Display name cannot be empty")
      return
    }

    try {
      setLoading(true)
      await updateUserProfile(displayName)
      setSuccess(true)
    } catch (error: any) {
      console.error("Profile update error:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCheck>
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>View and update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                <AlertDescription>Your profile has been updated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center py-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  placeholder={user?.displayName || user?.email?.split("@")[0] || ""}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button variant="outline" asChild className="w-full">
              <Link href="/profile/settings">
                <Lock className="mr-2 h-4 w-4" />
                Manage Account Settings
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/profile/progress">
                <ChartLineUp className="mr-2 h-4 w-4" />
                View Learning Progress
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthCheck>
  )
}
