import { NextResponse } from "next/server"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import nodemailer from "nodemailer"

// Admin email address - hardcoded for security
const ADMIN_EMAIL = "hakanhakverdi6@gmail.com"

export async function POST(request: Request) {
  try {
    const { email, code, expiresAt } = await request.json()

    // Verify that the email is the admin email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Store verification code in Firestore
    await setDoc(doc(db, "adminVerification", email), {
      code,
      expiresAt,
      createdAt: new Date().toISOString(),
    })

    // Log the code for debugging (in production, this should be removed)
    console.log(`Verification code for ${email}: ${code}`)

    // Create a more reliable transporter with detailed configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Helps with some connection issues
      },
    })

    // Send email with verification code
    const mailOptions = {
      from: `"German Learning App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Admin Panel Verification Code",
      text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Admin Panel Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    }

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId)

    // As a fallback, store the code in session storage
    // This is not secure for production but helps during development
    return NextResponse.json({
      success: true,
      // Include the code in the response for testing purposes
      // In production, this should be removed
      code: code,
    })
  } catch (error) {
    console.error("Error sending verification:", error)
    return NextResponse.json(
      {
        error: "Failed to send verification",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
