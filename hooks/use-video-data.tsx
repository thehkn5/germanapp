"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Sample video data for fallback
const sampleVideos = [
  {
    id: "1",
    title: "German Greetings and Introductions",
    description: "Learn the most common German greetings and how to introduce yourself.",
    level: "A1",
    topic: "Vocabulary",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Greetings",
    subtitles: [
      { startTime: "0:00", endTime: "0:05", text: "Hallo! Wie geht's?" },
      { startTime: "0:06", endTime: "0:10", text: "Ich heiße Max. Wie heißt du?" },
      { startTime: "0:11", endTime: "0:15", text: "Freut mich, dich kennenzulernen." },
    ],
    vocabulary: [
      { german: "Hallo", english: "Hello", example: "Hallo, wie geht's?" },
      { german: "Wie geht's?", english: "How are you?", example: "Hallo, wie geht's?" },
      { german: "Ich heiße", english: "My name is", example: "Ich heiße Anna." },
      { german: "Wie heißt du?", english: "What's your name?", example: "Wie heißt du?" },
      { german: "Freut mich", english: "Nice to meet you", example: "Freut mich, dich kennenzulernen." },
    ],
    quiz: {
      questions: [
        {
          question: "How do you say 'Hello' in German?",
          options: ["Hallo", "Tschüss", "Danke", "Bitte"],
          answer: 0,
        },
        {
          question: "What does 'Wie geht's?' mean?",
          options: ["What's your name?", "How are you?", "Where are you from?", "How old are you?"],
          answer: 1,
        },
        {
          question: "How do you introduce yourself in German?",
          options: ["Wie heißt du?", "Woher kommst du?", "Ich heiße...", "Wie alt bist du?"],
          answer: 2,
        },
      ],
    },
    exercises: [
      {
        title: "Fill in the blank",
        instruction: "Complete the sentence: '_______ Max. Wie heißt du?'",
        answer: "Ich heiße",
      },
      {
        title: "Translation",
        instruction: "Translate to German: 'Nice to meet you'",
        answer: "Freut mich",
      },
    ],
    flashcards: [
      { front: "Hallo", back: "Hello" },
      { front: "Wie geht's?", back: "How are you?" },
      { front: "Ich heiße", back: "My name is" },
      { front: "Wie heißt du?", back: "What's your name?" },
      { front: "Freut mich", back: "Nice to meet you" },
    ],
  },
  {
    id: "2",
    title: "Basic German Sentence Structure",
    description: "Understanding the fundamentals of German sentence structure and word order.",
    level: "A1",
    topic: "Grammar",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Grammar",
  },
  {
    id: "3",
    title: "Shopping in Germany",
    description: "Essential vocabulary and phrases for shopping in German-speaking countries.",
    level: "A2",
    topic: "Daily Life",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Shopping%20in%20Germany",
  },
  {
    id: "4",
    title: "German Cases Explained",
    description: "A comprehensive guide to understanding and using German cases correctly.",
    level: "B1",
    topic: "Grammar",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Cases",
  },
  {
    id: "5",
    title: "German Food and Dining",
    description: "Learn vocabulary related to food and how to order in restaurants.",
    level: "A2",
    topic: "Daily Life",
    thumbnail: "/placeholder.svg?height=200&width=350&text=German%20Food",
  },
  {
    id: "6",
    title: "Advanced German Conversation",
    description: "Practice advanced conversation techniques and idiomatic expressions.",
    level: "C1",
    topic: "Vocabulary",
    thumbnail: "/placeholder.svg?height=200&width=350&text=Advanced%20German",
  },
]

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
          // If no videos in Firestore, use sample data
          setVideos(sampleVideos)
        }
      } catch (error) {
        console.error("Error fetching videos:", error)
        // Fallback to sample data on error
        setVideos(sampleVideos)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return { videos, setVideos, loading }
}
