import { Dashboard } from "@/components/dashboard";
import type { Metadata } from "next";
import { ServerSkeletons } from "@/components/server-ui";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "HealthyHoyas - Your Health & Fitness Companion",
  description: "Track your health and fitness goals with HealthyHoyas",
};

// Enable static generation for better performance
export const dynamic = "force-dynamic"; // Changed to dynamic to check auth state
export const revalidate = 0; // Disable static generation for this page

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated and trying to access the root path, show dashboard
  if (user && window.location.pathname === "/") {
    const serverSkeletons = ServerSkeletons();
    return <Dashboard fallbackSkeletons={serverSkeletons} />;
  }

  // Show landing page for unauthenticated users or when accessing other public routes
  return <LandingPage />;
}

export async function generateStaticParams() {
  // For static generation
  return [];
}
