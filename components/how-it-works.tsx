"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Apple, Smartphone, BarChart3, Users, CheckCircle, Clock, Zap, ArrowRight, ClipboardList } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HowItWorks() {
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
            <Link href="/how-it-works-page" className="text-green-600 font-medium">
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
              Simple & Effective
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">How Healthy Hoyas Works</h1>
            <p className="text-xl text-gray-600">
              Get started in minutes and see results in days. Our streamlined process makes health tracking effortless
              for busy college students.
            </p>
          </div>
        </div>
      </section>

      {/* Main Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Sign Up & Connect</h2>
                </div>
                <p className="text-lg text-gray-600">
                  Create your free account using your personal email and connect to your university's dining services
                  for seamless meal tracking.
                </p>
                <div className="space-y-3">
                  {/*<div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Verify your Georgetown student status</span>
                  </div> */}
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Connect to dining services automatically</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Set your health goals and preferences</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">That's It!</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Takes less than 2 minutes</span>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Sign up process"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Georgetown Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Meal logging interface"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Smart Autocomplete</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Log Your Meals</h2>
                </div>
                <p className="text-lg text-gray-600">
                  Quickly log meals from Georgetown's cafeterias with our intelligent autocomplete system. Just type a
                  few letters and find your exact meal.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Real-time cafeteria menu integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Automatic calorie and macro calculations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Custom portion size adjustments</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Log meals in under 10 seconds</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Track Your Wellness</h2>
                </div>
                <p className="text-lg text-gray-600">
                  Monitor your sleep, steps, and weight alongside your nutrition. Get a complete picture of your health
                  with minimal effort.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Speedy step counting</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Simple sleep duration logging</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Weekly weight check-ins</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ClipboardList className="w-4 h-4" />
  <span>All your wellness logs in one place</span>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Wellness tracking dashboard"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Real-time Insights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Analytics and insights"
                  width={500}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Smart Analytics</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Analyze & Improve</h2>
                </div>
                <p className="text-lg text-gray-600">
                  View detailed analytics of your health journey with beautiful charts and actionable insights to help
                  you reach your goals.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Interactive charts for all health metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Historical data and trend analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Personalized recommendations</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4" />
                  <span>Data over time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why Students Love Our Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed specifically for the busy college lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Lightning Fast</h3>
                <p className="text-gray-600">
                  Log meals between classes in seconds. No complicated food databases or barcode scanning required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Mobile First</h3>
                <p className="text-gray-600">
                  Works perfectly on your phone. Track your health on the go, whether you're in class or at the gym.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Smart Insights</h3>
                <p className="text-gray-600">
                  Get actionable recommendations based on your data to improve your health and academic performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">How accurate is the cafeteria integration?</h3>
              <p className="text-gray-600">
                We work directly with your college's dining services to ensure our nutritional data is accurate and
                up-to-date. Our database includes all menu items with official nutritional information.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Do I need to manually enter my steps and sleep?</h3>
              <p className="text-gray-600">
                {/*Steps are automatically tracked using your phone's built-in sensors. For sleep, you can either log it
                manually (takes 5 seconds) or connect compatible fitness trackers for automatic tracking. */}
                Right now, sleep tracking is manual — it only takes about 5 seconds to log.
  We're still working on integrating automatic syncing with wearables, and we wish it was already here!
  Thanks for bearing with us while we build it out.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">What if I eat off-campus?</h3>
              <p className="text-gray-600">
                You can easily add custom meals and foods. Our database also includes popular off-campus restaurants
                near Georgetown for quick logging.
              </p>
            </div>

            <div className="space-y-4">
  <h3 className="text-xl font-semibold text-gray-900">Is this really ad-free?</h3>
  <p className="text-gray-600">
    Yes — completely. We never show ads, popups, or sponsored content. Our platform is distraction-free so you can focus
    entirely on your wellness, not revenue-driven interruptions.
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
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <div className="space-y-2">
                <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
                <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
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
