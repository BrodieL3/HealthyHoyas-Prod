"use client";

import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// This enables route cache persistence to speed up navigation
function RouteCache() {
  const pathname = usePathname();

  useEffect(() => {
    // Add route to cache on component mount
    window.history.scrollRestoration = "auto";
  }, [pathname]);

  return null;
}

export function Providers({
  children,
  userPromise,
}: {
  children: React.ReactNode;
  userPromise?: Promise<any>;
}) {
  return (
    <>
      <RouteCache />
      {children}
      <Toaster position="top-right" closeButton />
    </>
  );
}
