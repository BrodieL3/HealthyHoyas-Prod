"use client";

import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Using lg breakpoint from Tailwind (1024px)
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}
