"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  Home,
  Weight,
  Footprints,
  Moon,
  Settings,
  BarChart,
  User,
  ChevronRight,
  ChevronLeft,
  Beer,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar-minimal";
import { UserProfile } from "@/components/user-profile";
import { Button } from "@/components/ui/button";
import { memo, useState, useEffect } from "react";

const routes = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/food-log", label: "Food Log", icon: UtensilsCrossed },
  { href: "/steps", label: "Track Steps", icon: Footprints },
  { href: "/sleep", label: "Track Sleep", icon: Moon },
  { href: "/weight", label: "Track Weight", icon: Weight },
  { href: "/analytics", label: "Analytics", icon: BarChart },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/alcohol-awareness", label: "Alcohol Awareness", icon: Beer },
  { href: "/drug-awareness", label: "Drug Awareness", icon: Pill },
];

// Memoize the navigation links to prevent re-rendering
const NavigationLinks = memo(function NavigationLinks() {
  const pathname = usePathname();
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

  return (
    <nav className="space-y-1">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
              !expanded && "justify-center px-2"
            )}
            title={route.label}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {expanded && showText && <span>{route.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
});

// Component for the sidebar header with logo
const SidebarHeader = memo(function SidebarHeader() {
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

  return (
    <div
      className={cn(
        "flex h-14 items-center border-b px-4",
        expanded ? "justify-between" : "justify-center"
      )}
    >
      <div className="flex items-center gap-2 font-semibold">
        <User className="h-5 w-5" />
        {expanded && showText && <span>Healthy Hoyas</span>}
      </div>
    </div>
  );
});

const SidebarToggleButton = memo(function SidebarToggleButton() {
  const { expanded, setExpanded } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const collapseText = "collapse";

  // Reset visible letters when hover state changes
  useEffect(() => {
    if (isHovered) {
      setVisibleLetters(0);
      const timer = setInterval(() => {
        setVisibleLetters((prev) => {
          if (prev >= collapseText.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 50); // 50ms per letter

      return () => clearInterval(timer);
    } else {
      setVisibleLetters(0);
    }
  }, [isHovered]);

  const displayedText = collapseText.slice(0, visibleLetters);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex justify-center items-center relative overflow-hidden"
    >
      <div className="flex items-center transition-transform duration-200">
        {expanded ? (
          <>
            {isHovered && displayedText && (
              <span className="text-xs mr-1 transition-all duration-200">
                {displayedText}
              </span>
            )}
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isHovered && visibleLetters > 0 && "transform"
              )}
            />
          </>
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
    </Button>
  );
});

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-4 py-4">
        <NavigationLinks />
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-3">
          <SidebarToggleButton />
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
