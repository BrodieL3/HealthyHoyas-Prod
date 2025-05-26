import { NutritionTracker } from "@/components/nutrition-tracker";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export default async function ProtectedPage() {
  // Attempt to get the current user session server-side
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // If user exists, render the tracker and pass the user ID
  return <NutritionTracker userId={data.user.id} />;
}
