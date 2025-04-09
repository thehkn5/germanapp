"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useVideoData } from "@/hooks/use-video-data"
import { AuthCheck } from "@/components/auth-check"
import { RoadmapForm } from "@/components/roadmap/roadmap-form"
import { useRouter } from "next/navigation"
import { LazyLoad } from "@/components/lazy-load"

// Helper function to get custom vocabulary lists
const getCustomVocabularyLists = () => {
  if (typeof window === "undefined") return []

  try {
    const storedLists = localStorage.getItem("custom_vocabulary_lists")
    return storedLists ? JSON.parse(storedLists) : []
  } catch (error) {
    console.error("Error loading vocabulary lists:", error)
    return []
  }
}

export default function RoadmapPage() {
  const { user } = useAuth()
  const { videos, loading: videosLoading } = useVideoData()
  const router = useRouter()

  // Use state for vocabulary lists to avoid localStorage in render
  const [vocabularyLists, setVocabularyLists] = useState<any[]>([])

  // Load vocabulary lists once on component mount
  useEffect(() => {
    setVocabularyLists(getCustomVocabularyLists())
  }, [])

  // Handle form completion
  const handleFormComplete = () => {
    router.push("/goals")
  }

  // Handle form cancellation
  const handleFormCancel = () => {
    router.push("/goals")
  }

  // Memoize the form component to prevent unnecessary re-renders
  const roadmapForm = useMemo(
    () => (
      <RoadmapForm
        videos={videos}
        vocabularyLists={vocabularyLists}
        onComplete={handleFormComplete}
        onCancel={handleFormCancel}
      />
    ),
    [videos, vocabularyLists],
  )

  return (
    <AuthCheck>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <LazyLoad>
          {videosLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            roadmapForm
          )}
        </LazyLoad>
      </div>
    </AuthCheck>
  )
}
