"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Atom } from "lucide-react";

// Nutrient requirements from the CSV file
const NUTRIENT_REQUIREMENTS = {
  "Saturated Fat": 20.0, // g
  "Trans Fat": 2.0, // g
  Cholesterol: 300.0, // mg
  Sodium: 2300.0, // mg
  "Dietary Fiber": 28.0, // g
  Sugars: 50.0, // g
  Calcium: 1300.0, // mg
  Iron: 18.0, // mg
  Potassium: 4700.0, // mg
  "Vitamin D": 20.0, // mcg
};

const NUTRIENT_UNITS = {
  "Saturated Fat": "g",
  "Trans Fat": "g",
  Cholesterol: "mg",
  Sodium: "mg",
  "Dietary Fiber": "g",
  Sugars: "g",
  Calcium: "mg",
  Iron: "mg",
  Potassium: "mg",
  "Vitamin D": "mcg",
};

interface MicronutrientTrackerProps {
  userId?: string;
  loading?: boolean;
  className?: string;
  // Accept nutrition summary to make it reactive
  nutritionSummary?: {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
  } | null;
}

export function MicronutrientTracker({
  userId,
  loading = false,
  className,
  nutritionSummary,
}: MicronutrientTrackerProps) {
  // Calculate micronutrient intake based on macros consumed
  // This is a simplified estimation - in a real app you'd track actual micronutrients
  const [micronutrientIntake, setMicronutrientIntake] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (nutritionSummary) {
      // Estimate micronutrients based on total calorie consumption
      // These are rough estimates and would be much more accurate with real micronutrient tracking
      const calorieRatio = (nutritionSummary.total_calories || 0) / 2000; // Assuming 2000 cal baseline

      setMicronutrientIntake({
        "Saturated Fat": Math.min((nutritionSummary.total_fat || 0) * 0.3, 20), // Estimate 30% of fat is saturated
        "Trans Fat": Math.min((nutritionSummary.total_fat || 0) * 0.02, 2), // Estimate 2% of fat is trans
        Cholesterol: Math.min(calorieRatio * 150, 300), // Estimate based on calories
        Sodium: Math.min(calorieRatio * 1800, 2300), // Estimate based on calories
        "Dietary Fiber": Math.min(calorieRatio * 20, 28), // Estimate based on calories
        Sugars: Math.min((nutritionSummary.total_carbs || 0) * 0.4, 50), // Estimate 40% of carbs are sugars
        Calcium: Math.min(calorieRatio * 800, 1300), // Estimate based on calories
        Iron: Math.min(calorieRatio * 12, 18), // Estimate based on calories
        Potassium: Math.min(calorieRatio * 3000, 4700), // Estimate based on calories
        "Vitamin D": Math.min(calorieRatio * 10, 20), // Estimate based on calories
      });
    } else {
      // Reset to zero if no nutrition data
      setMicronutrientIntake({
        "Saturated Fat": 0,
        "Trans Fat": 0,
        Cholesterol: 0,
        Sodium: 0,
        "Dietary Fiber": 0,
        Sugars: 0,
        Calcium: 0,
        Iron: 0,
        Potassium: 0,
        "Vitamin D": 0,
      });
    }
  }, [nutritionSummary]);

  if (loading) {
    return (
      <Card
        className={`shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift ${className}`}
      >
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Atom className="h-5 w-5 mr-2 text-purple-500" />
          Micronutrients
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Daily intake vs recommended amounts (estimated)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 pr-4">
          {Object.entries(NUTRIENT_REQUIREMENTS).map(
            ([nutrient, requirement]) => {
              const intake = micronutrientIntake[nutrient] || 0;
              const percentage = Math.round((intake / requirement) * 100);
              const unit =
                NUTRIENT_UNITS[nutrient as keyof typeof NUTRIENT_UNITS];

              // Color coding based on percentage
              let progressColor = "bg-red-500";
              if (percentage >= 100) progressColor = "bg-green-500";
              else if (percentage >= 75) progressColor = "bg-yellow-500";
              else if (percentage >= 50) progressColor = "bg-orange-500";

              return (
                <div key={nutrient} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">
                      {nutrient}
                    </span>
                    <span className="text-gray-600">
                      {intake.toFixed(1)}
                      {unit} / {requirement}
                      {unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="flex-1 h-2"
                    />
                    <span
                      className={`text-xs font-medium min-w-[3rem] text-right ${
                        percentage >= 100
                          ? "text-green-600"
                          : percentage >= 75
                          ? "text-yellow-600"
                          : percentage >= 50
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="mt-4 text-xs text-gray-500 border-t pt-3">
          <p>
            💡 Values are estimated based on your calorie and macronutrient
            intake. For precise micronutrient tracking, consider a detailed
            nutrition app.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
