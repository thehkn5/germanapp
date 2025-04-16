"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Import JSON files dynamically
const importVideoData = async () => {
  try {
    const videoFiles = [
      import('@/data/videos/1.json'),
      import('@/data/videos/2.json'),
      import('@/data/videos/3.json'),
      import('@/data/videos/4.json'),
      import('@/data/videos/5.json'),
      import('@/data/videos/6.json')
    ];
    
    const videos = await Promise.all(videoFiles);
    return videos.map(video => video.default);
  } catch (error) {
    console.error('Error loading video data:', error);
    return [];
  }
};

export function useVideoData() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Try to fetch videos from Firestore
        const videosCollection = collection(db, "videos")
        const videosQuery = query(videosCollection, orderBy("title"))
        const videosSnapshot = await getDocs(videosQuery)

        if (!videosSnapshot.empty) {
          const videosData = videosSnapshot.docs.map((doc) => doc.data())
          setVideos(videosData)
        } else {
          // If no videos in Firestore, use JSON files data
          const jsonVideos = await importVideoData()
          setVideos(jsonVideos)
        }
      } catch (error) {
        console.error("Error fetching videos:", error)
        // Fallback to JSON files data on error
        const jsonVideos = await importVideoData()
        setVideos(jsonVideos)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return { videos, setVideos, loading }
}
