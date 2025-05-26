"use client";

import { Providers } from "@/providers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-minimal";
import { Suspense, memo } from "react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

// Main content loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// Memoized main content to prevent unnecessary re-renders
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

// Auth layout without sidebar
const AuthLayout = memo(function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </div>
  );
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth");

  return (
    <Providers>
      {isAuthPage ? (
        <AuthLayout>{children}</AuthLayout>
      ) : (
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
      )}
    </Providers>
  );
}
