"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Apple,
  Moon,
  Activity,
  Scale,
  BarChart3,
  Smartphone,
  Utensils,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Shield, ArrowRight, Ban
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Features() {
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
            <Link href="/features-page" className="text-green-600 font-medium">
              Features
            </Link>
            <Link href="/how-it-works-page" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/about-page" className="text-gray-600 hover:text-gray-900 transition-colors">
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
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Comprehensive Health Tracking
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Everything You Need to Stay Healthy in College
            </h1>
            <p className="text-xl text-gray-600">
              From smart meal logging to detailed analytics, Healthy Hoyas provides all the tools you need to maintain a
              healthy lifestyle during your studies.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Smart Meal Tracking</h2>
              </div>
              <p className="text-lg text-gray-600">
                Our intelligent meal logging system connects directly to Georgetown's dining services, making it
                effortless to track your nutrition.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cafeteria Integration</h4>
                    <p className="text-gray-600">
                      Automatically sync with dining hall menus and nutritional information
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Autocomplete</h4>
                    <p className="text-gray-600">Type a few letters and instantly find your exact meal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Macro Breakdown</h4>
                    <p className="text-gray-600">Detailed protein, carbs, and fat tracking for every meal</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Meal tracking interface"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative order-2 lg:order-1">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Analytics dashboard"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Advanced Analytics</h2>
              </div>
              <p className="text-lg text-gray-600">
                Visualize your health journey with comprehensive charts and insights that help you understand your
                patterns and progress.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Historical Tracking</h4>
                    <p className="text-gray-600">View weeks, months, or years of your health data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Interactive Charts</h4>
                    <p className="text-gray-600">Beautiful visualizations for steps, sleep, weight, and nutrition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Trend Analysis</h4>
                    <p className="text-gray-600">Identify patterns and get insights to improve your health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Complete Health Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All your health metrics in one place, designed specifically for college students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Moon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Sleep Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 mt-6">
                  Monitor your sleep patterns and quality to optimize your rest and academic performance.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Sleep duration tracking</li>
                  <li>• Sleep quality insights</li>
                  <li>• Weekly sleep trends</li>
                  {/* <li>• Bedtime recommendations</li> */}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Activity Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Stay active with comprehensive step tracking and activity insights tailored for campus life.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Daily step counting</li>
                  <li>• Activity goal setting</li>
                  {/*<li>• Campus walking routes</li> */}
                  <li>• Weekly activity summaries</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Weight Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track your weight trends and maintain a healthy lifestyle throughout your college years.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Weight trend analysis</li>
                  <li>• Goal setting and tracking</li>
                  <li>• BMI calculations</li>
                  <li>• Progress visualizations</li>
                </ul>
              </CardContent>
            </Card>

            

            {/* <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-yellow-600" />
                </div>
                 <CardTitle>Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access your health data anywhere on campus with our mobile-first design and offline capabilities.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Responsive design</li>
                  <li>• Quick meal logging</li>
                  <li>• Offline data sync</li>
                  <li>• Push notifications</li>
                </ul>
              </CardContent>
            </Card> */}

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
  <CardHeader>
    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
      <Ban className="w-6 h-6 text-red-600" />
    </div>
    <CardTitle>Ad-Free Experience</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600 mb-4">
      We believe your health journey should be distraction-free. Our platform is completely free of ads — always.
    </p>
    <ul className="space-y-2 text-sm text-gray-600">
      <li>• No banner ads</li>
      <li>• No popups or trackers</li>
      <li>• Focused on your wellness</li>
      <li>• Clean, student-first design</li>
    </ul>
  </CardContent>
</Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Healthy Hoyas?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by students, for students. We understand the unique challenges of college life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">
                Log meals in seconds, not minutes. Our smart autocomplete makes tracking effortless between classes.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Actionable Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations based on your data to improve your health and academic performance.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">College-Focused</h3>
              <p className="text-gray-600">
                Designed around your schedule, dining options, and lifestyle. Perfect for busy students.
              </p>
            </div>
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
