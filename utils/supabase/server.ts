"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error("[Supabase Server] Error setting cookies:", error);
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'x-application-name': 'healthy-hoyas',
        },
      },
    }
  );

  // Add error logging middleware
  const originalFrom = client.from;
  client.from = function(table: string) {
    const query = originalFrom.call(this, table);
    const originalSelect = query.select;
    query.select = function(...args: any[]) {
      const result = originalSelect.apply(this, args);
      const originalSingle = result.single;
      result.single = async function() {
        try {
          const response = await originalSingle.call(this);
          if (response.error) {
            console.error(`[Supabase Server] Error in ${table} query:`, {
              error: response.error,
              errorString: JSON.stringify(response.error),
              errorKeys: Object.keys(response.error),
              errorValues: Object.values(response.error),
              query: args
            });
          }
          return response;
        } catch (error) {
          console.error(`[Supabase Server] Unexpected error in ${table} query:`, {
            error,
            errorString: JSON.stringify(error),
            errorKeys: Object.keys(error),
            errorValues: Object.values(error),
            query: args
          });
          throw error;
        }
      };
      return result;
    };
    return query;
  };

  return client;
}
