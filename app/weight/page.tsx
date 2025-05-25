"use client";

import { WeighIn } from "@/components/weigh-in";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FloatingPageLayout } from "@/components/floating-page-layout";

export default function WeightPage() {
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
        <p className="text-muted-foreground">Please sign in to track weight</p>
      </div>
    );
  }

  return (
    <FloatingPageLayout
      title="Weight Tracking"
      description="Monitor your weight progress and reach your health goals"
      className="grid-cols-1 lg:grid-cols-3"
    >
      <WeighIn userId={userId} />
    </FloatingPageLayout>
  );
}
