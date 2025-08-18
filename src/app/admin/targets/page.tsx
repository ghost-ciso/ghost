import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";
import AdminTargetsClient from "./ui";
import type { Target } from "@/types";

export default async function TargetsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/dashboard");

  const supabase = await supabaseServer();
  const { data: targets } = await supabase
    .from("targets")
    .select("id,name,website")
    .order("name");

  const initial: Target[] = (targets ?? []).map(t => ({
    id: t.id as string,
    name: t.name as string,
    website: (t.website ?? null) as string | null,
  }));

  return <AdminTargetsClient initial={initial} />;
}
