import { createBrowserClient } from "@supabase/ssr";

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            console.error(`[Supabase Client] Error in ${table} query:`, {
              error: response.error,
              errorString: JSON.stringify(response.error),
              errorKeys: Object.keys(response.error),
              errorValues: Object.values(response.error),
              query: args
            });
          }
          return response;
        } catch (error) {
          console.error(`[Supabase Client] Unexpected error in ${table} query:`, {
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

  supabaseInstance = client;
  return client;
}
