import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TestSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 32 }}>
      <h1>Session Test</h1>
      <pre>{JSON.stringify({ user, error }, null, 2)}</pre>
    </div>
  );
} 