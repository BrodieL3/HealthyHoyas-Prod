"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { saveSleepEntry } from "@/lib/supabase/health";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Moon, CheckCircle2, AlertCircle } from "lucide-react";
import { dataEntryToasts, errorToasts, loadingToasts } from "@/lib/toast-utils";

export function UserSleepForm({
  onSleepLogged,
}: {
  onSleepLogged: () => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sleep, setSleep] = useState("");
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sleep) {
      setValidationError(true);
      setTimeout(() => setValidationError(false), 500);
      return;
    }

    if (!user?.id) {
      errorToasts.auth();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sleepValue = parseFloat(sleep);
      const qualityValue = sleepQuality[0];

      if (isNaN(sleepValue) || sleepValue <= 0) {
        setValidationError(true);
        errorToasts.invalidSleep();
        setIsLoading(false);
        setTimeout(() => setValidationError(false), 500);
        return;
      }

      // Show loading toast
      const loadingToastId = loadingToasts.saving("sleep");

      const today = new Date().toISOString().split("T")[0];

      const result = await saveSleepEntry({
        userId: user.id,
        sleep: sleepValue,
        sleep_quality: qualityValue,
        date: today,
      });

      if (result) {
        setSubmitted(true);
        setSleep("");
        setSleepQuality([7]);

        // Show success toast
        dataEntryToasts.sleepLogged(sleepValue);
        onSleepLogged();

        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        errorToasts.saveFailed("sleep");
      }
    } catch (error) {
      console.error("Error saving sleep:", error);
      errorToasts.generic("An error occurred while saving your sleep data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardContent className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardContent className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Please sign in to log sleep</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Moon className="h-5 w-5 mr-2 text-blue-500 animate-wiggle" />
          Log Your Sleep
        </CardTitle>
        <CardDescription>
          Track your sleep duration and quality to monitor your rest patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 animate-bounce-in">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 animate-pulse-success" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-up">
              Sleep Logged Successfully!
            </h3>
            <p className="text-gray-600 text-center animate-fade-in-up">
              Your sleep data has been recorded.
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
              <Label htmlFor="sleep" className="text-base font-medium">
                Hours of Sleep
              </Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="sleep"
                    type="number"
                    placeholder="e.g., 8.5"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    required
                    className="pl-10 h-12"
                    disabled={isLoading}
                    min="0"
                    max="24"
                    step="0.5"
                    error={validationError}
                  />
                </div>
                <span className="text-gray-600 font-medium">hours</span>
              </div>
              <p className="text-xs text-gray-500">
                Enter to the nearest 0.5 hour
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">
                Sleep Quality: {sleepQuality[0]}/10
              </Label>
              <div className="px-2">
                <Slider
                  value={sleepQuality}
                  onValueChange={setSleepQuality}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isLoading || !user?.id}
              size="lg"
              loading={isLoading}
            >
              {!isLoading && (
                <>
                  <Moon className="mr-2 h-5 w-5" />
                  Log Sleep
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
