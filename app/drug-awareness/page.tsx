"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Apple,
  Shield,
  AlertTriangle,
  PlusCircle,
  Pill,
  Brain,
  Droplets,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
  Zap,
  Thermometer,
  TestTube,
  Users,
  FileText,
  Leaf,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DrugAwarenessPage() {
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
            <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/alcohol-awareness" className="text-gray-600 hover:text-gray-900 transition-colors">
              Alcohol Awareness
            </Link>
            <Link href="/drug-awareness" className="text-green-600 font-medium">
              Drug Awareness
            </Link>
          </nav>
          <Link href="/signup">
            <Button className="bg-green-600 hover:bg-green-700">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Shield className="w-3 h-3 mr-1" />
                Health & Safety Information
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Substance Awareness: What Every Student Should Know
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Making informed decisions about substances is part of staying healthy and safe in college. Get the
                facts, understand the risks, and learn harm reduction strategies.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Safety First</span>
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
                alt="Students making informed choices"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Stay Informed</p>
                    <p className="text-sm text-gray-500">Knowledge saves lives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Substances Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Common Substances on Campuses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each substance comes with different effects, risks, and safety considerations. Being informed helps you
              make safer choices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle>Cocaine</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  A stimulant that can cause increased heart rate, anxiety, and aggression. Risk of overdose and heart
                  complications.
                </p>
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Often cut with other dangerous substances.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle>Adderall (non-prescribed)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  A stimulant meant for ADHD treatment. Misuse can lead to heart issues, sleep disruption, and
                  dependence.
                </p>
                <div className="flex items-center space-x-2 text-sm text-orange-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Not safer just because it's a prescription</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-yellow-600" />
                  </div>
                  <CardTitle>Xanax (Alprazolam)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  A benzodiazepine for anxiety. Mixing with alcohol or other depressants increases risk of overdose and
                  blackouts.
                </p>
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Never mix with alcohol or other depressants.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg border-l-4 border-red-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-red-700">Fentanyl</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  A synthetic opioid 50–100x stronger than morphine. Often found in counterfeit pills or mixed into
                  other drugs.
                </p>
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 font-medium">
                    Even tiny amounts can be fatal. Always test substances.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Cannabis (Weed)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  Can cause relaxation, but also anxiety or paranoia in high doses. Impairs short-term memory and motor
                  function.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Legal status varies by state and campus.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Psychedelics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600">
                  Hallucinogens (LSD, psilocybin, etc.) that alter perception and mood. May cause profound experiences
                  but also confusion or panic.
                </p>
                <div className="flex items-center space-x-2 text-sm text-purple-700">
                  <Info className="w-4 h-4" />
                  <span>Effects vary greatly by mindset, dose, and setting.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Harm Reduction Tips */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Harm Reduction Tips</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              If you or someone you know chooses to use substances, these strategies can help reduce risks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Never Use Alone</h3>
                <p className="text-gray-600">
                  Always have a trusted friend nearby who can help if something goes wrong.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Test Your Substances</h3>
                <p className="text-gray-600">
                  Use drug checking kits, especially with pills or powders. They can detect dangerous adulterants.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Start Small</h3>
                <p className="text-gray-600">
                  Begin with a very small amount — strength and contents are unpredictable, especially with new batches.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Don't Mix Substances</h3>
                <p className="text-gray-600">
                  Combining different substances (e.g., Xanax and alcohol) dramatically increases risks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Stay Hydrated</h3>
                <p className="text-gray-600">
                  Drink water regularly, but not excessively. Take breaks and monitor how you're feeling.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Know the Signs</h3>
                <p className="text-gray-600">
                  Learn to recognize signs of overdose and know when to call for help. Don't delay seeking medical
                  attention.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testing Kits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Where to Get Drug Testing Kits</h2>
              <p className="text-lg text-gray-600">
                Testing kits can detect fentanyl and other dangerous substances in pills, powders, or blotters. They're
                legal in most states and could save a life.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Campus Health Center</p>
                    <p className="text-gray-600">
                      Check if your campus health center provides fentanyl or multi-drug test strips.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Harm Reduction Organizations</p>
                    <p className="text-gray-600">
                      Order from harm reduction nonprofits like{" "}
                      <a
                        href="https://dancesafe.org"
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        DanceSafe
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://nextdistro.org"
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NEXT Distro
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Public Health Programs</p>
                    <p className="text-gray-600">
                      Some cities and counties offer free kits through public health programs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                <p className="text-lg text-blue-800">
                  <strong>Remember:</strong> Testing kits are a harm reduction tool, not a guarantee of safety. Always
                  use caution and follow all harm reduction practices.
                </p>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Drug testing kit demonstration"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TestTube className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Knowledge is safety</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Myths vs Reality */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Myths vs. Reality</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Separating fact from fiction can help you make safer choices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-red-50 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-lg">Myth</CardTitle>
                </div>
                <p className="text-gray-700 font-medium mt-2">"Prescription drugs are safe to share."</p>
              </CardHeader>
              <CardContent className="bg-green-50">
                <div className="flex items-center space-x-2 mb-2 mt-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">Reality</CardTitle>
                </div>
                <p className="text-gray-700">
                  Misusing prescriptions can be as dangerous as street drugs, especially when mixed with other
                  substances. Prescriptions are tailored to specific individuals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-red-50 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-lg">Myth</CardTitle>
                </div>
                <p className="text-gray-700 font-medium mt-2">
                  "You can tell if something contains fentanyl by looking."
                </p>
              </CardHeader>
              <CardContent className="bg-green-50">
                <div className="flex items-center space-x-2 mb-2 mt-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">Reality</CardTitle>
                </div>
                <p className="text-gray-700">
                  You can't identify fentanyl by sight, smell, or taste. The only way to detect it is with proper
                  testing. Even tiny amounts can be deadly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-red-50 border-b border-red-100">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-lg">Myth</CardTitle>
                </div>
                <p className="text-gray-700 font-medium mt-2">"Everyone's doing it."</p>
              </CardHeader>
              <CardContent className="bg-green-50">
                <div className="flex items-center space-x-2 mb-2 mt-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">Reality</CardTitle>
                </div>
                <p className="text-gray-700">
                  Most students either don't use substances or use infrequently. Social media and perception often
                  exaggerate usage rates among college students.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Message */}
      <section className="py-20 bg-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Safety Over Judgment</h2>
            <p className="text-xl text-gray-700">
              This isn't about encouraging drug use — it's about being safe, informed, and prepared. Even one decision
              can save a life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/alcohol-awareness">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                >
                  Alcohol Awareness
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Track Your Health
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Thoughts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Students supporting each other"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Final Thoughts</h2>
              <p className="text-lg text-gray-600">
                You're not alone in making cautious, informed choices. Whether you abstain or participate, your safety
                and awareness matter most.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">Know the facts and understand the risks</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700">Protect your friends and look out for each other</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-gray-700">Don't hesitate to ask for help if needed</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-400">
                <p className="text-lg text-purple-800">
                  <strong>Remember:</strong> Your health and safety are always the priority. Make informed decisions and
                  support others in doing the same.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Stay Healthy, Stay Informed</h2>
            <p className="text-xl text-purple-100">
              Track your health metrics, make informed choices, and support your overall wellness with Healthy Hoyas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 bg-white text-purple-600 hover:bg-gray-100"
                >
                  Start Your Health Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-purple-100 text-sm">
              Your health and safety are our priority • Get support when you need it
            </p>
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
                <Link href="/drug-awareness" className="block text-gray-400 hover:text-white transition-colors">
                  Drug Awareness
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
      </footer>
    </div>
  )
}
