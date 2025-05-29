"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Apple, Heart, Users, Target, Shield, Lightbulb, GraduationCap, MapPin, ArrowRight, Ban, EyeOff} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Healthy Hoyas</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features-page" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/how-it-works-page" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/about-page" className="text-green-600 font-medium">
              About
            </Link>
          </nav>
          <Link href="/auth/sign-up">
            <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <GraduationCap className="w-3 h-3 mr-1" />
                Student-Built Platform
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Built by Students, for Students</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Healthy Hoyas was created by Georgetown students who understood the unique challenges of maintaining a
                healthy lifestyle during college. We're on a mission to make health tracking simple, effective, and
                completely free for all students.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>Georgetown University</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>500+ Active Students</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Georgetown University campus"
                width={600}
                height={500}
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">100% Free</p>
                    <p className="text-sm text-gray-500">Always will be</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Story</h2>
              <p className="text-xl text-gray-600">How Healthy Hoyas came to life</p>
            </div>

            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">The Problem</h3>
                  <p className="text-gray-600 leading-relaxed">
                    As Georgetown students, we struggled to maintain healthy eating habits while juggling academics,
                    social life, and extracurriculars. Existing health apps were either too complicated, expensive, or
                    didn't understand the unique challenges of college dining.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We found ourselves skipping meals, eating poorly, and losing track of our wellness goals. The
                    "freshman 15" was real, and we needed a solution that actually worked for college students.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="College dining hall"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative order-2 md:order-1">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Students working on laptops"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md"
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <h3 className="text-2xl font-semibold text-gray-900">The Solution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We decided to build the health tracking app we wished existed. One that integrated directly with
                    Georgetown's dining services, understood our schedules, and made tracking effortless.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    After months of development and testing with fellow students, Healthy Hoyas was born. A platform
                    designed specifically for college students, by college students.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">The Impact</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Today, {/*hundreds of Georgetown */} students use Healthy Hoyas to track their nutrition, monitor their
                    wellness, and maintain healthy habits throughout their college journey.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We're proud to offer this completely free, with no ads, no data selling, and no hidden costs.
                    Because we believe every student deserves access to tools that help them live healthier lives.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Happy students"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">What drives us and guides our decisions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Student-First</h3>
                <p className="text-gray-600">
                  Every feature is designed with the college student experience in mind. We understand your challenges
                  because we live them too.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
  <CardContent className="p-8 space-y-4">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
      <EyeOff className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">100% Ad-Free</h3>
    <p className="text-gray-600">
      No ads. No popups. No distractions. We're built to support your wellness — not funded by selling your attention.
    </p>
  </CardContent>
</Card>


            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve and innovate based on student feedback to create the best possible experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Accessibility</h3>
                <p className="text-gray-600">
                  Health tools should be available to everyone. That's why Healthy Hoyas is and always will be
                  completely free.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What's Next</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our roadmap for expanding Healthy Hoyas</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">More Universities</h3>
                <p className="text-gray-600">
                  We're working to bring Healthy Hoyas to universities across the country, starting with the DC area.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">New Features</h3>
                <p className="text-gray-600">
                  Enhanced analytics, social features, and integration with more campus services based on student
                  feedback.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Community</h3>
                <p className="text-gray-600">
                  Building a community of health-conscious students who support and motivate each other.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Meet the Team</h2>
            <p className="text-xl text-gray-600">The Georgetown students behind Healthy Hoyas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Development Team</h3>
                <p className="text-gray-600">
                  Computer Science students passionate about health technology and improving student life.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Health Advisors</h3>
                <p className="text-gray-600">
                  Pre-med and public health students ensuring our platform promotes healthy habits and accurate
                  information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Student Testers</h3>
                <p className="text-gray-600">
                  Hundreds of Georgetown students who provide feedback and help us improve the platform continuously.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions, feedback, or want to get involved? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Contact Us
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Join Our Team
              </Button>
            </div>
            <p className="text-gray-500">Built with ❤️ by Georgetown students, for Georgetown students</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Transform Your Health?</h2>
            <p className="text-xl text-green-100">
              Join {/*hundreds of Georgetown */} students who are already living healthier lives with Healthy Hoyas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 bg-white text-green-600 hover:bg-gray-100"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-green-100 text-sm">No credit card required • Always free for students • No ads ever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Apple className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Healthy Hoyas</span>
              </div>
              <p className="text-gray-400">
                Empowering college students to live healthier lives through smart nutrition and wellness tracking.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Product</h4>
              <div className="space-y-2">
                <Link href="/features-page" className="block text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="/how-it-works-page" className="block text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link href="/about-page" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <div className="space-y-2">
                {/*<Link href="/help" className="block text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link> */}
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
                {/*<Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link> */}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">University</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Currently available at:</p>
                <p className="text-white font-semibold">Georgetown University</p>
                <p className="text-gray-400 text-sm">More universities coming soon!</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Healthy Hoyas. All rights reserved. Made with ❤️ by students, for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
