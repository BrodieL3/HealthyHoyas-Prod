// components/SignInButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignUpSuccessButton() {
  const router = useRouter();

  const handleClick = () => {
    // imperatively navigate
    router.push("/auth/login");
  };

  return (
    <Button onClick={handleClick} className="w-full mt-4">
      Sign In
    </Button>
  );
}
