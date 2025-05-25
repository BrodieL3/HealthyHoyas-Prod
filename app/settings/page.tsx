"use client";

import { Settings } from "@/components/settings";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FloatingPageLayout } from "@/components/floating-page-layout";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <FloatingPageLayout
        title="Settings"
        description="Manage your profile and preferences"
        className="flex justify-center items-center min-h-[400px]"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </FloatingPageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <FloatingPageLayout
        title="Settings"
        description="Manage your profile and preferences"
        className="flex justify-center items-center min-h-[400px]"
      >
        <p className="text-muted-foreground">Please sign in to view settings</p>
      </FloatingPageLayout>
    );
  }

  return (
    <FloatingPageLayout
      title="Settings"
      description="Manage your profile and preferences"
    >
      <Settings />
    </FloatingPageLayout>
  );
}
