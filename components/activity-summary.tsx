"use client";

import { format } from "date-fns";
import { Footprints, Moon, Weight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StepsEntry, SleepEntry, WeightEntry } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ActivitySummaryProps {
  stepsEntry?: StepsEntry;
  sleepEntry?: SleepEntry;
  weightEntry?: WeightEntry;
  loading?: boolean;
  compact?: boolean;
}

export function ActivitySummary({
  stepsEntry,
  sleepEntry,
  weightEntry,
  loading = false,
  compact = false,
}: ActivitySummaryProps) {
  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "text-green-600";
    if (quality >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
      )}
    >
      <Card className={compact ? "h-auto" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Footprints className="mr-2 h-4 w-4" />
            Most Recent Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-16 w-full" />
          ) : stepsEntry ? (
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between items-center">
                <span>Steps:</span>
                <span>{stepsEntry.steps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quality (1–10):</span>
                <span className={getQualityColor(stepsEntry.steps_quality)}>
                  {stepsEntry.steps_quality}
                </span>
              </div>
              {!compact && (
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                  <span>Date:</span>
                  <span>
                    {format(new Date(stepsEntry.date), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No step data available.
            </p>
          )}
          {!compact && (
            <Button variant="ghost" className="w-full mt-4" asChild>
              <a href="/steps">
                Record Steps
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {compact && sleepEntry && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              Most Recent Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between items-center">
                  <span>Slept:</span>
                  <span>{sleepEntry.sleep} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Quality (1–10):</span>
                  <span className={getQualityColor(sleepEntry.sleep_quality)}>
                    {sleepEntry.sleep_quality}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!compact && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Moon className="mr-2 h-4 w-4" />
                Most Recent Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : sleepEntry ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Slept:</span>
                    <span>{sleepEntry.sleep} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality (1–10):</span>
                    <span className={getQualityColor(sleepEntry.sleep_quality)}>
                      {sleepEntry.sleep_quality}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                    <span>Date:</span>
                    <span>
                      {format(new Date(sleepEntry.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sleep data available.
                </p>
              )}
              <Button variant="ghost" className="w-full mt-4" asChild>
                <a href="/sleep">
                  Record Sleep
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Weight className="mr-2 h-4 w-4" />
                Most Recent Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : weightEntry ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Weight:</span>
                    <span>{weightEntry.weight} lbs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                    <span>Date:</span>
                    <span>
                      {format(new Date(weightEntry.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No weight entries found.
                </p>
              )}
              <Button variant="ghost" className="w-full mt-4" asChild>
                <a href="/weight">
                  Record Weight
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
