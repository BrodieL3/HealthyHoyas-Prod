"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-minimal";

import { Suspense, memo } from "react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";


// Helper function to check if the current path is an auth page
function isAuthPage(pathname: string) {
  return pathname.startsWith('/auth/');
}

// Helper function to check if the current path is an auth or profile setup page
function isAuthOrProfilePage(pathname: string) {
  return pathname.startsWith('/auth/') || pathname === '/profile-setup';
}

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
