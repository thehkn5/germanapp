"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function AccessRequiredPage() {
  const router = useRouter()

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center">Sign In Required</CardTitle>
          <CardDescription className="text-center">You need to sign in to access this content</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>To access the learning tools and practice exercises, please sign in with your email address.</p>
          <p className="text-sm text-muted-foreground">
            Your progress will be saved, and you'll be able to track your learning journey.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/sign-in" className="w-full">
            <Button className="w-full gap-2">
              <Mail className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="w-full">
            <Button variant="outline" className="w-full">
              Create an Account
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => router.push("/")} className="w-full">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
