"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-minimal";

import { Suspense, memo } from "react";
import { Providers } from "@/providers";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

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

// Helper function to check if the current path is the landing page
function isLandingPage(pathname: string) {
  return pathname === "/";
}

function isAboutPage(pathname: string) {
  return pathname === "/about-page";
}

function isHowItWorksPage(pathname: string) {
  return pathname === "/how-it-works-page";
}

function isFeaturesPage(pathname: string) {
  return pathname === "/features-page";
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
const MainContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-w-0">
    <MainContent>{children}</MainContent>
  </div>
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Helper functions
  function isAuthPage(pathname: string) {
    return pathname?.startsWith("/auth");
  }
  function isLandingPage(pathname: string) {
    return pathname === "/";
  }
  function isAboutPage(pathname: string) {
    return pathname === "/about-page";
  }
  function isHowItWorksPage(pathname: string) {
    return pathname === "/how-it-works-page";
  }
  function isFeaturesPage(pathname: string) {
    return pathname === "/features-page";
  }

  // Show sidebar if:
  // - Authenticated and on root (dashboard)
  // - Or on any other protected route
  const showSidebar = (user && isLandingPage(pathname)) || (!isAuthPage(pathname) && !isLandingPage(pathname) && !isAboutPage(pathname) && !isHowItWorksPage(pathname) && !isFeaturesPage(pathname));

  // Show AuthLayout (no sidebar) if:
  // - On auth page
  // - On landing/about/features/how-it-works and not authenticated
  const showAuthLayout = isAuthPage(pathname) || ((isLandingPage(pathname) || isAboutPage(pathname) || isHowItWorksPage(pathname) || isFeaturesPage(pathname)) && !user);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Providers>
      {showSidebar ? (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <MainContentWrapper>
              {children}
            </MainContentWrapper>
          </div>
        </SidebarProvider>
      ) : (
        <AuthLayout>{children}</AuthLayout>
      )}
    </Providers>
  );
}
