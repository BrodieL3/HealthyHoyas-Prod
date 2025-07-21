"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  User,
  Calendar,
  Ruler,
  Scale,
  Heart,
  Activity,
  Target,
  ChevronRight,
} from "lucide-react";

// Reused macro slider component from settings
interface MacroSliderProps {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  onMacroChange: (protein: number, carbs: number, fat: number) => void;
  calorieGoal: number;
}

function MacroSlider({
  proteinPct,
  carbsPct,
  fatPct,
  onMacroChange,
  calorieGoal,
}: MacroSliderProps) {
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, percent: 0 });
  const barRef = useRef<HTMLDivElement>(null);

  const proteinGrams = Math.round((calorieGoal * (proteinPct / 100)) / 4);
  const carbsGrams = Math.round((calorieGoal * (carbsPct / 100)) / 4);
  const fatGrams = Math.round((calorieGoal * (fatPct / 100)) / 9);

  const handleSliderClick = (e: React.MouseEvent) => {
    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));

    const proteinPos = proteinPct;
    const carbsPos = proteinPct + carbsPct;

    const distToProtein = Math.abs(pct - proteinPos);
    const distToCarbs = Math.abs(pct - carbsPos);

    if (distToProtein < distToCarbs) {
      const newProtein = Math.round(pct);
      const newCarbs = Math.max(0, 100 - newProtein - fatPct);
      onMacroChange(newProtein, newCarbs, fatPct);
    } else {
      const newCarbsPos = Math.round(pct);
      const newCarbs = Math.max(0, newCarbsPos - proteinPct);
      onMacroChange(proteinPct, newCarbs, 100 - proteinPct - newCarbs);
    }
  };

  const handleDragStart = (handle: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startPercent =
      handle === "protein" ? proteinPct : proteinPct + carbsPct;

    setIsDragging(handle);
    setDragPosition({ x: startX, percent: startPercent });

    const handleDragMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();

      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / rect.width) * 100;
      const newPercent = Math.min(
        100,
        Math.max(0, startPercent + deltaPercent)
      );

      setDragPosition({ x: moveEvent.clientX, percent: newPercent });

      if (handle === "protein") {
        const newProtein = Math.min(Math.round(newPercent), 100 - fatPct);
        onMacroChange(newProtein, 100 - newProtein - fatPct, fatPct);
      } else {
        const combinedPercent = Math.min(Math.round(newPercent), 100);
        const newCarbs = Math.max(0, combinedPercent - proteinPct);
        onMacroChange(proteinPct, newCarbs, 100 - proteinPct - newCarbs);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(null);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.body.style.cursor = "grabbing";
  };

  const adjustMacro = (type: "protein" | "carbs", value: number) => {
    value = Math.min(100, Math.max(0, value));

    if (type === "protein") {
      const newProtein = value;
      const remainingPct = 100 - newProtein;
      const newCarbs = Math.min(carbsPct, remainingPct);
      const newFat = 100 - newProtein - newCarbs;
      onMacroChange(newProtein, newCarbs, newFat);
    } else if (type === "carbs") {
      const maxCarbs = 100 - proteinPct;
      const newCarbs = Math.min(value, maxCarbs);
      onMacroChange(proteinPct, newCarbs, 100 - proteinPct - newCarbs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative mt-8" ref={barRef} onClick={handleSliderClick}>
        <div className="h-4 w-full rounded-full overflow-hidden flex relative cursor-pointer">
          <div className="bg-green-500" style={{ width: `${proteinPct}%` }} />
          <div className="bg-yellow-500" style={{ width: `${carbsPct}%` }} />
          <div className="bg-blue-500" style={{ width: `${fatPct}%` }} />
        </div>

        {/* Protein Handle */}
        <div
          className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
          style={{
            left: `${
              isDragging === "protein" ? dragPosition.percent : proteinPct
            }%`,
            zIndex: 10,
            transition:
              isDragging === "protein" ? "none" : "left 0.1s ease-out",
          }}
          onMouseDown={handleDragStart("protein")}
        >
          <div className="h-7 w-7 rounded-full bg-white border-2 border-black shadow-md hover:shadow-lg" />
        </div>

        {/* Carbs Handle */}
        <div
          className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
          style={{
            left: `${
              isDragging === "carbs"
                ? dragPosition.percent
                : proteinPct + carbsPct
            }%`,
            zIndex: 10,
            transition: isDragging === "carbs" ? "none" : "left 0.1s ease-out",
          }}
          onMouseDown={handleDragStart("carbs")}
        >
          <div className="h-7 w-7 rounded-full bg-white border-2 border-black shadow-md hover:shadow-lg" />
        </div>
      </div>

      {/* Direct input controls */}
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="font-semibold mb-1 flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full inline-block"></div>
            <span>Protein</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <button
              className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
              onClick={() => adjustMacro("protein", proteinPct - 5)}
            >
              -
            </button>
            <span className="w-12 text-center">{proteinPct}%</span>
            <button
              className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
              onClick={() => adjustMacro("protein", proteinPct + 5)}
            >
              +
            </button>
          </div>
          <div className="text-xs text-muted-foreground">{proteinGrams}g</div>
        </div>

        <div className="text-center">
          <div className="font-semibold mb-1 flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></div>
            <span>Carbs</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <button
              className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
              onClick={() => adjustMacro("carbs", carbsPct - 5)}
            >
              -
            </button>
            <span className="w-12 text-center">{carbsPct}%</span>
            <button
              className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
              onClick={() => adjustMacro("carbs", carbsPct + 5)}
            >
              +
            </button>
          </div>
          <div className="text-xs text-muted-foreground">{carbsGrams}g</div>
        </div>

        <div className="text-center">
          <div className="font-semibold mb-1 flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full inline-block"></div>
            <span>Fat</span>
          </div>
          <div className="w-12 text-center">{fatPct}%</div>
          <div className="text-xs text-muted-foreground">{fatGrams}g</div>
        </div>
      </div>
    </div>
  );
}

// Step data configuration
const STEPS = [
  {
    id: "name",
    title: "What's your name?",
    subtitle: "Let's start with the basics",
    icon: User,
  },
  {
    id: "age",
    title: "How old are you?",
    subtitle: "This helps us calculate your nutritional needs",
    icon: Calendar,
  },
  {
    id: "physical",
    title: "Physical Information",
    subtitle: "Your height and weight help us personalize your goals",
    icon: Ruler,
  },
  {
    id: "activity",
    title: "Activity & Goals",
    subtitle: "Tell us about your lifestyle and what you want to achieve",
    icon: Activity,
  },
  {
    id: "macros",
    title: "Macro Distribution",
    subtitle: "Customize your protein, carbs, and fat ratios",
    icon: Target,
  },
];

type StepId = "name" | "age" | "physical" | "activity" | "macros";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepId>("name");
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinPct, setProteinPct] = useState(25);
  const [carbsPct, setCarbsPct] = useState(50);
  const [fatPct, setFatPct] = useState(25);

  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const activityOptions = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Light Exercise (1-2 days/week)" },
    { value: "moderate", label: "Moderate Exercise (3-5 days/week)" },
    { value: "heavy", label: "Heavy Exercise (6-7 days/week)" },
    { value: "athlete", label: "Athlete (2x per day)" },
  ];

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const calculateTDEE = (): number | null => {
    if (!age || !height || !weight || !sex || !activityLevel) return null;

    const weightKg = parseFloat(weight) * 0.453592;
    const heightCm = parseFloat(height) * 2.54;
    const ageNum = parseInt(age);

    let bmr = 0;
    if (sex === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      athlete: 1.9,
    };

    const multiplier = activityMultipliers[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };

  const handleNext = async () => {
    setError(null);
    setIsAnimating(true);

    // Validate current step
    if (currentStep === "name" && (!firstName.trim() || !lastName.trim())) {
      setError("Please enter both first and last name");
      setIsAnimating(false);
      return;
    }

    if (
      currentStep === "age" &&
      (!age || parseInt(age) < 13 || parseInt(age) > 120)
    ) {
      setError("Please enter a valid age between 13 and 120");
      setIsAnimating(false);
      return;
    }

    if (currentStep === "physical" && (!height || !weight)) {
      setError("Please enter both height and weight");
      setIsAnimating(false);
      return;
    }

    if (
      currentStep === "activity" &&
      (!sex || !activityLevel || !calorieGoal)
    ) {
      setError("Please fill in all fields");
      setIsAnimating(false);
      return;
    }

    // Animation sequence: fade up to top, then fade down to center
    setTimeout(() => {
      const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1].id as StepId);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    // Final validation
    if (proteinPct + carbsPct + fatPct !== 100) {
      setError("Macro percentages must add up to 100%");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        setSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          email: user.email,
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          age: parseInt(age),
          height: parseFloat(height),
          weight: parseFloat(weight),
          sex: sex,
          activity_level: activityLevel,
          calorie_goal: parseInt(calorieGoal),
          macro_settings: {
            protein_pct: proteinPct,
            carbs_pct: carbsPct,
            fat_pct: fatPct,
          },
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Failed to save profile:", updateError);
        setError("Failed to save profile: " + updateError.message);
        setSubmitting(false);
        return;
      }

      // Simulate setup completion
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred");
      setSubmitting(false);
    }
  };

  const handleMacroChange = (protein: number, carbs: number, fat: number) => {
    setProteinPct(protein);
    setCarbsPct(carbs);
    setFatPct(fat);
  };

  const getStepProgress = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
    return ((currentIndex + 1) / STEPS.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentStepData = STEPS.find((step) => step.id === currentStep)!;
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>
              Step {STEPS.findIndex((step) => step.id === currentStep) + 1} of{" "}
              {STEPS.length}
            </span>
            <span>{Math.round(getStepProgress())}% complete</span>
          </div>
        </div>

        {/* Main content card */}
        <Card
          className={`shadow-xl bg-white/95 backdrop-blur-sm border-0 ${
            isAnimating ? "animate-fade-in-up" : "animate-fade-in-down"
          }`}
        >
          <CardContent className="p-8">
            {/* Step header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h1>
              <p className="text-gray-600">{currentStepData.subtitle}</p>
            </div>

            {/* Step content */}
            <div className="space-y-6">
              {currentStep === "name" && (
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                </div>
              )}

              {currentStep === "age" && (
                <div>
                  <Input
                    type="number"
                    placeholder="Your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="13"
                    max="120"
                    className="h-12 text-lg text-center"
                  />
                </div>
              )}

              {currentStep === "physical" && (
                <div className="space-y-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Height (inches)"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Weight (pounds)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      step="0.1"
                      className="h-12 text-lg"
                    />
                  </div>
                </div>
              )}

              {currentStep === "activity" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Sex
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {sexOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={sex === option.value ? "default" : "outline"}
                          className="h-12 text-base"
                          onClick={() => setSex(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Activity Level
                    </p>
                    <div className="space-y-2">
                      {activityOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            activityLevel === option.value
                              ? "default"
                              : "outline"
                          }
                          className="w-full h-12 text-sm justify-start"
                          onClick={() => setActivityLevel(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {activityLevel && sex && height && weight && age && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        Recommended daily calories:
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {calculateTDEE()} kcal
                      </p>
                    </div>
                  )}

                  <div>
                    <Input
                      type="number"
                      placeholder="Daily calorie goal"
                      value={calorieGoal}
                      onChange={(e) => setCalorieGoal(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                </div>
              )}

              {currentStep === "macros" && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 text-center">
                    Adjust your macro distribution by dragging the handles or
                    using the buttons
                  </p>

                  <MacroSlider
                    proteinPct={proteinPct}
                    carbsPct={carbsPct}
                    fatPct={fatPct}
                    onMacroChange={handleMacroChange}
                    calorieGoal={parseInt(calorieGoal) || 2000}
                  />

                  <div className="text-xs text-center text-gray-500">
                    Recommended: 25% protein / 50% carbs / 25% fat
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm animate-shake">
                  {error}
                </div>
              )}

              {/* Action button */}
              <div className="pt-4">
                {currentStep === "macros" ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Setting up your profile...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <Heart className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={isAnimating}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
