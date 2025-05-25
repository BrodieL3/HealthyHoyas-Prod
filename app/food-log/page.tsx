"use client";

import { LogFood } from "@/components/log-food";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FloatingPageLayout } from "@/components/floating-page-layout";

export default function FoodLogPage() {
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
      <FloatingPageLayout
        title="Food Log"
        description="View and manage your food entries"
        className="flex justify-center items-center min-h-[400px]"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </FloatingPageLayout>
    );
  }

  if (!userId) {
    return (
      <FloatingPageLayout
        title="Food Log"
        description="View and manage your food entries"
        className="flex justify-center items-center min-h-[400px]"
      >
        <p className="text-muted-foreground">Please sign in to log food</p>
      </FloatingPageLayout>
    );
  }

  return (
    <FloatingPageLayout
      title="Food Log"
      description="View and manage your food entries"
    >
      <LogFood userId={userId} />
    </FloatingPageLayout>
  );
}
