import { supabaseServer } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
      <p className="mt-2 text-sm text-zinc-600">You’re in. 👻</p>
    </main>
  );
}
