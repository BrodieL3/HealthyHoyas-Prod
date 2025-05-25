"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
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
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar();
  return (
    <div
      data-expanded={expanded}
      className={cn(
        "flex h-full flex-col overflow-hidden border-r bg-card transition-all duration-300 relative",
        expanded ? "w-64" : "w-16",
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
