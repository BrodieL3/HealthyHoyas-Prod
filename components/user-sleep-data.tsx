"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserSleepEntries } from "@/lib/supabase/health";
import type { SleepEntry } from "@/lib/supabase/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BarChart3, Target, Moon } from "lucide-react";
import { format } from "date-fns";

export function UserSleepData({ refreshTrigger }: { refreshTrigger: number }) {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [recentEntries, setRecentEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const entries = await getUserSleepEntries(user.id);
        setRecentEntries(entries?.slice(0, 7) || []);
      } catch (error) {
        console.error("Error fetching sleep data:", error);
        setRecentEntries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id, refreshTrigger]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardContent className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardContent className="flex justify-center items-center py-12">
            <p className="text-muted-foreground">
              Please sign in to view sleep data
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader>
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-2 w-full bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const sleepGoal = 8;
  const qualityGoal = 8;
  const avgSleep =
    recentEntries.length > 0
      ? recentEntries.reduce((sum, entry) => sum + entry.sleep, 0) /
        recentEntries.length
      : 0;
  const avgQuality =
    recentEntries.length > 0
      ? recentEntries.reduce((sum, entry) => sum + entry.sleep_quality, 0) /
        recentEntries.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Sleep Statistics */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Sleep Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentEntries.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Sleep:</span>
                  <span className="font-semibold text-blue-500">
                    {avgSleep.toFixed(1)}h
                  </span>
                </div>
                <Progress
                  value={(avgSleep / sleepGoal) * 100}
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
                  <span className="text-sm text-gray-600">Sleep Goal:</span>
                  <span className="font-semibold text-gray-900">
                    {sleepGoal}h/night
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No sleep data yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Log your first sleep entry to see statistics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sleep Entries */}
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
                      Quality: {entry.sleep_quality}/10
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-500">
                      {entry.sleep}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Moon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No entries yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start logging to see your sleep history
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
