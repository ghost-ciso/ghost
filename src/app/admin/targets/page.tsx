import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";
import AdminTargetsClient from "./ui";

export default async function TargetsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  const supabase = await supabaseServer();
  const { data: targets = [] } = await supabase
    .from("targets")
    .select("id,name,website")
    .order("name");

  return <AdminTargetsClient initial={targets} />;
}
