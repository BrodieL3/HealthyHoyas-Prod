"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  useSidebar,
  TopNavigation,
} from "@/components/ui/sidebar-minimal";

import { Suspense, memo } from "react";
import { Providers } from "@/providers";
import { Loader2 } from "lucide-react";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Main content component
const MainContent = memo(function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </main>
  );
});

// Helper function to check if the current path is an auth page
function isAuthPage(pathname: string) {
  return pathname?.startsWith("/auth");
}

// Auth layout without sidebar
const AuthLayout = memo(function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </div>
  );
});

// Add a wrapper to MainContent to enforce min-w-0
const MainContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { expanded, isMobile, isTablet } = useSidebar();
  return (
    <div
      className={`flex-1 min-w-0 transition-all duration-300 ${
        isMobile
          ? "" // No margin on mobile - we use top nav
          : isTablet
          ? expanded
            ? "" // No margin when tablet sidebar overlays
            : "ml-16" // Margin for collapsed sidebar on tablet
          : expanded
          ? "ml-64" // Full margin on desktop when expanded
          : "ml-16" // Small margin on desktop when collapsed
      }`}
    >
      <TopNavigation />
      <MainContent>{children}</MainContent>
    </div>
  );
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuth = isAuthPage(pathname);

  return (
    <Providers>
      {isAuth ? (
        <AuthLayout>{children}</AuthLayout>
      ) : (
        <SidebarProvider>
          <div className="min-h-screen w-full">
            <AppSidebar />
            <SidebarBackdrop />
            <MainContentWrapper>{children}</MainContentWrapper>
          </div>
        </SidebarProvider>
      )}
    </Providers>
  );
}

// Backdrop for tablet sidebar overlay
const SidebarBackdrop = () => {
  const { expanded, isTablet, setExpanded } = useSidebar();

  if (!isTablet || !expanded) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={() => setExpanded(false)}
    />
  );
};
