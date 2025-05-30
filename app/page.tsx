// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { ServerSkeletons } from "@/components/server-ui";
import { Dashboard } from "@/components/dashboard";
import LandingPage from "@/components/landing-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();


  console.log("User in app/page.tsx:", user);
  
  if (user) {
    // Authenticated → show dashboard
    return <Dashboard user={user} fallbackSkeletons={ServerSkeletons()} />;
  }

  // Unauthenticated → show landing page
  return <LandingPage />;
}
