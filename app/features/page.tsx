import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Video, BookOpen, Brain, FlaskConical, Timer, Shuffle, Layers, Users } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-xl text-muted-foreground">
            Discover all the tools and features available to help you learn German effectively
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Video Library */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Video Library</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Browse our extensive collection of German learning videos
              </CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Categorized by level (A1-C1) and topic</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Synchronized subtitles for better comprehension</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Integrated vocabulary lists for each video</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Vocabulary Tools */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Vocabulary Tools</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Build your German vocabulary with our specialized tools
              </CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Categorized vocabulary lists for targeted learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Interactive flashcard study sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Progress tracking to focus on words you need to practice</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Interactive Quizzes */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Interactive Quizzes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Test your knowledge with our interactive quizzes</CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Multiple-choice questions based on video content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Immediate feedback on your answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Performance tracking and score reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                  <FlaskConical className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle>Exercises</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Practice your German with targeted exercises</CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Fill-in-the-blank exercises to test comprehension</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Translation practice to build language skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Grammar exercises tailored to your level</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Practice Sessions */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                  <Timer className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Practice Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Structured practice sessions to improve your German</CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Timed sessions to build language fluency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Guided practice with pronunciation tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Customizable session duration and content</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Spaced Repetition */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <Shuffle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Spaced Repetition</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Learn efficiently with our spaced repetition system</CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Scientifically proven learning method</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Focus on words you find challenging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Optimized review intervals for better retention</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Multi-Level Content */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                  <Layers className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Multi-Level Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Content tailored to different proficiency levels</CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>A1 to C1 level content following CEFR standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Progressive difficulty to match your growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Clear indicators of content difficulty</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* User Profiles */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full">
                  <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle>User Profiles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Personalized user profiles to track your progress</CardDescription>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Track your learning progress over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Customizable display name and settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Email verification for account security</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
