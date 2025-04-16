"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  sendVerificationEmail: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User: ${currentUser.email}` : "No user")
      setUser(currentUser)
      setLoading(false)
      
      // Don't redirect automatically - let individual pages handle auth state
    })

    return () => {
      console.log("Cleaning up auth state listener")
      unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      // Set persistence to LOCAL before sign up
      await setPersistence(auth, browserLocalPersistence)

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(userCredential.user)

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        displayName: email.split("@")[0],
        createdAt: serverTimestamp(),
        isAdmin: email === "hakanhakverdi6@gmail.com" // Set admin status based on email
      })

      return userCredential
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email)
      // Set persistence to LOCAL before sign in
      await setPersistence(auth, browserLocalPersistence)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful:", userCredential.user.email)

      // Update last login timestamp with better error handling
      // We'll do this asynchronously to not block the sign-in process
      setTimeout(async () => {
        try {
          const userDocRef = doc(db, "users", userCredential.user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            // Update existing document
            try {
              await setDoc(
                userDocRef,
                {
                  lastLogin: serverTimestamp(),
                },
                { merge: true },
              )
              console.log("Updated last login timestamp")
            } catch (updateError) {
              console.error("Error updating last login timestamp:", updateError)
              // Non-critical error, don't affect user experience
            }
          } else {
            // Create new user document if it doesn't exist
            try {
              await setDoc(userDocRef, {
                email: email,
                displayName: userCredential.user.displayName || email.split("@")[0],
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                isAdmin: email === "hakanhakverdi6@gmail.com" // Ensure admin status is set
              })
              console.log("Created new user document")
            } catch (createError) {
              console.error("Error creating user document:", createError)
              // Non-critical error, don't affect user experience
            }
          }
        } catch (docError) {
          console.error("Error checking user document:", docError)
          // Non-critical error, don't affect user experience
        }
      }, 1000) // Small delay to ensure auth is fully processed

      return userCredential
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }, [])

  const logOut = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }, [])

  const sendVerificationEmail = useCallback(async () => {
    if (user) {
      try {
        await sendEmailVerification(user)
      } catch (error) {
        console.error("Error sending verification email:", error)
        throw error
      }
    } else {
      throw new Error("No user is signed in")
    }
  }, [user])

  const updateUserProfile = useCallback(
    async (displayName: string) => {
      if (user) {
        try {
          await updateProfile(user, { displayName })

          // Update Firestore user document
          await setDoc(
            doc(db, "users", user.uid),
            {
              displayName,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          )

          // Force refresh the user object
          setUser({ ...user, displayName })
        } catch (error) {
          console.error("Error updating profile:", error)
          throw error
        }
      } else {
        throw new Error("No user is signed in")
      }
    },
    [user],
  )

  const updateUserPassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (user && user.email) {
        try {
          // Re-authenticate user before password change
          const credential = EmailAuthProvider.credential(user.email, currentPassword)
          await reauthenticateWithCredential(user, credential)

          // Update password
          await updatePassword(user, newPassword)
        } catch (error) {
          console.error("Error updating password:", error)
          throw error
        }
      } else {
        throw new Error("No user is signed in")
      }
    },
    [user],
  )

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Error sending password reset email:", error)
      throw error
    }
  }, [])

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
    sendVerificationEmail,
    updateUserProfile,
    updateUserPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
