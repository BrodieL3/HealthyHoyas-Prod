import { NutritionTracker } from "@/components/nutrition-tracker";
import { getCurrentUser } from "@/lib/meals";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  // Attempt to get the current user session server-side
  const user = await getCurrentUser();

  // If no user, redirect to login
  if (!user) {
    redirect("/login"); // Redirect to your login page
  }

  // If user exists, render the tracker and pass the user ID
  return <NutritionTracker userId={user.id} />;
}
