"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // If user is not logged in, redirect to sign in
    if (!user) {
      router.push("/auth/sign-in")
    }
    // If user is verified, redirect to videos
    else if (user.emailVerified) {
      router.push("/videos")
    }
  }, [user, router])

  const handleResendVerification = async () => {
    try {
      setLoading(true)
      setError(null)
      await sendVerificationEmail()
      setEmailSent(true)
    } catch (error: any) {
      console.error("Error sending verification email:", error)
      setError(error.message || "Failed to send verification email")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Please verify your email address to access all features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {emailSent && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>Verification email sent! Please check your inbox.</AlertDescription>
            </Alert>
          )}

          <div className="text-center py-4">
            <Mail className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="mb-2">
              We've sent a verification email to <strong>{user.email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to verify your account and access all learning materials.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleResendVerification} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
