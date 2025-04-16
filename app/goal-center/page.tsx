"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import RoadmapView from "./roadmap/roadmap-view"
import GoalsView from "./goals/goals-view"
import ProgressView from "./progress/progress-view"
import PomodoroView from "./pomodoro/pomodoro-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GoalCenterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "roadmap"
  
  const handleTabChange = (value: string) => {
    // Update URL with tab parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.push(`/goal-center?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Goal Center</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress, manage roadmaps, and achieve your learning goals
        </p>
      </div>
      
      <Tabs 
        defaultValue={defaultTab} 
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex justify-center">
            <TabsList className="w-full max-w-xl mx-auto justify-center">
              <TabsTrigger 
                value="roadmap" 
                className="flex-1 font-medium transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Roadmap
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className="flex-1 font-medium transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Goals
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="flex-1 font-medium transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger 
                value="pomodoro" 
                className="flex-1 font-medium transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Pomodoro
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="roadmap" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <RoadmapView />
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <GoalsView />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <ProgressView />
        </TabsContent>
        
        <TabsContent value="pomodoro" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <PomodoroView />
        </TabsContent>
      </Tabs>
    </div>
  )
} 