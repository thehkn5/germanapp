import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, CheckCircle, Video } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Learn German with Video
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Enhance your German language skills with our curated collection of learning videos. Each video comes with
              synchronized subtitles, vocabulary lists, and interactive learning tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/videos">
                <Button size="lg" className="gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Explore Video Library <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>

            {/* Free Access Badge */}
            <div className="mt-8 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-full text-sm font-medium">
              100% Free Access to All Learning Resources
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Learn with Us?</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Video-Based Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn through engaging videos that make German language acquisition natural and enjoyable.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Interactive Tools</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reinforce your learning with quizzes, flashcards, and exercises designed for each video.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a free account to track your progress and see your improvement over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Use This Platform</h2>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium">Create an Account</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up for a free account to access all learning tools. Your information is kept private and secure.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium">Browse the Video Library</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our collection of German learning videos. Filter by level (A1-C1) or topic to find content that
                matches your learning needs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium">Watch and Learn</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Each video includes synchronized subtitles and a vocabulary list to help you understand the content.
                Follow along with the subtitles to improve your listening and comprehension skills.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">4</span>
                </div>
                <h3 className="text-lg font-medium">Practice with Learning Tools</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to use our interactive learning tools - quizzes, exercises, and flashcards - to reinforce what
                you've learned. Track your progress and improve your German language skills at your own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning German?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are improving their German language skills with our video-based platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/videos">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                Explore Videos <Video className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-bold text-blue-600">M</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Michael S.</h4>
                    <p className="text-sm text-gray-500">A1 Learner</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  "The video-based approach makes learning German so much more engaging. I can actually understand
                  conversations now!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="font-bold text-indigo-600">S</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah K.</h4>
                    <p className="text-sm text-gray-500">B1 Learner</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  "The quizzes and flashcards have helped me retain vocabulary much better than traditional methods."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="font-bold text-green-600">J</span>
                  </div>
                  <div>
                    <h4 className="font-medium">James T.</h4>
                    <p className="text-sm text-gray-500">A2 Learner</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  "I love that I can practice at my own pace and track my progress. The interface is intuitive and easy
                  to use."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
