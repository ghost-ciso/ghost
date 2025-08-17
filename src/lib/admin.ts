import { supabaseServer } from "@/lib/supabase/server";

function adminList() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const admins = adminList();
  const email = (user?.email || "").toLowerCase();
  return { user, isAdmin: !!email && admins.includes(email) };
}
