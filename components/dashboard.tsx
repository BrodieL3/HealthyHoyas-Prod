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
  fallbackSkeletons?: {
    cardSkeleton: React.ReactNode;
    listSkeleton: React.ReactNode;
    statSkeleton: React.ReactNode;
  };
}

export function Dashboard({ fallbackSkeletons }: DashboardProps) {
  const router = useRouter();
  const [meals, setMeals] = useState<MealWithFoodItems[]>([]);
  const [nutritionSummary, setNutritionSummary] =
    useState<DailyNutritionSummary | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Ensure profile exists after login
  useEffect(() => {
    async function ensureProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, create it with defaults
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: user.email?.split("@")[0] || "User",
            macro_settings: {
              protein_pct: 25,
              carbs_pct: 50,
              fat_pct: 25,
            },
          });
        if (insertError) {
          console.error("Error creating user profile (client):", insertError);
        } else {
          // Optionally, refetch dashboard data
          fetchDashboardData();
        }
      }
    }
    ensureProfile();
  }, []);

  // Redirect to profile setup if profile is missing or incomplete
  useEffect(() => {
    async function checkProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      // You can add more checks for completeness if you want
      if (!profile || !profile.full_name || !profile.age || !profile.height || !profile.weight ||
        !profile.sex || !profile.activity_level || !profile.calorie_goal) 
        {
        router.push("/profile-setup");
      }
    }
    checkProfile();
  }, [router]);

  // Function to fetch dashboard data
  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in to view your dashboard");
        return;
      }

      const today = format(new Date(), "yyyy-MM-dd");
      const [mealsData, summaryData, profileData] = await Promise.all([
        getUserMeals(user.id, 5),
        getDailyNutritionSummary(user.id, today),
        getUserProfile(user.id),
      ]);

      setMeals(mealsData);
      setNutritionSummary(summaryData);
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Handle meal updates
  const handleMealUpdated = () => {
    fetchDashboardData();
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
