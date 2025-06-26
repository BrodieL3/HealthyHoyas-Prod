"use client";

import { useState, Suspense, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSleepForm } from "@/components/user-sleep-form";
import { UserSleepData } from "@/components/user-sleep-data";
import { FloatingPageLayout } from "@/components/floating-page-layout";
import { createClient } from "@/lib/supabase";

// Static Shell Component - renders immediately without user data
function SleepPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Completely Static */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sleep Tracking
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor your sleep patterns and improve your rest quality
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{children}</div>
      </div>
    </div>
  );
}

// Static Loading Fallbacks with enhanced floating effect
function SleepFormSkeleton() {
  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function SleepDataSkeleton() {
  return (
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
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
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
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Page Component
export default function SleepPage() {
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
      title="Sleep Tracking"
      description="Monitor your sleep patterns and improve your rest quality"
      className="grid-cols-1 lg:grid-cols-3"
    >
      {loading ? (
        <div className="lg:col-span-3 flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !userId ? (
        <div className="lg:col-span-3 flex justify-center items-center py-12">
          <p className="text-muted-foreground">Please sign in to track sleep</p>
        </div>
      ) : (
        <SleepContent userId={userId} />
      )}
    </FloatingPageLayout>
  );
}

// Main Content Component
function SleepContent({ userId }: { userId: string }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSleepLogged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      {/* Sleep Form - Will suspend until user resolves */}
      <div className="lg:col-span-2 space-y-6">
        <Suspense fallback={<SleepFormSkeleton />}>
          <UserSleepForm userId={userId} onSleepLogged={handleSleepLogged} />
        </Suspense>
      </div>

      {/* Sleep Statistics - Will suspend until user resolves */}
      <div className="lg:col-span-1">
        <Suspense fallback={<SleepDataSkeleton />}>
          <UserSleepData userId={userId} refreshTrigger={refreshTrigger} />
        </Suspense>
      </div>
    </>
  );
}
