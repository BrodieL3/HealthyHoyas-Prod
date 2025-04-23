"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase/client";
import { Button } from "./ui/button";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
