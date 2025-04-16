"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db, auth } from "@/lib/firebase"
import { getDoc, doc, collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DebugPage() {
  const { user } = useAuth()
  const [firebaseStatus, setFirebaseStatus] = useState<"loading" | "connected" | "error">("loading")
  const [firestoreStatus, setFirestoreStatus] = useState<"loading" | "connected" | "error">("loading")
  const [userDocument, setUserDocument] = useState<any>(null)
  const [userDocStatus, setUserDocStatus] = useState<"loading" | "exists" | "not_exists" | "error">("loading")
  const [roadmapsStatus, setRoadmapsStatus] = useState<"loading" | "exists" | "not_exists" | "error">("loading")
  const [roadmapsCount, setRoadmapsCount] = useState<number>(0)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  useEffect(() => {
    // Check Firebase connection
    try {
      if (auth) {
        setFirebaseStatus("connected")
      } else {
        setFirebaseStatus("error")
        setErrorMessages(prev => [...prev, "Firebase auth is not initialized"])
      }
    } catch (error) {
      setFirebaseStatus("error")
      setErrorMessages(prev => [...prev, `Firebase auth error: ${error instanceof Error ? error.message : String(error)}`])
    }

    // Check Firestore connection
    try {
      if (db) {
        setFirestoreStatus("connected")
      } else {
        setFirestoreStatus("error")
        setErrorMessages(prev => [...prev, "Firestore is not initialized"])
      }
    } catch (error) {
      setFirestoreStatus("error")
      setErrorMessages(prev => [...prev, `Firestore error: ${error instanceof Error ? error.message : String(error)}`])
    }
  }, [])

  useEffect(() => {
    if (!user || firestoreStatus !== "connected") return

    // Check user document
    const checkUserDoc = async () => {
      try {
        setUserDocStatus("loading")
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        
        if (userDocSnap.exists()) {
          setUserDocStatus("exists")
          setUserDocument(userDocSnap.data())
        } else {
          setUserDocStatus("not_exists")
        }
      } catch (error) {
        setUserDocStatus("error")
        setErrorMessages(prev => [...prev, `User document error: ${error instanceof Error ? error.message : String(error)}`])
      }
    }

    // Check roadmaps
    const checkRoadmaps = async () => {
      try {
        setRoadmapsStatus("loading")
        
        // Check both collections
        const topLevelRoadmaps = collection(db, "roadmaps")
        const userRoadmaps = collection(db, "users", user.uid, "user_roadmaps")
        
        let totalCount = 0
        
        // Check top-level roadmaps
        try {
          const topLevelSnap = await getDocs(topLevelRoadmaps)
          console.log("Top-level roadmaps count:", topLevelSnap.size)
          totalCount += topLevelSnap.size
        } catch (error) {
          console.error("Error getting top-level roadmaps:", error)
          setErrorMessages(prev => [...prev, `Top-level roadmaps error: ${error instanceof Error ? error.message : String(error)}`])
        }
        
        // Check user roadmaps
        try {
          const userRoadmapsSnap = await getDocs(userRoadmaps)
          console.log("User roadmaps count:", userRoadmapsSnap.size)
          totalCount += userRoadmapsSnap.size
        } catch (error) {
          console.error("Error getting user roadmaps:", error)
          setErrorMessages(prev => [...prev, `User roadmaps error: ${error instanceof Error ? error.message : String(error)}`])
        }
        
        setRoadmapsCount(totalCount)
        
        if (totalCount > 0) {
          setRoadmapsStatus("exists")
        } else {
          setRoadmapsStatus("not_exists")
        }
      } catch (error) {
        setRoadmapsStatus("error")
        setErrorMessages(prev => [...prev, `Roadmaps error: ${error instanceof Error ? error.message : String(error)}`])
      }
    }

    checkUserDoc()
    checkRoadmaps()
  }, [user, firestoreStatus])

  const StatusIcon = ({ status }: { status: "loading" | "connected" | "exists" | "not_exists" | "error" }) => {
    if (status === "loading") return <AlertCircle className="h-5 w-5 text-yellow-500" />
    if (status === "connected" || status === "exists") return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === "not_exists") return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return <XCircle className="h-5 w-5 text-destructive" />
  }

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Firebase Debugging</h1>
      
      {errorMessages.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errors Detected</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc pl-5">
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Firebase Authentication</CardTitle>
            <CardDescription>
              Checks if Firebase Auth is properly initialized and connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Firebase Auth Connection</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={firebaseStatus} />
                <span>{firebaseStatus === "connected" ? "Connected" : firebaseStatus === "loading" ? "Checking..." : "Error"}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span>Current User</span>
              <div className="flex items-center gap-2">
                {user ? (
                  <span className="text-sm font-medium">{user.email}</span>
                ) : (
                  <span className="text-sm text-yellow-500">Not logged in</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Firestore</CardTitle>
            <CardDescription>
              Checks if Firestore is properly initialized and accessible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Firestore Connection</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={firestoreStatus} />
                <span>{firestoreStatus === "connected" ? "Connected" : firestoreStatus === "loading" ? "Checking..." : "Error"}</span>
              </div>
            </div>
            
            {user && (
              <>
                <div className="mt-4 flex items-center justify-between">
                  <span>User Document</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={userDocStatus} />
                    <span>
                      {userDocStatus === "exists" 
                        ? "Exists" 
                        : userDocStatus === "not_exists" 
                          ? "Not Found" 
                          : userDocStatus === "loading" 
                            ? "Checking..." 
                            : "Error"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span>Roadmaps</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={roadmapsStatus} />
                    <span>
                      {roadmapsStatus === "exists" 
                        ? `${roadmapsCount} roadmaps found` 
                        : roadmapsStatus === "not_exists" 
                          ? "No roadmaps found" 
                          : roadmapsStatus === "loading" 
                            ? "Checking..." 
                            : "Error"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {userDocument && (
          <Card>
            <CardHeader>
              <CardTitle>User Document Data</CardTitle>
              <CardDescription>
                Contents of your user document in Firestore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(userDocument, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 