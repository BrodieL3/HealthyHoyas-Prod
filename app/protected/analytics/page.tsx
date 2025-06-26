"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2,
  BarChart3,
  BarChart,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  Target,
} from "@/components/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WeightChart } from "@/components/weight-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getUserWeightEntries,
  getUserStepsEntries,
  getUserSleepEntries,
  type WeightEntry,
  type StepsEntry,
  type SleepEntry,
} from "@/lib/supabase";
import { format } from "date-fns";
import { FloatingPageLayout } from "@/components/floating-page-layout";

export default function AnalyticsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [stepsData, setStepsData] = useState<StepsEntry[]>([]);
  const [sleepData, setSleepData] = useState<SleepEntry[]>([]);

  useEffect(() => {
    async function getUserId() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setUserId(data.user?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserId();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      try {
        setLoading(true);

        const [weightEntries, stepsEntries, sleepEntries] = await Promise.all([
          getUserWeightEntries(userId),
          getUserStepsEntries(userId),
          getUserSleepEntries(userId),
        ]);

        setWeightData(weightEntries || []);
        setStepsData(stepsEntries || []);
        setSleepData(sleepEntries || []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Calculate statistics
  const recentSteps = stepsData.slice(0, 7);
  const recentSleep = sleepData.slice(0, 7);
  const recentWeight = weightData.slice(0, 7);

  const avgSteps =
    recentSteps.length > 0
      ? recentSteps.reduce((sum, entry) => sum + entry.steps, 0) /
        recentSteps.length
      : 0;
  const avgSleep =
    recentSleep.length > 0
      ? recentSleep.reduce((sum, entry) => sum + entry.sleep, 0) /
        recentSleep.length
      : 0;
  const currentWeight = weightData.length > 0 ? weightData[0].weight : 0;
  const weightChange =
    weightData.length > 1 ? weightData[0].weight - weightData[1].weight : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">
          Please sign in to view analytics
        </p>
      </div>
    );
  }

  return (
    <FloatingPageLayout
      title="Analytics Dashboard"
      description="Comprehensive insights into your health and fitness journey"
      className="space-y-8"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Steps (7-day avg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {Math.round(avgSteps).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">steps/day</div>
              <Progress value={(avgSteps / 10000) * 100} className="h-2 mt-3" />
              <div className="text-xs text-gray-500 mt-1">
                Goal: 10,000 steps
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Sleep (7-day avg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {avgSleep.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-500">per night</div>
              <Progress value={(avgSleep / 8) * 100} className="h-2 mt-3" />
              <div className="text-xs text-gray-500 mt-1">Goal: 8 hours</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              Weight Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">
                {currentWeight || "—"} {currentWeight ? "lbs" : ""}
              </div>
              <div className="text-sm text-gray-500">current weight</div>
              {weightChange !== 0 && (
                <Badge
                  variant={weightChange > 0 ? "destructive" : "default"}
                  className="mt-3"
                >
                  {weightChange > 0 ? "+" : ""}
                  {weightChange.toFixed(1)} lbs
                </Badge>
              )}
              {weightChange === 0 && currentWeight > 0 && (
                <div className="text-xs text-gray-500 mt-3">
                  No recent change
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="weight" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Weight
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Nutrition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Weight Trend Analysis
              </CardTitle>
              <CardDescription>
                Track your weight progress over time with detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <div className="h-[400px]">
                  <WeightChart weightEntries={weightData} />
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      No weight data available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Start logging your weight to see trends and insights
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Steps History
                </CardTitle>
                <CardDescription>
                  Your daily step counts and activity levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {stepsData.length === 0 ? (
                    <div className="text-center">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        No step data available
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Start tracking your steps to see activity patterns
                      </p>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="text-center mb-6">
                        <div className="text-2xl font-bold text-green-500">
                          {Math.round(avgSteps).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          average daily steps
                        </div>
                      </div>
                      <div className="space-y-3">
                        {recentSteps.slice(0, 5).map((entry, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium">
                              {format(new Date(entry.date), "MMM d")}
                            </span>
                            <span className="font-semibold text-green-500">
                              {entry.steps.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Sleep Patterns
                </CardTitle>
                <CardDescription>
                  Your sleep duration and quality trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {sleepData.length === 0 ? (
                    <div className="text-center">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        No sleep data available
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Start tracking your sleep to see patterns
                      </p>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="text-center mb-6">
                        <div className="text-2xl font-bold text-blue-500">
                          {avgSleep.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-500">
                          average sleep per night
                        </div>
                      </div>
                      <div className="space-y-3">
                        {recentSleep.slice(0, 5).map((entry, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium">
                              {format(new Date(entry.date), "MMM d")}
                            </span>
                            <span className="font-semibold text-blue-500">
                              {entry.sleep}h
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Nutrition Insights
              </CardTitle>
              <CardDescription>
                Analysis of your macro and calorie intake patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    Nutrition analytics coming soon
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Advanced nutrition insights and trends will be available
                    here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FloatingPageLayout>
  );
}
