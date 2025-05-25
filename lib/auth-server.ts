import { createClient } from "@/utils/supabase/server";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// This version creates the promise but doesn't await it
export function getUserPromise() {
  return getUser();
}
