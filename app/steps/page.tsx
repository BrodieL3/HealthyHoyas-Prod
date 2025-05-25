"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Loader2,
  Footprints,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  CalendarIcon,
  Trophy,
} from "@/components/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  saveStepsEntry,
  getUserStepsEntries,
  type StepsEntry,
} from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { FloatingPageLayout } from "@/components/floating-page-layout";

// Steps Form Component - Static (doesn't require server data)
function StepsForm({
  userId,
  onStepsLogged,
}: {
  userId: string;
  onStepsLogged: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [steps, setSteps] = useState<number | "">("");
  const [quality, setQuality] = useState<number>(7);
  const [date, setDate] = useState<Date>(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !steps) return;

    setSubmitting(true);

    try {
      await saveStepsEntry({
        userId,
        steps: Number(steps),
        steps_quality: quality,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`,
      });

      toast.success("Steps logged successfully!");
      setSteps("");
      setQuality(7);
      setDate(new Date());

      // Notify parent to refresh data
      onStepsLogged();
    } catch (error) {
      console.error("Error saving steps:", error);
      toast.error("Failed to log steps. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-2">
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Footprints className="h-5 w-5 mr-2 text-green-500" />
            Log Your Steps
          </CardTitle>
          <CardDescription>
            Keep track of your daily steps and how you felt about your activity
            level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="steps" className="text-base font-medium">
                  Steps Count
                </Label>
                <div className="relative">
                  <Footprints className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g. 10000"
                    value={steps}
                    onChange={(e) =>
                      setSteps(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    min="0"
                    required
                    className="pl-10 h-12"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: 10,000 steps per day
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Date</Label>
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date || new Date());
                        setOpenDatePicker(false);
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-gray-500">
                  Select the date for this entry
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quality" className="text-base font-medium">
                  Activity Quality
                </Label>
                <Badge variant="secondary" className="px-3 py-1">
                  {quality}/10
                </Badge>
              </div>
              <Slider
                id="quality"
                min={1}
                max={10}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Low (1)</span>
                <span>Medium (5)</span>
                <span>High (10)</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={submitting || !steps}
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging Steps...
                </>
              ) : (
                <>
                  <Footprints className="mr-2 h-5 w-5" />
                  Log Steps
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Steps Statistics Component - Dynamic (requires server data)
function StepsStatistics({
  userId,
  refreshTrigger,
}: {
  userId: string;
  refreshTrigger: number;
}) {
  const [recentEntries, setRecentEntries] = useState<StepsEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const entries = await getUserStepsEntries(userId);
        setRecentEntries(entries ? entries.slice(0, 7) : []);
      } catch (error) {
        console.error("Error fetching steps entries:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId, refreshTrigger]);

  // Calculate statistics
  const avgSteps =
    recentEntries.length > 0
      ? recentEntries.reduce((sum, entry) => sum + entry.steps, 0) /
        recentEntries.length
      : 0;
  const avgQuality =
    recentEntries.length > 0
      ? recentEntries.reduce((sum, entry) => sum + entry.steps_quality, 0) /
        recentEntries.length
      : 0;
  const stepsGoal = 10000;
  const qualityGoal = 8;

  // Get today's steps if available
  const today = new Date();
  const todayEntry = recentEntries.find(
    (entry) =>
      entry.date ===
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}`
  );
  const todaySteps = todayEntry?.steps || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
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

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
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
                  <div className="text-right">
                    <Skeleton className="h-5 w-16 mb-1" />
                    <Skeleton className="h-3 w-8" />
                  </div>
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
      {/* Steps Statistics */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Steps:</span>
                  <span className="font-semibold text-green-500">
                    {Math.round(avgSteps).toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(avgSteps / stepsGoal) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Average Quality:
                  </span>
                  <span className="font-semibold text-purple-500">
                    {avgQuality.toFixed(1)}/10
                  </span>
                </div>
                <Progress
                  value={(avgQuality / qualityGoal) * 100}
                  className="h-2"
                />
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Daily Goal:</span>
                  <span className="font-semibold text-gray-900">
                    {stepsGoal.toLocaleString()} steps
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No activity data yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Log your first steps to see statistics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Steps Entries */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {format(new Date(entry.date), "MMM d")}
                    </div>
                    <div className="text-xs text-gray-500">
                      Quality: {entry.steps_quality}/10
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-500">
                      {entry.steps.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">steps</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Footprints className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No entries yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start logging to see your activity history
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page Component
function StepsContent({ userId }: { userId: string }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStepsLogged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <StepsForm userId={userId} onStepsLogged={handleStepsLogged} />
      <Suspense
        fallback={
          <div className="space-y-6">
            <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
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
        <StepsStatistics userId={userId} refreshTrigger={refreshTrigger} />
      </Suspense>
    </>
  );
}

export default function StepsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <FloatingPageLayout
      title="Step Tracking"
      description="Monitor your daily activity and reach your fitness goals"
      className="grid-cols-1 lg:grid-cols-3"
    >
      {loading ? (
        <div className="lg:col-span-3 flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !userId ? (
        <div className="lg:col-span-3 flex justify-center items-center py-12">
          <p className="text-muted-foreground">Please sign in to track steps</p>
        </div>
      ) : (
        <StepsContent userId={userId} />
      )}
    </FloatingPageLayout>
  );
}
