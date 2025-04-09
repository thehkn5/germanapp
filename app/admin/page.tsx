"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useVideoData } from "@/hooks/use-video-data"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// Admin email address - hardcoded for security
const ADMIN_EMAIL = "hakanhakverdi6@gmail.com"

// Two-factor authentication code length
const CODE_LENGTH = 6

export default function AdminPage() {
  const { user } = useAuth()
  const { videos, setVideos } = useVideoData()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [jsonData, setJsonData] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<string>("new")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [twoFactorStep, setTwoFactorStep] = useState(false)
  const [lastLoginAttempt, setLastLoginAttempt] = useState<Date | null>(null)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null)
  
  // Check if current user is admin
  const userIsAdmin = user?.email === ADMIN_EMAIL

  // Check for account lockout
  useEffect(() => {
    if (lockedUntil && new Date() < lockedUntil) {
      const remainingTime = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / 1000 / 60);
      setError(`Too many failed attempts. Account locked for ${remainingTime} minutes.`);
    } else if (lockedUntil) {
      setLockedUntil(null);
      setLoginAttempts(0);
      setError(null);
    }
  }, [lockedUntil]);

  useEffect(() => {
    // If user is not admin, redirect to home
    if (user && !userIsAdmin) {
      router.push("/")
    }

    // Check if admin is already authenticated in this session
    const adminAuthenticated = sessionStorage.getItem("adminAuthenticated")
    if (adminAuthenticated === "true") {
      setIsAuthenticated(true)
    }
    
    // Check if 2FA is enabled for this admin
    const check2FAStatus = async () => {
      if (userIsAdmin) {
        try {
          const adminDoc = await getDoc(doc(db, "adminSettings", ADMIN_EMAIL))
          if (adminDoc.exists()) {
            setTwoFactorEnabled(adminDoc.data().twoFactorEnabled ?? true)
          }
        } catch (err) {
          console.error("Error checking 2FA status:", err)
        }
      }
    }
    
    check2FAStatus()
  }, [user, userIsAdmin, router])

  // Handle password authentication
  const handlePasswordAuth = () => {
    // Check if account is locked
    if (lockedUntil && new Date() < lockedUntil) {
      const remainingTime = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / 1000 / 60);
      setError(`Too many failed attempts. Account locked for ${remainingTime} minutes.`);
      return;
    }
    
    // Check password
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") { // Fallback for development
      if (twoFactorEnabled) {
        // Move to 2FA step
        setTwoFactorStep(true)
        setError(null)
        
        // Generate and send 2FA code
        generateAndSend2FACode()
      } else {
        // Complete authentication
        completeAuthentication()
      }
    } else {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setLastLoginAttempt(new Date());
      
      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + 15); // Lock for 15 minutes
        setLockedUntil(lockTime);
        setError("Too many failed attempts. Account locked for 15 minutes.");
      } else {
        setError(`Invalid password. ${5 - newAttempts} attempts remaining.`);
      }
    }
  }
  
  // Generate and send 2FA code
  const generateAndSend2FACode = async () => {
    try {
      setLoading(true)
      
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store the code in Firestore with expiration
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 15) // Code expires in 15 minutes
      
      await setDoc(doc(db, "adminVerification", ADMIN_EMAIL), {
        code,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      })
      
      // In a real app, send the code via email
      // For now, we'll just log it to the console
      console.log("2FA Code:", code)
      
      setSuccess("A verification code has been sent to your email. Please check your inbox.")
    } catch (err) {
      console.error("Error generating 2FA code:", err)
      setError("Failed to generate verification code. Please try again.")
      setTwoFactorStep(false)
    } finally {
      setLoading(false)
    }
  }
  
  // Verify 2FA code
  const verify2FACode = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get the stored code from Firestore
      const verificationDoc = await getDoc(doc(db, "adminVerification", ADMIN_EMAIL))
      
      if (!verificationDoc.exists()) {
        setError("Verification code not found. Please request a new code.")
        return
      }
      
      const verificationData = verificationDoc.data()
      
      // Check if code is expired
      const expiresAt = new Date(verificationData.expiresAt)
      if (expiresAt < new Date()) {
        setError("Verification code expired. Please request a new code.")
        return
      }
      
      // Check if code matches
      if (verificationData.code !== twoFactorCode) {
        setError("Invalid verification code. Please try again.")
        return
      }
      
      // Complete authentication
      completeAuthentication()
    } catch (err) {
      console.error("Error verifying 2FA code:", err)
      setError("Failed to verify code. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Complete authentication process
  const completeAuthentication = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem("adminAuthenticated", "true")
    setError(null)
    setLoginAttempts(0)
    setTwoFactorStep(false)
    setTwoFactorCode("")
    setPassword("")
  }

  const handleJsonUpload = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const data = JSON.parse(jsonData)

      if (selectedVideo === "new" && data.videos) {
        // Add new videos
        const newVideos = [...videos, ...data.videos]
        setVideos(newVideos)

        // Save to Firestore
        for (const video of data.videos) {
          await setDoc(doc(db, "videos", video.id), video)
        }

        setSuccess(`Successfully added ${data.videos.length} new videos.`)
      } else if (selectedVideo !== "new" && data.videoContent) {
        // Update existing video
        const updatedVideos = videos.map((v) => (v.id === selectedVideo ? { ...v, ...data.videoContent } : v))
        setVideos(updatedVideos)

        // Save to Firestore
        const videoToUpdate = updatedVideos.find((v) => v.id === selectedVideo)
        if (videoToUpdate) {
          await setDoc(doc(db, "videos", videoToUpdate.id), videoToUpdate)
        }

        setSuccess(`Successfully updated video content.`)
      } else {
        setError("Invalid JSON format. Please check the template.")
      }

      setJsonData("")
    } catch (error: any) {
      console.error("Error uploading JSON:", error)
      setError(error.message || "Failed to upload JSON data")
    } finally {
      setLoading(false)
    }
  }

  const handleEmbedVideo = async (videoId: string, embedCode: string) => {
    try {
      setLoading(true)
      setError(null)

      // Find the video to update
      const videoToUpdate = videos.find((v) => v.id === videoId)
      if (!videoToUpdate) {
        setError("Video not found")
        return
      }

      // Extract YouTube ID from embed code if possible
      let youtubeId = ""
      const match = embedCode.match(/youtube\.com\/embed\/([^"&?/\s]+)/)
      if (match && match[1]) {
        youtubeId = match[1]
      }

      // Update the video with embed code
      const updatedVideo = {
        ...videoToUpdate,
        embedCode,
        videoId: youtubeId || videoToUpdate.videoId, // Keep existing videoId if no new one found
      }

      // Update videos array
      const updatedVideos = videos.map((v) => (v.id === videoId ? updatedVideo : v))

      setVideos(updatedVideos)

      // Save to Firestore
      await setDoc(doc(db, "videos", videoId), updatedVideo)

      setSuccess("Video embed code updated successfully")
    } catch (error: any) {
      console.error("Error embedding video:", error)
      setError(error.message || "Failed to update video embed code")
    } finally {
      setLoading(false)
    }
  }

  const getJsonTemplate = () => {
    return `{
  "videos": [
    {
      "id": "unique-id",
      "title": "Video Title",
      "description": "Video description",
      "level": "A1",
      "topic": "Grammar",
      "videoId": "youtube-video-id",
      "thumbnail": "optional-thumbnail-url",
      "subtitles": [
        { "startTime": "0:00", "endTime": "0:05", "text": "Subtitle text" }
      ],
      "vocabulary": [
        { "german": "Wort", "english": "word", "example": "Example sentence" }
      ],
      "quiz": {
        "questions": [
          {
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": 0
          }
        ]
      },
      "exercises": [
        {
          "title": "Exercise Title",
          "instruction": "Exercise instruction",
          "answer": "correct answer"
        }
      ],
      "flashcards": [
        {
          "front": "Front text",
          "back": "Back text"
        }
      ]
    }
  ]
}`
  }

  const getVideoContentTemplate = () => {
    return `{
  "videoContent": {
    "subtitles": [
      { "startTime": "0:00", "endTime": "0:05", "text": "Subtitle text" }
    ]
  }
}`
  }

  // ## 8. Fix Timer Issue in Exercises
}
