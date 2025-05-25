"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { getUserProfile } from "@/lib/supabase";
import type { UserProfile as UserProfileType } from "@/lib/supabase";
import { useSidebar } from "@/components/ui/sidebar-minimal";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/login/actions";

// Inner component that uses the sidebar context
const UserProfileContent = memo(function UserProfileContent({
  user,
  profile,
}: {
  user: { email: string; name?: string };
  profile: UserProfileType | null;
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
        onClick={signOut}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
        title="Sign Out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
});

export function UserProfile() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null
  );
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser({
            email: user.email || "",
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "User",
          });

          const userProfile = await getUserProfile(user.id);
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-3 p-4">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="w-8 h-8 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return <UserProfileContent user={user} profile={profile} />;
}
