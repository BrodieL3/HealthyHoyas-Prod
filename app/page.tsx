// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import LandingPage from "@/components/landing-page";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/protected/dashboard");
  }

  redirect("/public/landing-page");
}
