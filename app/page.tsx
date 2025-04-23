import { NutritionTracker } from "@/components/nutrition-tracker";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // If user is authenticated, show the dashboard or home page
  return (
    <div className="min-h-screen">
      <NutritionTracker />
    </div>
  );
}
