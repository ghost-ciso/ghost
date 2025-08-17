import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, website } = await req.json().catch(() => ({}));
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("targets")
    .insert({ name, website })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
