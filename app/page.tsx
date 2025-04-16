"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LibraryIcon, BookOpen, Video, MessageSquare, Target, BookCheck, Trophy, ArrowRight, Map, CheckCircle2, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PersonalizedDashboard } from "@/components/dashboard/personalized-dashboard"

export default function Home() {
  const { user } = useAuth()

  if (user) {
    return <PersonalizedDashboard />
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Learn German in a smarter way
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our app helps you master German with personalized vocabulary lists, interactive videos with transcripts,
                    and a structured roadmap for your learning journey.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/login">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto grid max-w-[350px] gap-4 lg:max-w-none lg:grid-cols-1">
                <div className="grid gap-1">
                  <div className="font-semibold">Key Features</div>
                  <ul className="grid gap-6">
                    <li>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div className="font-semibold">Personalized Vocabulary</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Create and study custom lists tailored to your interests and learning goals
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-primary" />
                          <div className="font-semibold">Interactive Videos</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Watch German videos with interactive transcripts and integrated learning tools
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-primary" />
                          <div className="font-semibold">Learning Roadmap</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Follow a structured path with goals and milestones to track your progress effectively
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <div className="font-semibold">Community Learning</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Share vocabulary lists and learn with other German learners in the community
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
                Ready to improve your German?
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mb-8">
                Join thousands of learners who have accelerated their German language journey with our app.
              </p>
              <Link href="/auth/signup" className="flex items-center">
                <Button size="lg" className="gap-1">
                  Sign Up Now <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
