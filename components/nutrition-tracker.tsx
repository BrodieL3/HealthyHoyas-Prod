"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Dashboard } from "@/components/dashboard";
import { LogFood } from "@/components/log-food";
import { WeighIn } from "@/components/weigh-in";
import { Settings } from "@/components/settings";
import { Layout } from "@/components/layout";

// Define props type
interface NutritionTrackerProps {
  userId: string;
}

export function NutritionTracker({ userId }: NutritionTrackerProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isMobile={isMobile}
    >
      {activeTab === "dashboard" && (
        <Dashboard setActiveTab={setActiveTab} userId={userId} />
      )}
      {activeTab === "log-food" && <LogFood userId={userId} />}
      {activeTab === "weigh-in" && <WeighIn userId={userId} />}
      {activeTab === "settings" && <Settings />}
    </Layout>
  );
}
