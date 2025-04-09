"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SimpleVerifyPage() {
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setVerifying(false)
        setError("Invalid verification link. Missing token or email.")
        return
      }

      try {
        const response = await fetch("/api/newsletter/simple-verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Verification failed")
        }

        // Store access in localStorage
        localStorage.setItem("newsletter_access", "true")
        localStorage.setItem("newsletter_email", email)

        setVerified(true)
      } catch (error: any) {
        console.error("Verification error:", error)
        setError(error.message || "Failed to verify your email address")
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token, email])

  if (verifying) {
    return (
      <div className="container max-w-md mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-center">Verification Failed</CardTitle>
            <CardDescription className="text-center">We couldn't verify your email address</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p>Please try signing up again or contact support if the problem persists.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-center">Email Verified!</CardTitle>
            <CardDescription className="text-center">Your email has been verified successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You now have full access to all videos and learning tools.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/videos">Explore Videos</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Verification Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Something went wrong during the verification process.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
