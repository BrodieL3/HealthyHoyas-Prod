"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/login/actions";
export function LogoutButton() {
  return <Button onClick={signOut}>Logout</Button>;
}
