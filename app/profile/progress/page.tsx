"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Brain, CheckCircle, Clock, Loader2, Trophy } from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import Link from "next/link"

// Sample vocabulary categories for demo
const vocabularyCategories = [
  {
    id: "general",
    title: "General Vocabulary",
    count: 250,
    description: "Essential German vocabulary for everyday use",
  },
  { id: "shopping", title: "Shopping", count: 75, description: "Words and phrases for shopping and commerce" },
  { id: "travel", title: "Travel", count: 120, description: "Vocabulary for traveling in German-speaking countries" },
  { id: "food", title: "Food & Dining", count: 90, description: "Food, cooking, and restaurant vocabulary" },
  { id: "school", title: "School & Education", count: 85, description: "Academic and educational terms" },
]

export default function ProgressPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [studiedWords, setStudiedWords] = useState<Record<string, string[]>>({})
  const [quizResults, setQuizResults] = useState<any[]>([])
  const [sessionHistory, setSessionHistory] = useState<any[]>([])

  // Load user progress data
  useEffect(() => {
    if (user) {
      // Load studied words from localStorage
      const studiedWordsData: Record<string, string[]> = {}

      vocabularyCategories.forEach((category) => {
        const storedStudied = localStorage.getItem(`studied_${category.id}`)
        if (storedStudied) {
          studiedWordsData[category.id] = JSON.parse(storedStudied)
        } else {
          studiedWordsData[category.id] = []
        }
      })

      setStudiedWords(studiedWordsData)

      // Load quiz results (mock data for demo)
      setQuizResults([
        { id: 1, title: "German Greetings", date: "2023-11-15", score: 85, total: 10, correct: 8.5 },
        { id: 2, title: "Basic Vocabulary", date: "2023-11-10", score: 70, total: 10, correct: 7 },
        { id: 3, title: "Shopping Terms", date: "2023-11-05", score: 90, total: 10, correct: 9 },
      ])

      // Load session history (mock data for demo)
      setSessionHistory([
        { id: 1, type: "Vocabulary", category: "General", date: "2023-11-15", duration: 15, wordsStudied: 20 },
        { id: 2, type: "Quiz", category: "Greetings", date: "2023-11-14", duration: 10, score: 85 },
        { id: 3, type: "Flashcards", category: "Shopping", date: "2023-11-12", duration: 20, wordsStudied: 15 },
        { id: 4, type: "Exercises", category: "Grammar", date: "2023-11-10", duration: 25, completed: 12 },
      ])

      setLoading(false)
    }
  }, [user])

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let totalWords = 0
    let studiedCount = 0

    vocabularyCategories.forEach((category) => {
      totalWords += category.count
      studiedCount += studiedWords[category.id]?.length || 0
    })

    return {
      percentage: Math.round((studiedCount / totalWords) * 100) || 0,
      studied: studiedCount,
      total: totalWords,
    }
  }

  const overallProgress = calculateOverallProgress()

  // Calculate average quiz score
  const averageQuizScore =
    quizResults.length > 0 ? Math.round(quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / quizResults.length) : 0

  // Calculate total study time (in minutes)
  const totalStudyTime = sessionHistory.reduce((sum, session) => sum + (session.duration || 0), 0)

  if (loading) {
    return (
      <AuthCheck>
        <div className="container mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/profile">
            <Button variant="ghost" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Learning Progress</h1>
          <p className="text-muted-foreground">Track your German language learning journey</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Vocabulary Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{overallProgress.percentage}%</div>
              <Progress value={overallProgress.percentage} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {overallProgress.studied} of {overallProgress.total} words learned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Quiz Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{averageQuizScore}%</div>
              <Progress value={averageQuizScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">Average score across {quizResults.length} quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{totalStudyTime} min</div>
              <Progress value={Math.min((totalStudyTime / 120) * 100, 100)} className="mb-2" />
              <p className="text-sm text-muted-foreground">Total time spent learning</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Progress */}
        <Tabs defaultValue="vocabulary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="history">Activity History</TabsTrigger>
          </TabsList>

          <TabsContent value="vocabulary" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vocabulary Categories Progress</CardTitle>
                <CardDescription>Your progress across different vocabulary categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {vocabularyCategories.map((category) => {
                    const studied = studiedWords[category.id]?.length || 0
                    const percentage = Math.round((studied / category.count) * 100) || 0

                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                          <Badge variant={percentage >= 70 ? "default" : "outline"}>
                            {studied} / {category.count}
                          </Badge>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>Your performance on quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {quizResults.length > 0 ? (
                  <div className="space-y-4">
                    {quizResults.map((quiz) => (
                      <div key={quiz.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">Completed on {quiz.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className={`h-5 w-5 ${quiz.score >= 80 ? "text-yellow-500" : "text-gray-400"}`} />
                            <span className="font-bold">{quiz.score}%</span>
                          </div>
                        </div>
                        <Progress value={quiz.score} className="mt-2" />
                        <p className="text-sm mt-2">
                          {quiz.correct} correct answers out of {quiz.total} questions
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
                    <Button className="mt-4">
                      <Link href="/videos">Take a Quiz</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>Your recent learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {sessionHistory.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{session.type} Session</h3>
                              <Badge variant="outline">{session.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Completed on {session.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{session.duration} min</span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm">
                          {session.type === "Vocabulary" && <p>{session.wordsStudied} words studied</p>}
                          {session.type === "Quiz" && <p>Score: {session.score}%</p>}
                          {session.type === "Flashcards" && <p>{session.wordsStudied} flashcards reviewed</p>}
                          {session.type === "Exercises" && <p>{session.completed} exercises completed</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No activity history available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievements */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Milestones you've reached in your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                className={`p-4 border rounded-lg ${overallProgress.studied >= 50 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "opacity-50"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle
                    className={`h-5 w-5 ${overallProgress.studied >= 50 ? "text-green-500" : "text-gray-400"}`}
                  />
                  <h3 className="font-medium">Vocabulary Builder</h3>
                </div>
                <p className="text-sm">Learn 50 words</p>
                <Progress value={Math.min((overallProgress.studied / 50) * 100, 100)} className="mt-2" />
              </div>

              <div
                className={`p-4 border rounded-lg ${quizResults.length >= 5 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "opacity-50"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`h-5 w-5 ${quizResults.length >= 5 ? "text-green-500" : "text-gray-400"}`} />
                  <h3 className="font-medium">Quiz Master</h3>
                </div>
                <p className="text-sm">Complete 5 quizzes</p>
                <Progress value={Math.min((quizResults.length / 5) * 100, 100)} className="mt-2" />
              </div>

              <div
                className={`p-4 border rounded-lg ${totalStudyTime >= 60 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "opacity-50"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`h-5 w-5 ${totalStudyTime >= 60 ? "text-green-500" : "text-gray-400"}`} />
                  <h3 className="font-medium">Dedicated Learner</h3>
                </div>
                <p className="text-sm">Study for 1 hour</p>
                <Progress value={Math.min((totalStudyTime / 60) * 100, 100)} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  )
}
