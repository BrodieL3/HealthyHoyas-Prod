"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  UtensilsCrossed,
  Home,
  Weight,
  Footprints,
  Moon,
  Settings,
  BarChart,
  User,
  Menu,
  X,
  Pill,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  isTablet: boolean;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  // Check screen sizes
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Phone screens
      setIsTablet(width >= 768 && width < 1024); // Tablet screens

      // Auto-collapse on tablet, but keep some form of sidebar
      if (width >= 768 && width < 1024) {
        setExpanded(false);
      }
      // On desktop, default to expanded
      if (width >= 1024) {
        setExpanded(true);
      }
      // On mobile, we'll use a different layout entirely (top nav)
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, isMobile, isTablet }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded, isMobile, isTablet } = useSidebar();

  // Don't render sidebar on mobile (we'll use top nav instead)
  if (isMobile) return null;

  return (
    <div
      data-expanded={expanded}
      data-tablet={isTablet}
      className={cn(
        "flex h-screen flex-col overflow-hidden border-r bg-card transition-all duration-300 fixed left-0 top-0",
        // On tablet: overlay when expanded, collapsed when not
        isTablet
          ? expanded
            ? "w-64 z-50 shadow-xl"
            : "w-16 z-40"
          : // On desktop: normal behavior
          expanded
          ? "w-64 z-40"
          : "w-16 z-40",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar();
  return (
    <div
      data-expanded={expanded}
      className={cn("flex-1 overflow-auto p-4", !expanded && "p-2", className)}
    >
      {children}
    </div>
  );
}

export function SidebarInset({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-full flex-1 flex-col", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t p-3 sticky bottom-0 bg-card", className)}>
      {children}
    </div>
  );
}

// Mobile navigation routes
const mobileRoutes = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/food-log", label: "Food Log", icon: UtensilsCrossed },
  { href: "/steps", label: "Track Steps", icon: Footprints },
  { href: "/sleep", label: "Track Sleep", icon: Moon },
  { href: "/weight", label: "Track Weight", icon: Weight },
  { href: "/analytics", label: "Analytics", icon: BarChart },
  { href: "/alcohol-awareness", label: "Alcohol Awareness", icon: Wine },
  { href: "/drug-awareness", label: "Drug Awareness", icon: Pill },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Top Navigation for mobile screens
export function TopNavigation() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div className="sticky top-0 z-50 bg-card border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - App branding */}
        <Link href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">HealthyHoyas</span>
        </Link>

        {/* Right side - Hamburger menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2 px-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">HealthyHoyas</span>
              </div>
              <div className="space-y-2">
                {mobileRoutes.map((route) => {
                  const Icon = route.icon;
                  const isActive = pathname === route.href;

                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
