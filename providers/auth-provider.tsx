"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { User, Session, AuthError } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants for rate limiting
const MAX_REFRESHES_PER_HOUR = 1800; // Supabase's limit
const MIN_REFRESH_INTERVAL = 2000; // 2 seconds minimum between refreshes
const SESSION_CHECK_INTERVAL = 300000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const mounted = useRef(true);
  const lastRefreshTime = useRef(Date.now());
  const refreshCount = useRef(0);
  const refreshTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const refreshCountResetTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const sessionCheckInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const resetRefreshCount = useCallback(() => {
    refreshCount.current = 0;
  }, []);

  const refreshSession = useCallback(async () => {
    const now = Date.now();
    
    // Check if we've exceeded the rate limit
    if (refreshCount.current >= MAX_REFRESHES_PER_HOUR) {
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

        // Reset refresh count after an hour
        if (refreshCountResetTimeout.current) {
          clearTimeout(refreshCountResetTimeout.current);
        }
        refreshCountResetTimeout.current = setTimeout(resetRefreshCount, 3600000);
      }
    } catch (err) {
      console.error("Error refreshing session:", err);
    }
  }, [resetRefreshCount]);

  useEffect(() => {
    const supabase = createClient();
    mounted.current = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }: { data: { session: Session | null }, error: AuthError | null }) => {
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
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
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
          if (refreshCount.current < MAX_REFRESHES_PER_HOUR) {
            router.refresh();
          }
        }
      }, MIN_REFRESH_INTERVAL);
    });

    // Set up periodic session check with a longer interval
    sessionCheckInterval.current = setInterval(() => {
      if (mounted.current) {
        refreshSession();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      mounted.current = false;
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
      if (refreshCountResetTimeout.current) {
        clearTimeout(refreshCountResetTimeout.current);
      }
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 