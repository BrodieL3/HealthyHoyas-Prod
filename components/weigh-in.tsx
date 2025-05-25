"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeightChart } from "@/components/weight-chart";
import {
  CheckCircle2,
  AlertCircle,
  Weight,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  saveWeightEntry,
  getUserWeightEntries,
  type WeightEntry,
} from "@/lib/supabase";
import { dataEntryToasts, errorToasts, loadingToasts } from "@/lib/toast-utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Define props type
interface WeighInProps {
  userId: string;
}

// Weight Form Component - Static (doesn't require server data)
function WeightForm({
  userId,
  onWeightLogged,
}: {
  userId: string;
  onWeightLogged: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight) {
      setValidationError(true);
      setTimeout(() => setValidationError(false), 500);
      return;
    }

    if (!userId) {
      errorToasts.auth();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const weightValue = parseFloat(weight);

      if (isNaN(weightValue) || weightValue <= 0) {
        setValidationError(true);
        errorToasts.invalidWeight();
        setIsLoading(false);
        setTimeout(() => setValidationError(false), 500);
        return;
      }

      // Show loading toast
      const loadingToastId = loadingToasts.saving("weight");

      const result = await saveWeightEntry(userId, weightValue);

      if (result) {
        setSubmitted(true);
        setWeight("");

        // Show success toast
        dataEntryToasts.weightLogged(weightValue);

        // Notify parent to refresh data
        onWeightLogged();

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        errorToasts.saveFailed("weight");
      }
    } catch (error) {
      console.error("Error saving weight:", error);
      errorToasts.generic("An error occurred while saving your weight.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card
        hoverable
        className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift"
      >
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Scale className="h-5 w-5 mr-2 text-blue-500 animate-wiggle" />
            Record Your Weight
          </CardTitle>
          <CardDescription>
            Keep track of your progress by logging your weight regularly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 animate-bounce-in">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-pulse-success" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-up">
                Weight Logged Successfully!
              </h3>
              <p className="text-gray-600 text-center animate-fade-in-up">
                Your weight data has been updated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-shake">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-base font-medium">
                  Current Weight
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 165"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                      className="pl-10 h-12"
                      disabled={isLoading}
                      min="0"
                      step="0.1"
                      error={validationError}
                    />
                  </div>
                  <span className="text-gray-600 font-medium">lbs</span>
                </div>
                <p className="text-xs text-gray-500">
                  Enter your weight to the nearest 0.1 lb
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={isLoading || !userId}
                size="lg"
                loading={isLoading}
              >
                {!isLoading && (
                  <>
                    <Scale className="mr-2 h-5 w-5" />
                    Log Weight
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Chart Card - Static UI, data loaded separately */}
      <Card hoverable className="hover-lift">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Weight Trend
          </CardTitle>
          <CardDescription>Your weight progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full animate-shimmer" />
                </div>
              }
            >
              <WeightChartWrapper userId={userId} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Chart wrapper for data fetching
function WeightChartWrapper({ userId }: { userId: string }) {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const entries = await getUserWeightEntries(userId);
        setWeightEntries(entries);
      } catch (error) {
        console.error("Error fetching weight entries:", error);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return <WeightChart weightEntries={weightEntries} />;
}

// Weight Statistics Component - Dynamic (requires server data)
function WeightStatistics({
  userId,
  refreshTrigger,
}: {
  userId: string;
  refreshTrigger: number;
}) {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        setIsLoading(true);
        const entries = await getUserWeightEntries(userId);
        setWeightEntries(entries);
      } catch (error) {
        console.error("Error fetching weight entries:", error);
        setError("Failed to load weight history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId, refreshTrigger]);

  // Calculate weight statistics
  const recentEntries = weightEntries.slice(0, 7); // Last 7 entries
  const currentWeight = weightEntries.length > 0 ? weightEntries[0].weight : 0;
  const previousWeight =
    weightEntries.length > 1 ? weightEntries[1].weight : currentWeight;
  const weightChange = currentWeight - previousWeight;

  // Calculate monthly weight change
  const getMonthlyWeightChange = () => {
    if (weightEntries.length === 0) return null;

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Find the weight entry closest to one month ago
    const monthlyEntry = weightEntries.find((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate <= oneMonthAgo;
    });

    if (!monthlyEntry) return null;

    const monthlyChange = currentWeight - monthlyEntry.weight;
    return monthlyChange;
  };

  const monthlyChange = getMonthlyWeightChange();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-500" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weightEntries.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {currentWeight} lbs
                </div>
                <div className="text-sm text-gray-500">current weight</div>
              </div>

              {weightChange !== 0 && (
                <div className="text-center">
                  <Badge
                    variant={weightChange > 0 ? "destructive" : "default"}
                    className="px-3 py-1"
                  >
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} lbs
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    since last entry
                  </div>
                </div>
              )}

              {monthlyChange !== null && (
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      {monthlyChange > 0 ? "+" : ""}
                      {monthlyChange.toFixed(1)} lbs since last month
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No weight data yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Log your first weight to see statistics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Weight Entries */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry, index) => {
                const prevEntry = recentEntries[index + 1];
                const change = prevEntry ? entry.weight - prevEntry.weight : 0;

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {format(new Date(entry.date), "MMM d")}
                      </div>
                      {change !== 0 && (
                        <div
                          className={`text-xs ${
                            change > 0 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {change > 0 ? "+" : ""}
                          {change.toFixed(1)} lbs
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-500">
                        {entry.weight} lbs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Weight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No entries yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start logging to see your weight history
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page Component
function WeightContent({ userId }: { userId: string }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWeightLogged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <WeightForm userId={userId} onWeightLogged={handleWeightLogged} />
      <Suspense
        fallback={
          <div className="space-y-6">
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <WeightStatistics userId={userId} refreshTrigger={refreshTrigger} />
      </Suspense>
    </>
  );
}

export function WeighIn({ userId }: WeighInProps) {
  return <WeightContent userId={userId} />;
}
