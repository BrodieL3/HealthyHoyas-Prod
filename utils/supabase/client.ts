import { createBrowserClient } from "@supabase/ssr";

// Create a single instance of the Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  }
);

// Export the single instance
export default supabase;
