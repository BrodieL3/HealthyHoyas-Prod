"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  refreshSession: async () => {},
});

// Minimum time between auth state changes (5 seconds)
const MIN_REFRESH_INTERVAL = 5000;
// Maximum number of refreshes per minute
const MAX_REFRESHES_PER_MINUTE = 10;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const lastRefreshTime = useRef<number>(0);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const refreshCount = useRef<number>(0);
  const refreshCountResetTimeout = useRef<NodeJS.Timeout | null>(null);
  const mounted = useRef(true);

  const resetRefreshCount = useCallback(() => {
    refreshCount.current = 0;
    if (refreshCountResetTimeout.current) {
      clearTimeout(refreshCountResetTimeout.current);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const now = Date.now();
    
    // Check if we've exceeded the rate limit
    if (refreshCount.current >= MAX_REFRESHES_PER_MINUTE) {
      console.warn('Rate limit reached, skipping refresh');
      return;
    }

    // Check if enough time has passed since last refresh
    if (now - lastRefreshTime.current < MIN_REFRESH_INTERVAL) {
      console.warn('Too soon since last refresh, skipping');
      return;
    }

    try {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error);
        return;
      }
      
      if (mounted.current) {
        setUser(session?.user ?? null);
        lastRefreshTime.current = now;
        refreshCount.current++;

        // Reset refresh count after a minute
        if (refreshCountResetTimeout.current) {
          clearTimeout(refreshCountResetTimeout.current);
        }
        refreshCountResetTimeout.current = setTimeout(resetRefreshCount, 60000);
      }
    } catch (err) {
      console.error("Error refreshing session:", err);
    }
  }, [resetRefreshCount]);

  useEffect(() => {
    const supabase = createClient();
    mounted.current = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted.current) return;
      
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
      lastRefreshTime.current = Date.now();
    });

    // Listen for auth changes with improved debouncing
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return;

      // Clear any existing timeout
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      // Set a new timeout to update the state
      refreshTimeout.current = setTimeout(() => {
        if (!mounted.current) return;
        
        // Only update if the user state actually changed
        if (user?.id !== session?.user?.id) {
          setUser(session?.user ?? null);
          setLoading(false);
          // Only refresh router if we're not rate limited
          if (refreshCount.current < MAX_REFRESHES_PER_MINUTE) {
            router.refresh();
          }
        }
      }, MIN_REFRESH_INTERVAL);
    });

    // Set up periodic session check
    const sessionCheckInterval = setInterval(() => {
      if (mounted.current) {
        refreshSession();
      }
    }, 60000); // Check every minute

    return () => {
      mounted.current = false;
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
      if (refreshCountResetTimeout.current) {
        clearTimeout(refreshCountResetTimeout.current);
      }
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      subscription.unsubscribe();
    };
  }, [router, user?.id, refreshSession]);

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 