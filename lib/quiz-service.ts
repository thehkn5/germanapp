import { db } from "./firebase"
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"

interface QuizAttempt {
  userId: string
  videoId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number
  completedAt: any
  mistakes?: Array<{
    question: string
    userAnswer: string
    correctAnswer: string
    explanation?: string
  }>
}

export const quizService = {
  // Get a specific quiz by ID
  async getQuiz(quizId: string) {
    try {
      const quizDoc = await getDoc(doc(db, 'quizzes', quizId))
      if (!quizDoc.exists()) {
        throw new Error('Quiz not found')
      }
      return quizDoc.data()
    } catch (error) {
      console.error('Error fetching quiz:', error)
      throw error
    }
  },

  // Get all quizzes for a video
  async getQuizzesByVideo(videoId: string) {
    try {
      const q = query(collection(db, 'quizzes'), where('videoId', '==', videoId))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching video quizzes:', error)
      throw error
    }
  },

  // Save a quiz attempt
  async saveQuizAttempt(attempt: QuizAttempt) {
    try {
      const attemptData = {
        ...attempt,
        completedAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'quizAttempts'), attemptData)
      return docRef.id
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
      throw error
    }
  },

  // Get quiz attempts for a user
  async getUserQuizAttempts(userId: string) {
    try {
      const q = query(collection(db, 'quizAttempts'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching user quiz attempts:', error)
      throw error
    }
  },

  // Get quiz attempts for a specific video
  async getVideoQuizAttempts(videoId: string, userId: string) {
    try {
      const q = query(
        collection(db, 'quizAttempts'),
        where('videoId', '==', videoId),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching video quiz attempts:', error)
      throw error
    }
  }
}