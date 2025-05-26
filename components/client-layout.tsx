"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar-minimal";

// Helper function to check if the current path is an auth page
function isAuthPage(pathname: string) {
  return pathname.startsWith('/auth/');
}

// Helper function to check if the current path is an auth or profile setup page
function isAuthOrProfilePage(pathname: string) {
  return pathname.startsWith('/auth/') || pathname === '/profile-setup';
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !isAuthOrProfilePage(pathname);

  return (
    <SidebarProvider>
      {showSidebar && <AppSidebar />}
      <main className={`flex-1 overflow-y-auto ${showSidebar ? '' : 'w-full'}`}>
        {children}
      </main>
    </SidebarProvider>
  );
}
