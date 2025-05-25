"use client";

import { Providers } from "@/providers";
import { AppSidebar } from "@/components/app-sidebar";
import { Suspense, memo } from "react";
import { Loader2 } from "lucide-react";

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

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </Providers>
  );
}
