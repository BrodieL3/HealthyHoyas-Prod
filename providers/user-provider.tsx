"use client";

import { createContext, useContext } from "react";
import { useAuth } from "./auth-provider";

const UserContext = createContext<ReturnType<typeof useAuth>>({
  user: null,
  loading: true,
  error: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <UserContext.Provider value={auth}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
