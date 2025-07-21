"use client";

import { PageHeaderDate } from "@/components/page-header-date";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-transparent backdrop-blur-md pr-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
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
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className={`grid gap-6 ${className}`}>{children}</div>
      </div>
    </div>
  );
}
