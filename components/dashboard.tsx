"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AlertCircle, PlusCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  getUserMeals,
  getDailyNutritionSummary,
  type MealWithFoodItems,
  type DailyNutritionSummary,
  getUserProfile,
  type UserProfile,
} from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { NutritionRadialCharts } from "@/components/nutrition-radial-chart";
import { CalorieRadialChart } from "@/components/calorie-radial-chart";
import { RecentMeals } from "@/components/recent-meals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeaderDate } from "@/components/page-header-date";

// Default recommended macro distribution
const DEFAULT_PROTEIN_PCT = 25;
const DEFAULT_CARBS_PCT = 50;
const DEFAULT_FAT_PCT = 25;

interface DashboardProps {
  userId: string;
  fallbackSkeletons?: {
    cardSkeleton: React.ReactNode;
    listSkeleton: React.ReactNode;
    statSkeleton: React.ReactNode;
  };
}

export function Dashboard({ userId, fallbackSkeletons }: DashboardProps) {
  const router = useRouter();
  const [meals, setMeals] = useState<MealWithFoodItems[]>([]);
  const [nutritionSummary, setNutritionSummary] =
    useState<DailyNutritionSummary | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Combined profile check and data fetching
  useEffect(() => {
    async function initializeDashboard() {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get user profile using the shared function
        console.log("[Dashboard] Fetching user profile");
        const profile = await getUserProfile(userId);
        
        if (!profile) {
          console.error("[Dashboard] Failed to get or create user profile");
          setError("Failed to load user profile");
          return;
        }
        
        console.log("[Dashboard] Successfully fetched profile:", profile);
        setUserProfile(profile);
        
        // Check if profile is incomplete
        if (!profile.full_name || !profile.age || !profile.height || !profile.weight ||
            !profile.sex || !profile.activity_level || !profile.calorie_goal) {
          console.log("[Dashboard] Incomplete profile detected:", profile);
          // Uncomment when ready to implement profile setup
          // router.push("/profile-setup");
        }

        // Fetch dashboard data
        console.log("[Dashboard] Fetching dashboard data for user:", userId);
        const today = format(new Date(), "yyyy-MM-dd");
        const [mealsData, summaryData] = await Promise.all([
          getUserMeals(userId, 5),
          getDailyNutritionSummary(userId, today),
        ]);

        console.log("[Dashboard] Successfully fetched dashboard data:", {
          meals: mealsData,
          summary: summaryData
        });

        setMeals(mealsData);
        setNutritionSummary(summaryData);
      } catch (error: any) {
        console.error("[Dashboard] Error initializing dashboard:", {
          error,
          errorString: JSON.stringify(error),
          errorKeys: Object.keys(error),
          errorValues: Object.values(error)
        });
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    initializeDashboard();
  }, [userId, router]);

  // Handle meal updates
  const handleMealUpdated = () => {
    if (!userId) return;
    
    const today = format(new Date(), "yyyy-MM-dd");
    Promise.all([
      getUserMeals(userId, 5),
      getDailyNutritionSummary(userId, today),
    ]).then(([mealsData, summaryData]) => {
      setMeals(mealsData);
      setNutritionSummary(summaryData);
    }).catch(error => {
      console.error("[Dashboard] Error updating meal data:", error);
      setError("Failed to update meal data");
    });
  };

  // Calculate macronutrient goals based on TDEE
  const dailyCalorieGoal =
    userProfile?.calorie_goal || userProfile?.tdee || 2000;

  // Use user's custom macro percentages if available, otherwise use defaults
  const proteinPct = userProfile?.protein_pct ?? DEFAULT_PROTEIN_PCT;
  const carbsPct = userProfile?.carbs_pct ?? DEFAULT_CARBS_PCT;
  const fatPct = userProfile?.fat_pct ?? DEFAULT_FAT_PCT;

  // Calculate macro targets based on percentages
  // - Protein: proteinPct% of calories (4 calories per gram)
  // - Carbs: carbsPct% of calories (4 calories per gram)
  // - Fat: fatPct% of calories (9 calories per gram)
  const proteinGoal = Math.round((dailyCalorieGoal * (proteinPct / 100)) / 4);
  const carbsGoal = Math.round((dailyCalorieGoal * (carbsPct / 100)) / 4);
  const fatGoal = Math.round((dailyCalorieGoal * (fatPct / 100)) / 9);

  const macroData = [
    {
      name: "Protein",
      value: nutritionSummary?.total_protein || 0,
      goal: proteinGoal,
      color: "#22c55e",
      unit: "g",
    },
    {
      name: "Carbs",
      value: nutritionSummary?.total_carbs || 0,
      goal: carbsGoal,
      color: "#eab308",
      unit: "g",
    },
    {
      name: "Fat",
      value: nutritionSummary?.total_fat || 0,
      goal: fatGoal,
      color: "#3b82f6",
      unit: "g",
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        {/* Header */}
        <div className="bg-transparent backdrop-blur-md pl-20 pr-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Your health and nutrition overview
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <PageHeaderDate />
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto pl-20 pr-6 py-6">
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-transparent backdrop-blur-md pl-20 pr-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Your health and nutrition overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <PageHeaderDate />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pl-20 pr-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left column - Macros and calories (2/3 width) */}
          <div className="space-y-4 lg:col-span-2">
            {/* Calorie chart takes full width */}
            <CalorieRadialChart
              consumed={nutritionSummary?.total_calories || 0}
              goal={dailyCalorieGoal}
              loading={loading}
              className="w-full h-auto"
            />

            <NutritionRadialCharts
              data={macroData}
              loading={loading}
              className="mt-0"
            />
          </div>

          {/* Right column (1/3 width) */}
          <div className="space-y-4 lg:col-span-1">
            {/* Recent meals */}
            <RecentMeals
              meals={meals}
              loading={loading}
              className="h-full overflow-auto"
              onMealUpdated={handleMealUpdated}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

