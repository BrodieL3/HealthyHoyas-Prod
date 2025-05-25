import { Dashboard } from "@/components/dashboard";
import type { Metadata } from "next";
import { ServerSkeletons } from "@/components/server-ui";

export const metadata: Metadata = {
  title: "Dashboard | HealthyHoyas",
  description: "Track your health and fitness",
};

// Enable static generation for better performance
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

// Pre-render server components for the dashboard
export default async function Home() {
  // Pre-render server components to pass as props
  const serverSkeletons = ServerSkeletons();

  return <Dashboard fallbackSkeletons={serverSkeletons} />;
}

export async function generateStaticParams() {
  // For static generation
  return [];
}
