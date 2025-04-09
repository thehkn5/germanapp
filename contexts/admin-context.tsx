"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-context"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"

// Admin email address - hardcoded for security
const ADMIN_EMAIL = "hakanhakverdi6@gmail.com"

interface AdminContextType {
  isAdmin: boolean
  isAdminVerified: boolean
  verifyWithGoogle: () => Promise<boolean>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminVerified, setIsAdminVerified] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true)

        // Check if admin is already verified in this session
        const adminSessionVerified = sessionStorage.getItem("adminVerified")
        if (adminSessionVerified === "true") {
          setIsAdminVerified(true)
        }
      } else {
        setIsAdmin(false)
        setIsAdminVerified(false)
      }
    }

    checkAdminStatus()
  }, [user])

  const verifyWithGoogle = async (): Promise<boolean> => {
    if (!isAdmin) {
      throw new Error("Not authorized")
    }

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Check if the Google account email matches the admin email
      if (result.user.email === ADMIN_EMAIL) {
        setIsAdminVerified(true)
        // Store verification in session storage
        sessionStorage.setItem("adminVerified", "true")
        return true
      }

      return false
    } catch (error) {
      console.error("Error verifying with Google:", error)
      return false
    }
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isAdminVerified,
        verifyWithGoogle,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
