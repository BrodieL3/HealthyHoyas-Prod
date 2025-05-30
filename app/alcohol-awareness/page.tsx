"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Apple,
  Shield,
  AlertTriangle,
  Heart,
  Users,
  Clock,
  Droplets,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AlcoholAwarenessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header 
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Healthy Hoyas</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/alcohol-awareness" className="text-green-600 font-medium">
              Alcohol Awareness
            </Link>
          </nav>
          <Link href="/signup">
            <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
          </Link>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3 mr-1" />
                Health & Safety Information
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Alcohol Awareness: What Every Student Should Know
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Making informed decisions about alcohol is part of staying healthy in college. Get the facts, understand
                the risks, and learn how to stay safe.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Your Health Matters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Look Out for Each Other</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Students making healthy choices"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Stay Informed</p>
                    <p className="text-sm text-gray-500">Make smart choices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Drink Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What Is a "Standard Drink"?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not all drinks are created equal. A "standard" drink contains{" "}
              <strong>about 14 grams (0.6 oz) of pure alcohol</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Beer</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="text-2xl font-bold text-gray-900">12 oz</p>
                <p className="text-gray-600">~5% ABV</p>
                <p className="text-sm text-gray-500">355 mL serving</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Wine</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="text-2xl font-bold text-gray-900">5 oz</p>
                <p className="text-gray-600">~12% ABV</p>
                <p className="text-sm text-gray-500">148 mL serving</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Hard Liquor</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="text-2xl font-bold text-gray-900">1.5 oz</p>
                <p className="text-gray-600">~40% ABV</p>
                <p className="text-sm text-gray-500">44 mL shot</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-lg text-blue-800">
              <strong>ABV</strong> = Alcohol by Volume. All three examples above contain the same amount of pure
              alcohol.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Understanding Safe Limits</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Knowledge is power when it comes to making informed decisions about alcohol consumption.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">Moderate Drinking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Men:</span>
                    <span>Up to 2 drinks per day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Women:</span>
                    <span>Up to 1 drink per day</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-red-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-red-700">Binge Drinking (Unsafe)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Men:</span>
                    <span>5+ drinks in ~2 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Women:</span>
                    <span>4+ drinks in ~2 hours</span>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">
                  Alcohol poisoning can be fatal. Never leave someone passed out alone. Call for help immediately.
                </AlertDescription>
              </Alert>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Students supporting each other"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Beer vs. Wine vs. Liquor</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding the differences can help you make informed choices
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Factor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Beer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Wine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Liquor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ABV Range</td>
                    <td className="px-6 py-4 text-sm text-gray-600">4–6%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">11–15%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">35–50%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Serving Size</td>
                    <td className="px-6 py-4 text-sm text-gray-600">12 oz</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5 oz</td>
                    <td className="px-6 py-4 text-sm text-gray-600">1.5 oz</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Common Usage</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Social, casual</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Dinner, celebrations</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Shots, mixed drinks</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Risk Level</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">Lower (per drink)</td>
                    <td className="px-6 py-4 text-sm text-yellow-600 font-medium">Moderate</td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">Higher (easy to overconsume)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-400">
            <p className="text-lg text-yellow-800">
              <strong>Important:</strong> Liquor is small in volume but high in potency — it's easy to lose track of
              intake.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Tips for Safer Drinking</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              If you choose to drink, these strategies can help reduce risks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Eat First</h3>
                <p className="text-gray-600">
                  Food slows alcohol absorption and helps your body process it more safely.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Stay Hydrated</h3>
                <p className="text-gray-600">Drink water between alcoholic beverages. Alcohol dehydrates your body.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Pace Yourself</h3>
                <p className="text-gray-600">
                  Limit yourself to 1 drink per hour maximum to give your body time to process.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Avoid Mixing</h3>
                <p className="text-gray-600">
                  Don't mix alcohol with medications or energy drinks - dangerous interactions can occur.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Know Your Limits</h3>
                <p className="text-gray-600">
                  Understand your personal tolerance and respect your friends' limits too.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Plan Ahead</h3>
                <p className="text-gray-600">
                  Have a safe way home planned and designate a sober driver or use rideshare.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reality Check */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Do Most Students Actually Drink?</h2>
              <p className="text-lg text-gray-600">
                Despite what you might hear, <strong>not all college students drink alcohol</strong> — and most who do,
                drink in moderation.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">40%</span>
                  </div>
                  <p className="text-gray-700">
                    About 40% of college students report drinking heavily in the past two weeks
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs">25%</span>
                  </div>
                  <p className="text-gray-700">Nearly 1 in 4 students choose not to drink at all</p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mt-1">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-700">
                    Many overestimate how much their peers are drinking — it's called{" "}
                    <em>"social norm misperception"</em>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
                <p className="text-lg text-green-800">
                  <strong>Bottom line:</strong> You're not alone if you drink moderately, or not at all — and the
                  healthiest choice is always the informed one.
                </p>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Diverse group of students"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Important Message */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Just Because It's Legal Doesn't Mean It's Safe
            </h2>
            <p className="text-xl text-blue-100">
              Many students feel pressure to drink — but you're not alone if you choose not to.
              <strong className="text-white"> Be smart, stay safe, and look out for each other.</strong>
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100"
                >
                  Track Your Health Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div> */}
            <p className="text-blue-100 text-sm">
              Your health and safety are our priority • Get support when you need it
            </p>
          </div>
        </div>
      </section>

      {/* Help Resources */}
<section className="py-20 bg-green-50">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
      Need Help? You’re Not Alone
    </h2>
    <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
      If you or someone you know has had too much to drink, reach out right away. Your campus and national resources are here 24/7.
    </p>
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
      {/* Campus Resources */}
<div>
  <Card className="border-0 shadow-lg p-6 flex flex-col h-full">
    <CardHeader className="text-left pb-4">
      <CardTitle className="text-2xl font-semibold text-gray-900">
        On-Campus Support
      </CardTitle>
      <p className="text-sm text-gray-600 mt-1">
      It’s vital to know your university’s hotlines:
      </p>
    </CardHeader>
    <CardContent className="mt-4 space-y-4 flex-grow">
      <div className="flex items-start space-x-3">
        <Shield className="w-6 h-6 text-green-600 mt-1" />
        <span className="font-medium text-gray-800">Student Health Center</span>
      </div>
      <div className="flex items-start space-x-3">
        <Users className="w-6 h-6 text-blue-600 mt-1" />
        <span className="font-medium text-gray-800">Counseling &amp; Psychological Services</span>
      </div>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
        <span className="font-medium text-gray-800">Campus Security</span>
      </div>
    </CardContent>
  </Card>
</div>

      {/* National Hotlines */}
      <div>
        <Card className="border-0 shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-xl">National Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>988 Suicide & Crisis Lifeline:</strong> Call or text{" "}
              <a href="tel:988" className="text-green-600 underline">
                988
              </a>
              , available 24/7.
            </p>
            <p>
              <strong>SAMHSA Helpline:</strong> Substance misuse support,{" "}
              <a href="tel:1-800-662-4357" className="text-green-600 underline">
                1-800-662-HELP
              </a>
              .
            </p>
            <p>
              <strong>Alcoholics Anonymous:</strong> Find meetings at{" "}
              <Link
                href="https://aa.org"
                className="text-green-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                aa.org
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-8">
      If it’s an emergency, always call 911 or your campus security immediately.
    </p>
  </div>
</section>


      {/* Footer 
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
                <Link href="/features" className="block text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="/how-it-works" className="block text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Health & Safety</h4>
              <div className="space-y-2">
                <Link href="/alcohol-awareness" className="block text-gray-400 hover:text-white transition-colors">
                  Alcohol Awareness
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                  Contact Us
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
      </footer> */}
    </div>
  )
}
