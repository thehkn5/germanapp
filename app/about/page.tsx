import { Card, CardContent } from "@/components/ui/card"
import { Globe, Mail, BookOpen, Video, Users, Heart, Target, Sparkles, GraduationCap, Languages } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About German Learning Platform</h1>
          <p className="text-xl text-muted-foreground">
            Our mission is to make learning German accessible, engaging, and effective for everyone
          </p>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden mb-16">
          <div className="aspect-[21/9] relative">
            <Image
              src="/placeholder.svg?height=400&width=800&text=German+Learning+Platform"
              alt="German Learning Platform"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Learn German Your Way</h2>
              <p>Interactive videos, personalized roadmaps, and effective learning tools</p>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {/* Our Story */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Our Story
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="mb-4">
                      The German Learning Platform was created with a simple goal: to make learning German enjoyable and
                      accessible to everyone. As language learners ourselves, we understood the challenges of mastering
                      a new language and wanted to create a resource that addresses those challenges directly.
                    </p>
                    <p className="mb-4">
                      Our journey began in 2023 when we recognized that many existing language learning platforms lacked
                      the combination of structured content, interactive tools, and engaging video materials that truly
                      help learners progress. We set out to build a platform that integrates all these elements into a
                      cohesive learning experience.
                    </p>
                    <p>
                      Today, our platform serves learners at all levels, from complete beginners to advanced speakers
                      looking to refine their skills. We're constantly expanding our content library and improving our
                      learning tools based on user feedback and the latest research in language acquisition.
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-[300px] aspect-square">
                      <Image
                        src="/placeholder.svg?height=300&width=300&text=Our+Story"
                        alt="Our Story"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Our Approach */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Our Approach to Language Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Video-Based Learning</h3>
                  <p className="text-muted-foreground">
                    Authentic content that exposes learners to German as it's actually used in real-world contexts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Structured Progression</h3>
                  <p className="text-muted-foreground">
                    Content follows CEFR levels from A1 to C1, ensuring logical progression in difficulty
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Interactive Practice</h3>
                  <p className="text-muted-foreground">
                    Quizzes, flashcards, and exercises reinforce learning through active practice
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                    <Languages className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Personalized Roadmaps</h3>
                  <p className="text-muted-foreground">
                    Create custom learning paths tailored to your goals, schedule, and interests
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Our Team */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Our Team
            </h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-8 text-center">
                  Our team consists of passionate language educators, content creators, and developers who share a
                  common goal: making German language learning accessible and enjoyable.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="relative w-32 h-32 rounded-full mx-auto overflow-hidden mb-4">
                      <Image
                        src="/placeholder.svg?height=128&width=128&text=HH"
                        alt="Hakan Hakverdi"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg">Hakan Hakverdi</h3>
                    <p className="text-muted-foreground">Founder & Content Creator</p>
                    <p className="text-sm mt-2">German language expert with over 10 years of teaching experience</p>
                  </div>

                  <div className="text-center">
                    <div className="relative w-32 h-32 rounded-full mx-auto overflow-hidden mb-4">
                      <Image
                        src="/placeholder.svg?height=128&width=128&text=JM"
                        alt="Julia Mueller"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg">Julia Mueller</h3>
                    <p className="text-muted-foreground">Lead Curriculum Designer</p>
                    <p className="text-sm mt-2">
                      Certified language instructor specializing in interactive learning methods
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="relative w-32 h-32 rounded-full mx-auto overflow-hidden mb-4">
                      <Image
                        src="/placeholder.svg?height=128&width=128&text=MS"
                        alt="Michael Schmidt"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg">Michael Schmidt</h3>
                    <p className="text-muted-foreground">Technical Director</p>
                    <p className="text-sm mt-2">Software engineer with expertise in educational technology</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Testimonials */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=S"
                        alt="Sarah K."
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Sarah K.</h3>
                      <p className="text-sm text-muted-foreground mb-2">B1 Learner</p>
                      <p className="italic">
                        "The video-based approach makes learning German so much more engaging. The roadmap feature
                        helped me organize my learning journey and stay motivated."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=J"
                        alt="James T."
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">James T.</h3>
                      <p className="text-sm text-muted-foreground mb-2">A2 Learner</p>
                      <p className="italic">
                        "I love that I can practice at my own pace and track my progress. The custom vocabulary lists
                        feature is incredibly helpful for remembering new words."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=M"
                        alt="Maria L."
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Maria L.</h3>
                      <p className="text-sm text-muted-foreground mb-2">C1 Learner</p>
                      <p className="italic">
                        "Even as an advanced learner, I find the content challenging and engaging. The interactive
                        exercises help me refine my grammar and expand my vocabulary."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=D"
                        alt="David R."
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">David R.</h3>
                      <p className="text-sm text-muted-foreground mb-2">A1 Beginner</p>
                      <p className="italic">
                        "As a complete beginner, I was intimidated by German grammar, but the step-by-step approach and
                        clear explanations have made it much less daunting."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Contact Us
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="mb-4">
                      We value your feedback and are always looking to improve our platform. If you have any questions,
                      suggestions, or concerns, please don't hesitate to reach out to us.
                    </p>
                    <div className="space-y-4 mt-6">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <a href="mailto:hakanhakverdi6@gmail.com" className="text-blue-600 hover:underline">
                            hakanhakverdi6@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Website</h3>
                          <a href="#" className="text-blue-600 hover:underline">
                            www.germanlearningplatform.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Join Our Community</h3>
                    <p className="mb-4">
                      Connect with other German learners, share resources, and get support on your language learning
                      journey.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="#"
                        className="bg-[#4267B2] text-white px-4 py-2 rounded-md hover:bg-[#365899] transition-colors"
                      >
                        Facebook Group
                      </a>
                      <a
                        href="#"
                        className="bg-[#1DA1F2] text-white px-4 py-2 rounded-md hover:bg-[#1a91da] transition-colors"
                      >
                        Twitter
                      </a>
                      <a
                        href="#"
                        className="bg-[#FF4500] text-white px-4 py-2 rounded-md hover:bg-[#e03d00] transition-colors"
                      >
                        Reddit Community
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
