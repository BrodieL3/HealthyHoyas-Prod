import { createClient } from "@/utils/supabase/server";
import { ServerSkeletons } from "@/components/server-ui";
import { Dashboard } from "@/components/dashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProtectedDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <Dashboard userId={user.id} fallbackSkeletons={ServerSkeletons()} />;
} 