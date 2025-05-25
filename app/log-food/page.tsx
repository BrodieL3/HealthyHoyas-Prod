"use client";

import { LogFood } from "@/components/log-food";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FloatingPageLayout } from "@/components/floating-page-layout";

export default function LogFoodPage() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get dining hall ID from URL params (for quick log)
  const diningHallId = searchParams.get("diningHallId");

  useEffect(() => {
    async function getUserId() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getUserId();
  }, []);

  if (isLoading) {
    return (
      <FloatingPageLayout
        title="Log Food"
        description="Record your meals and track your nutrition"
        className="flex justify-center items-center min-h-[400px]"
      >
        <div className="text-center">Loading...</div>
      </FloatingPageLayout>
    );
  }

  if (!userId) {
    return (
      <FloatingPageLayout
        title="Log Food"
        description="Record your meals and track your nutrition"
        className="flex justify-center items-center min-h-[400px]"
      >
        <div className="text-center">Please sign in to log food.</div>
      </FloatingPageLayout>
    );
  }

  return (
    <FloatingPageLayout
      title="Log Food"
      description="Record your meals and track your nutrition"
    >
      <LogFood userId={userId} initialDiningHallId={diningHallId} />
    </FloatingPageLayout>
  );
}
