"use client";

import { createContext, useContext, use } from "react";
import type { User } from "@supabase/supabase-js";

// Context to hold the user promise
const UserContext = createContext<{
  userPromise: Promise<User | null>;
} | null>(null);

export function UserProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode;
  userPromise: Promise<User | null>;
}) {
  return (
    <UserContext.Provider value={{ userPromise }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to access user data using React.use()
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  // React.use() unwraps the promise and handles suspense automatically
  const user = use(context.userPromise);
  return user;
}

// Hook to access just the promise (for cases where you need the promise itself)
export function useUserPromise() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserPromise must be used within a UserProvider");
  }
  return context.userPromise;
}
