"use client";

import { PageHeaderDate } from "./page-header-date";
import { useSidebar } from "@/components/ui/sidebar-minimal";
import { cn } from "@/lib/utils";

interface FloatingPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FloatingPageLayout({
  children,
  title,
  description,
  className = "",
}: FloatingPageLayoutProps) {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div
        className={cn(
          "bg-transparent backdrop-blur-md pr-6 py-4 sticky top-0 z-10 transition-all duration-300",
          expanded ? "pl-20" : "pl-6"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <PageHeaderDate />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "max-w-7xl mx-auto pr-6 py-6 transition-all duration-300",
          expanded ? "pl-20" : "pl-6"
        )}
      >
        <div className={`grid gap-6 ${className}`}>{children}</div>
      </div>
    </div>
  );
}
