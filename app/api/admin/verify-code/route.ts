import { NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Admin email address - hardcoded for security
const ADMIN_EMAIL = "hakanhakverdi6@gmail.com"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    // Verify that the email is the admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get verification code from Firestore
    const verificationDoc = await getDoc(doc(db, "adminVerification", email))

    if (!verificationDoc.exists()) {
      return NextResponse.json({ error: "Verification code not found" }, { status: 404 })
    }

    const verificationData = verificationDoc.data()

    // Check if code is expired
    const expiresAt = new Date(verificationData.expiresAt)
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 })
    }

    // Check if code matches
    if (verificationData.code !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}
