// Using AES encryption from CryptoJS
import CryptoJS from "crypto-js"

// Secret key for encryption (in a real app, this would be an environment variable)
const SECRET_KEY = "german-learning-platform-secret-key-2023"

/**
 * Encrypts a string using AES encryption
 * @param text The text to encrypt
 * @returns Encrypted string
 */
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

/**
 * Decrypts an encrypted string
 * @param encryptedText The encrypted text
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
