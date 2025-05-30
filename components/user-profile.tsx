"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getUserProfile } from "@/lib/supabase";
import type { UserProfile as UserProfileType } from "@/lib/supabase";
import { useSidebar } from "@/components/ui/sidebar-minimal";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

// Inner component that uses the sidebar context
const UserProfileContent = memo(function UserProfileContent({
  user,
  profile,
  onSignOut,
}: {
  user: { email: string; name?: string };
  profile: UserProfileType | null;
  onSignOut: () => Promise<void>;
}) {
  const { expanded } = useSidebar();
  const [showText, setShowText] = useState(expanded);

  // Delay text appearance when expanding, hide immediately when collapsing
  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => setShowText(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [expanded]);

  // Extract username from email
  const username = user.email?.split("@")[0] || "";
  // Use full name from profile or fall back to name from auth or username
  const displayName = profile?.full_name || user.name || username;

  return (
    <div
      className={cn(
        "flex items-center p-4",
        expanded ? "justify-between" : "justify-center p-2 flex-col space-y-2"
      )}
    >
      <div className={cn("flex items-center", expanded && "space-x-3")}>
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
          <AvatarFallback>{displayName.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        {expanded && showText && (
          <div className="space-y-1 overflow-hidden">
            <p className="text-sm font-bold leading-none truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{username}
            </p>
          </div>
        )}
      </div>

      {/* Sign Out Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSignOut}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
        title="Sign Out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
});

export function UserProfile() {
  const { user: authUser, loading: authLoading, refreshSession } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function loadProfile() {
      if (!authUser) {
        if (mounted) {
          setLoading(false);
          setProfile(null);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userProfile = await getUserProfile(authUser.id);
        if (mounted) {
          if (userProfile) {
            setProfile(userProfile);
            retryCountRef.current = 0; // Reset retry count on success
          } else {
            setError("Failed to load user profile");
            // Retry loading profile if it fails
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++;
              retryTimeout = setTimeout(loadProfile, 2000 * retryCountRef.current); // Increased backoff time
            }
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        if (mounted) {
          setError("An unexpected error occurred");
          // Retry loading profile if it fails
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            retryTimeout = setTimeout(loadProfile, 2000 * retryCountRef.current); // Increased backoff time
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [authUser]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  if (error || !authUser) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Please sign in</p>
      </div>
    );
  }

  return (
    <UserProfileContent
      user={{
        email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      }}
      profile={profile}
      onSignOut={handleSignOut}
    />
  );
}
